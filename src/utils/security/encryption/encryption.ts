
import crypto from 'node:crypto'
import { ENC_SECRET_KEY, IV_LENGTH } from '../../../config'





// encryption

export const generateEncryption = async (plainText:string):Promise<string>=>{
    
    const IVLENGTH = Number(IV_LENGTH)
    const iv = crypto.randomBytes(IVLENGTH)
    const cipherIV = crypto.createCipheriv('aes-256-cbc',ENC_SECRET_KEY,iv)
    let cipherText = cipherIV.update(plainText,'utf-8','hex')
   cipherText += cipherIV.final('hex')
//    console.log({iv,cipherIV,cipherText});

   return `${iv.toString('hex')}:${cipherText}`
   
    

}

/// decryption

export const generateDncryption = async (cipherText:string):Promise<string>=>{

   if (!cipherText) {
        throw new Error("Encrypted text is required for decryption")
    }

    const parts = cipherText.split(":") 

    if (parts.length !== 2) {
        throw new Error("Invalid encrypted format")
    }

    const [iv, encryptedData] = parts as [string,string]
    const ivLikeBinary = Buffer.from(iv,'hex')
    let decipherIV = crypto.createDecipheriv('aes-256-cbc', ENC_SECRET_KEY,ivLikeBinary)
    let plainText = decipherIV.update(encryptedData,'hex','utf-8')
    plainText += decipherIV.final('utf-8')
    
    // console.log({iv,encryptedData,ivLikeBinary,decipherIV,plainText});
    return plainText
}
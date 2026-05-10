import bcrypt from 'bcrypt'
import { SALT } from '../../../config'
import { AppError } from '../../errorHandle/error.handle'


//hashing

export const hash = async(text:string | number):Promise<string>=>{
    
    if(!SALT){
        throw new AppError("internal server error",400)
    }
    const hash = await bcrypt.hash(typeof text == "string"?text :JSON.stringify(text) ,Number(SALT))

    return hash
    }


 // compare hash
export const compare = async(text:string | number ,hashed:string ):Promise<boolean>=>{
    
    const compareResult = await bcrypt.compare(typeof text == "string"?text :JSON.stringify(text),hashed)

    return compareResult
    }




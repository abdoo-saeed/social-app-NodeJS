import { sign,verify,decode, Secret, SignOptions } from "jsonwebtoken"





export const createToken =(data:string|object ,signature:Secret, options?: SignOptions)=>{

    const token = sign(data,signature,options)
    return token

}


export const verifyToken =(token:string ,signature:Secret)=>{

   
    return verify(token,signature)

}

export const decodeToken =(token:string)=>{

   
    return decode(token)

}



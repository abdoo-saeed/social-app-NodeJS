import {  Types } from "mongoose"
import { redisClient } from "../redis.connection"


// when i want to delete all
export const revokedTokenPrefix = ({userId}:{userId:string | Types.ObjectId})=>{ // user:revokedToken:id
    return `user:${userId}:revokedToken`

}
export const revokedTokenKey = ({userId,jti}:{userId:string | Types.ObjectId,jti:string})=>{ // user:revokedToken:id
    return `${revokedTokenPrefix({userId})}:${jti}`

}
export const confirmEmailKeyPrefix = ({userId}:{userId:string | Types.ObjectId})=>{ // user:revokedToken:id
    return `user:${userId}:confirmEmail`

}
export const forgetPassKeyPrefix = ({userId}:{userId:string})=>{ // user:revokedToken:id
    return `user:${userId}:forgetPassword`

}



export const set = async ({key, value, ttl=null}:{key:string,value:object|string,ttl:number|any})=>{
    try {
        const data  = typeof value != "string" ? JSON.stringify(value) : value

        if(ttl){
          return await redisClient.set(key,data,{
            expiration:{type:"EX",value:ttl}
          })
        }else{
         return await redisClient.set(key,data,{
            expiration:{
                type:"EX",
                value:ttl
            }
         })
        }

    } catch (error) {
        console.log('redis set error : ',error);
        return undefined
        
    }
}



export const get = async ({key}:{key:string})=>{
    try {
        const data = await redisClient.get(key)
        return data

    } catch (error) {
         console.log('redis get error : ',error);
         return undefined
    }
}




export const update = async ({key, value, ttl=null}:{key:string,value:object|string,ttl:number|null})=>{
    try {
        const isExist = await redisClient.exists(key)
        if (!isExist) {
            return false
        }
        return await set({key,value,ttl})
        
    } catch (error) {
        console.log('redis update error : ',error);
        return undefined
    }
}




export const deletByKey = async (key:string)=>{
    try {
       return await redisClient.del(key)
    } catch (error) {
         console.log('redis delete error : ',error); 
         return undefined       
    }
}



export const expire = async ({key,ttl}:{key:string,ttl:number})=>{
    try {
       return await redisClient.expire(key,ttl)
    } catch (error) {
         console.log('redis expire error : ',error);   
         return undefined     
    }
}



export const getTtl = async (key:string)=>{
    try {
       return await redisClient.ttl(key)
    } catch (error) {
         console.log('redis ttl error : ',error);     
         return undefined   
    }
}





export const getKeyByPrefix = async (prefix:string)=>{
    try {
       return await redisClient.keys(prefix)
    } catch (error) {
         console.log('redis get error : ',error);    
         return undefined    
    }
}
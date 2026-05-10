import { Response } from "express";


interface ISuccessRes {

    res:Response
    data?:Object
    message?:string
    status?:number
}


export const successRes =({ res ,data = {}, message ="success" ,status=200 }:ISuccessRes)=>{

    res.status(status).json({
        message,
        data,
        status
    })
}
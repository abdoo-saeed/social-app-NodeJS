import { NextFunction, Request, Response } from 'express';
import * as z from 'zod';
import { $ZodIssue } from 'zod/v4/core';
import { ValidationExecption } from './../utils/errorHandle/error.handle';




export type keyType = keyof Request
export type schemaType =Partial <Record<keyType,z.ZodType>> // partial for optional like: to take body only

export const validation = (schema:schemaType)=>{

    

    return(req:Request,res:Response,next:NextFunction)=>{
        const keys = Object.keys(schema) as keyType[]
        const validationErrors:$ZodIssue[] = []

        if (req.files) {
            
            req.body.files = req.files;
        }
        if (req.file) {
            
            req.body.file = req.file;
        }

        //iterate  if it body or query or param
        keys.map(key=>{
            if(schema[key]){
                const validationRes = schema[key].safeParse(req[key])
                if(!validationRes.success){
                    validationErrors.push(...validationRes.error.issues) //return the errors to the array
                }
               
            }
        })

        if(validationErrors.length){
            throw new ValidationExecption(validationErrors) //print the array of errors
        }

        return next()
    }

  
}



import { Request } from "express"
import { FileFilterCallback } from "multer"
import { BadRequestExecption } from "../errorHandle/error.handle"




export const fileFieldValidation={
    image:["image/jpeg","image/jpg","image/png","image/bmp"],
    video:['video/mp4']
}


export const fileFilter = (validation:string[])=>{
    return function(req:Request,file:Express.Multer.File,cb:FileFilterCallback){

        if(!validation.includes(file.mimetype)){
            return cb(new BadRequestExecption("invalid file format"))

        }

        return cb(null,true) 
    }

}
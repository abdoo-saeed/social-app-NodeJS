import {z} from "zod"
import { fileFieldValidation } from ".";



export const generateValidationFeild ={
    file:function(mimetype:string[]){
        return z.strictObject({
            
    fieldname: z.string(),
    originalname:z.string(),
    encoding: z.string(),
    mimetype: z.enum(mimetype),
    // buffer: z.any().optional(),
    path: z.string().optional(),
    destination: z.string().optional(), 
    filename: z.string().optional(), 
    size: z.number()
  

        }).superRefine((args,ctx)=>{
            if(!args.path ){
                ctx.addIssue({
                code: "custom",
                path: ["path"],
                message: "path is required"
            });
            }
        })
    }
}



export const uploadProfileSchema ={
    file:generateValidationFeild.file(fileFieldValidation.image).required()
}
export const uploadCoverSchema ={
      files: z
    .array(generateValidationFeild.file(fileFieldValidation.image))
    .min(1)
    .max(2)
}
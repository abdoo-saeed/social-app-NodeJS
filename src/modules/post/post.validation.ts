import z from "zod"
import { AvalibalityEnum } from "../../DB/Enums/post.enum"
import { Types } from "mongoose";
import { generateValidationFeild } from "../../utils/multer/generalValidation";
import { fileFieldValidation } from "../../utils/multer";





export const createPostSchema = {
    body:z.object({
        content:z.string().optional(),
        files:z.array(generateValidationFeild.file(fileFieldValidation.image)).optional(),
        tags:z.array(z.string()).optional(),
        availability:z.coerce.number().default(AvalibalityEnum.PUBLIC)
    }).superRefine((args, ctx) => {

        const hasContent = args.content && args.content.trim().length > 0;
        const hasAttachments =args.files && args.files.length > 0;
        if (!hasContent && !hasAttachments) {
            ctx.addIssue({
                code: "custom",
                path: ["content"],
                message: "content or attachments is required"
            });
        }


        if(args.tags?.length){
            const uniqueTags = [...new Set(args.tags)]
            if(uniqueTags.length != args.tags.length){
                 ctx.addIssue({
                code: "custom",
                path: ["tags"],
                message: "duplicated tags "
            });
            }

            for (const tag of args.tags) {
                if(!Types.ObjectId.isValid(tag)){
                 ctx.addIssue({
                  code: "custom",
                  path: ["tags"],
                  message: `invalid tag object id ${tag} `
                 });

                }
                
            }
        }

    })

}





export const reactPost = {
    params:z.object({
        postId:z.string().refine(value => Types.ObjectId.isValid(value), "in-valid objectid")
    }),
    query: z.object({
       react: z.coerce.number()
    }),

}




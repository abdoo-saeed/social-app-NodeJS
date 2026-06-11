import multer from "multer"
import { randomUUID } from "node:crypto"
import{tmpdir} from "node:os"
import type { Request } from 'express';
import { storageApproachEnum } from "../../DB/Enums/multer.enum";
import { fileFilter } from "./validation.multr";







export const cloudFileUploud = ({
    storageApproach=storageApproachEnum.DISK,
    validation= [],
    maxSize=2
}:{
    storageApproach?:storageApproachEnum,
    validation?:string[],
    maxSize?:number
})=>{


    // const storage = multer.memoryStorage() // on RAM 

    const storage = storageApproach==storageApproachEnum.MEMORY ?multer.memoryStorage(): multer.diskStorage({

        filename:function(req,file,cb){
            cb(null,file.originalname)
        }
        
    })

    return multer({fileFilter:fileFilter(validation), storage, limits:{fileSize:maxSize*1024*1024}})
}
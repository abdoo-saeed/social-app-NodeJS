// utils/cloudinary/upload.ts
// import { cloud } from "./cloudinary"


import cloudinary from "./cloudinary"


export const uploud = async({filePath,folder}:{filePath:string,folder:string})=>{

    return await cloudinary.uploader.upload(filePath,{folder})

}

export const uploadFiles = async({files=[],folder}:{files:Express.Multer.File[],folder:string})=>{

    let attachments = []
    for (const file of files) {
        const {public_id,secure_url} = await uploud({filePath:file.path,folder})
        attachments.push({public_id,secure_url})
    }

    return attachments
}



export const deleteFile = async(public_id:string)=>{

    return await cloudinary.uploader.destroy(public_id)

}
export const deleteFileWithPublicIds = async(public_ids:string[])=>{

    return await cloudinary.api.delete_resources(public_ids)

}







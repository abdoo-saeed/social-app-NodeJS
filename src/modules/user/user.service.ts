import { HydratedDocument } from "mongoose";
import { IUser, userModel } from "../../DB/models/userModel";
import { HUser } from "../auth/auth.dto";
import { UserRepo } from '../../DB/repo/user.repo';
import { NotFoundExecption } from "../../utils/errorHandle/error.handle";
import cloudinary from "../../utils/multer/cloudinary";
import { APPLICATION_NAME } from "../../config";
import { deleteFile, deleteFileWithPublicIds, uploadFiles, uploud } from "../../utils/multer/cloudinary.service";



class userService{

       private readonly userRepo:UserRepo


    constructor(){
        this.userRepo = new UserRepo()
    }



    async profile(user:HydratedDocument<IUser>):Promise<IUser>{

        return user.toJSON()
    }

 ///////////////////////////




async profileImage(
    file: Express.Multer.File,
    user: HUser
) {
   
  if(user.profileImage?.public_id){
    await deleteFile(user.profileImage.public_id)

  }
  const {public_id,secure_url} = await uploud({filePath:file.path,folder:`${APPLICATION_NAME}/users/${user._id}/profile`})


     user.profileImage = {public_id,secure_url}

     await user.save()

    return "user profileImage uploaded "
}


  ///////////////////////////////////////////


  async coverImage(
    files: Express.Multer.File[],
    user: HUser
) {

  if(user.coverImage?.length ){
    await deleteFileWithPublicIds(user.coverImage.map(({public_id})=> public_id))
  }
   

  user.coverImage = await uploadFiles({files,folder:`${APPLICATION_NAME}/users/${user._id}/cover`})

  
    await user.save()

    return "user coverImage uploaded";
}



 ///////////////////////////



  async deleteProfile(user:HUser){

    const account = await this.userRepo.deleteOne({filter:{_id:user._id , force:true}})

    if(!account.deletedCount){
        throw new NotFoundExecption("invalid account")
    }

    return account


  } 

}





export default new userService()
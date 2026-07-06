import { AvalibalityEnum } from "../../DB/Enums/post.enum";
import { HUser } from "../../modules/auth/auth.dto"



export const getAvalibality = (user:HUser)=>{
    return [
                {availability:AvalibalityEnum.PUBLIC},
                {availability:AvalibalityEnum.ONLY_ME,createdBy:user._id},
                {availability:AvalibalityEnum.FRIENDS,createdBy:{$in:[ user._id,...user.friends || [] ]}},
                {tags:{$in:[user._id]}},   
              ];
              
}
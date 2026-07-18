import { Types } from "mongoose";
import { UserRepo } from "../../DB/repo";
import { BadRequestExecption, NotFoundExecption } from "../../utils/errorHandle/error.handle";
import { HUser } from "../auth/auth.dto";
import { createPostDto, ReactPostparamDto, ReactPostQueryDto } from "./post.dto";
import { PostRepo } from './../../DB/repo/post.repo';
import { notify } from "../../utils/notification/notification.service";
import { IPost } from "../../DB/models";
import { APPLICATION_NAME } from "../../config";
import { uploud } from "../../utils/multer";
import { AvalibalityEnum } from "../../DB/Enums/post.enum";
import { getAvalibality } from "../../utils/postUtilis.ts/post";
import { paginateDto } from "../../utils/generalValidations/validation";
import { IPaginate } from "../../DB/interfaces/paginationInterface";
import { update } from './../../DB/repo/redis.repo';

class PostService {
  private readonly userRepo = new UserRepo();
  private readonly postRepo = new PostRepo();




  async createPost(
    { availability, content, files, tags }: createPostDto,
    user: HUser,
  ): Promise<IPost> {
    const mentions: Types.ObjectId[] = [];
    const FCM_tokens: string[] = [];

    if (tags?.length) {
      const mentionedAccount = await this.userRepo.find({
        filter: { _id: { $in: tags } },
      });

      if (mentionedAccount.length !== tags.length) {
        throw new NotFoundExecption(
          "fail to find some or all mentioned accounts",
        );
      }

      for (const account of mentionedAccount) {
        mentions.push(
          Types.ObjectId.createFromHexString(account._id.toString()),
        );

        if (account.FCM_token) {
          FCM_tokens.push(account.FCM_token);
        }
      }
    }

    const attachments = files?.length
      ? await Promise.all(
          (files as Express.Multer.File[]).map(async (file) => {
            const { public_id, secure_url } = await uploud({
              filePath: file.path,
              folder: `${APPLICATION_NAME}/users/${user._id}/posts`,
            });

            return {
              public_id,
              secure_url,
            };
          }),
        )
      : [];

    const post = await this.postRepo.create({
      ...(content && { content }),
      attachments,
      tags: mentions,
      availability,
      createdBy: user._id,
      folderId: user._id.toString(),
    });

    if (!post) {
      throw new BadRequestExecption("fail to upload post!");
    }

    if (FCM_tokens.length) {
      await notify.sendNotifications({
        tokens: FCM_tokens,
        data: {
          title: "post mention",
          body: JSON.stringify({
            message: `${user.username} mentioned you in his post`,
            postId: post._id,
          }),
        },
      });
    }

    return post;
  }


  async postList({page,size,search}:paginateDto,user: HUser,): Promise<IPaginate<IPost>> {
    
    const posts = await this.postRepo.paginate({
        filter:{
          $or:getAvalibality(user),
          exceptedFor:{$in:[user._id]},
          ...(search ? {content:{$regex:search,$options:"i"}} : {})
        },
        page,size
    })

    return posts;
  }



  




    async reactPost(
     {postId}:ReactPostparamDto, {react}:ReactPostQueryDto,
      user: HUser,
  ): Promise<IPost> {
   
    const post = await this.postRepo.findOneAndUpdate({
      filter:{
        _id:postId,
        $or:getAvalibality(user)
      },
      update:{
        ...(Number(react) > 0 ? {$addToSet:{likes:user._id}} : {$pull:{likes:user._id}} )
        
      }
    })

    if(!post){
      throw new NotFoundExecption("fail to find post")
    }

    return post.toJSON()

  }






}


export  const postService = new PostService()



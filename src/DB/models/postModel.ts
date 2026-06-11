import { Types } from "mongoose";
import { IUser } from "./userModel";
import { AvalibalityEnum } from "../Enums/post.enum";
import mongoose, { Model, Schema, model } from "mongoose";







export interface IPost {
    folderId:string,
    content?:string,
    attachments?:{public_id:string,secure_url:string}[],

    likes?:Types.ObjectId[] | IUser[],
    tags?:Types.ObjectId[] | IUser[],
    availability:AvalibalityEnum,

    createdBy:Types.ObjectId | IUser,
    updatedBy?:Types.ObjectId | IUser,

    createdAt:Date,
    deletedAt?:Date,
    restoredAt?:Date,
    updatedAt?:Date,
}






const postSchema = new Schema<IPost>(
  {

    folderId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required:function(this){return !this.attachments?.length}
     
    },
    attachments:[{
      public_id:String,
      secure_url:String
    }
    ]
      
    ,
    availability: {
      type: Number,
      enum:AvalibalityEnum,
      default:AvalibalityEnum.PUBLIC
    },
    likes: [
  {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
],
tags: [
  {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
],
    createdBy: {
      type: Types.ObjectId,
      ref:"User",
      required:true
    },
    updatedBy: {
      type: Types.ObjectId,
      ref:"User"
    },
    deletedAt: {
      type:Date
    },
    restoredAt: {
      type:Date
    },
     
    
    
   
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      getters: true,
    },
    toObject: {
      virtuals: true,
      getters: true,
    },
    strictQuery: true, // search stricted
    strict: true, // do not insert thing not in schema
    validateBeforeSave: true,
    optimisticConcurrency: true,
  }
);







// model middleware
  // userSchema.pre("insertMany",function(docs){
  //     console.log(this,docs);
  // })
  // userSchema.post("insertMany",async function(docs,next){
  //     console.log(this,docs);
     
  // })







export const postModel = mongoose.models.Post as Model<IPost> || model<IPost>("Post", postSchema);
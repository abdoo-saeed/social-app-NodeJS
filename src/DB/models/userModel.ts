import mongoose, { Model, Schema, model } from "mongoose";
import { Gender, provider, Provider } from './../Enums/user.enum';


export interface IUser {
  firstName:string;
  lastName: string;
  email: string;
  password: string;
  gender: Gender;
  confirmEmail: boolean;
  age?: number;
  phone?: string;
  FCM_token?: string;
  profileImage?:{public_id:string,secure_url:string}
  coverImage?:{public_id:string,secure_url:string}[];
  credential_changedAt: Date;
  isDeleted: boolean;
  provider:Provider;
//virtual
  username?: string; 
}




const userSchema = new Schema<IUser>(
  {

    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 25,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 25,
    },
    email: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 250,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      // function (this: UserDocument) {
      //   return this.provider === provider.system;
      // },
      minlength: 8,
    },
    gender: {
      type: Number,
      default: Gender.male,
      enum: [Gender.male,Gender.female]
    },
    profileImage: {
      public_id:String,
      secure_url:String
    },
    coverImage:[ {
     public_id:String,
     secure_url:String
    }],
    FCM_token: {
    type: String
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    age: Number,
    phone: String,
    credential_changedAt: Date,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    provider:{
      type:Number,
      default:provider.system,
      enum:[provider.system,provider.google]

    }
   
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


userSchema
  .virtual("name")
  .set(function (this: IUser, value: string) {
    const parts = value.trim().split(" ");
    this.firstName = parts[0] ?? "";
    this.lastName = parts.slice(1).join(" ") ?? "";
  })
  .get(function (this: IUser) {
    return `${this.firstName} ${this.lastName}`;
  });






// model middleware
  // userSchema.pre("insertMany",function(docs){
  //     console.log(this,docs);
  // })
  // userSchema.post("insertMany",async function(docs,next){
  //     console.log(this,docs);
     
  // })







export const userModel = mongoose.models.User as Model<IUser> || model<IUser>("User", userSchema);
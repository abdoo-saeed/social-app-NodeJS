import mongoose, { Model, Schema, model } from "mongoose";
import { Gender, provider, Provider } from './../Enums/user.enum';


export interface IUser {
  name:string;
  email: string;
  password: string;
  gender: Gender;
  confirmEmail: boolean;
  age?: number;
  phone?: string;
  credential_changedAt: Date;
  isDeleted: boolean;
  provider:Provider;
//virtual
  username?: string; 
}


const userSchema = new Schema<IUser>(
  {

    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
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


// userSchema
//   .virtual("username")
//   .set(function (this: UserDocument, value: string) {
//     const [firstName, lastName] = value.split(" ");
//     this.set("firstName", firstName);
//     this.set("lastName", lastName);
//   })
//   .get(function (this: UserDocument) {
//     return `${this.firstName} ${this.lastName}`;
//   });


export const userModel = mongoose.models.User as Model<IUser> || model<IUser>("User", userSchema);
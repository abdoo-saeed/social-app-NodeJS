import { Request } from "express";
import { HydratedDocument } from "mongoose";
import { IUser } from "../../DB/models/userModel";



export interface IRequest extends Request{

    user?:HydratedDocument<IUser>
}
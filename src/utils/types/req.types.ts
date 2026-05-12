import { Request } from "express";
import { HydratedDocument } from "mongoose";
import { IUser } from "../../DB/models/userModel";



export interface IRequest extends Request{

    user?:HydratedDocument<IUser>

    decoded?: {
        iat: number
        jti: string
        _id: string
    }
}
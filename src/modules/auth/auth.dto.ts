import { HydratedDocument } from "mongoose";
import { IUser } from "../../DB/models/userModel";
import z from "zod"
import { confirmEmailSchema, loginSchema, logoutSchema, signUpSchema } from "./auth.validation";


export type HUser = HydratedDocument<IUser>

export type SignUpDTO = z.infer<typeof signUpSchema.body>
export type confirmDTO = z.infer<typeof confirmEmailSchema.body>
export type loginDTO = z.infer<typeof loginSchema.body>
export type logoutDTO = z.infer<typeof logoutSchema.body>
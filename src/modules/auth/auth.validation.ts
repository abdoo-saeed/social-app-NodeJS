import { z } from "zod";


 export const signUpSchema= {
 body:  z.object({
    name: z.string().min(3).max(15),
    email: z.email(),
    password: z.string().regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#!_%^&*])(?=.*[0-9])(?!.*\s).{8,}$/),
    repeatPassword: z.string().optional(),
    age: z.number().optional(),
    phone:z.string().min(10).max(11).optional(),
    gender:z.union([
      z.literal(0),
      z.literal(1)
    ])
  }).superRefine((value,ctx) => {
    if (value.password != value.repeatPassword) {
      ctx.addIssue({
        code:"custom",
        message:"password mismatch",
        path:["password","repeatPassword"]
      })
    }
  }

)}



 export const confirmEmailSchema ={
  body:z.object({
    email:z.email(),
    otp:z.number().min(100000).max(999999)
  })
 }
  


 export const loginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#!_%^&*])(?=.*[0-9])(?!.*\s).{8,}$/,
      "Invalid password format"
    ),
  }),
};
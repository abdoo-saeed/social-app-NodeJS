import { Router, type Router as routerType } from "express";
import { authServices } from "./auth.service";
import { successRes } from "../../utils/types/success.response";
import { validation } from "../../middlewares/validation.middleware";
import { confirmEmailSchema, loginSchema, signUpSchema } from "./auth.validation";
import { IRequest } from "../../utils/types/req.types";
import { auth } from "../../middlewares/auth.middleware";






const router:routerType = Router()
const routes = {
    // base: "/auth",
    signup: "/signUp",
    confirmEmail:"/confirm-email",
    login:"/login",
    profile:"/profile"
}




router.post(routes.signup,
    validation(signUpSchema),
    async(req,res,next)=>{

        const {email,password,gender,age,phone,name} = req.body 
        const {data} = await authServices.signUp({email,password,gender,age,phone,name})

       return successRes({
        res,
        data
       })
    }  
)


router.post(routes.login,
    validation(loginSchema),
    async (req,res)=>{
        const {email,password} = req.body
        const {data} = await authServices.login({email,password})

        successRes({
            res,
            data,
            message:"login succesfully"
        })

    }
)



router.patch(routes.confirmEmail,
    validation(confirmEmailSchema),
    async(req,res)=>{

        const {email,otp} = req.body 
        const {data} = await authServices.confirmEmail({email,otp})

       return successRes({
        res,
        data
       })
    }  
)





router.get(routes.profile,
    auth,
    (req,res)=>{
        const {user} = req as IRequest

        successRes({
            res,
            data:{user}
        })

    }
)

export default router
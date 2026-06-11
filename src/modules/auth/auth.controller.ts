import { Response, Router, type Router as routerType } from "express";
import { authServices } from "./auth.service";
import { successRes } from "../../utils/types/success.response";
import { validation } from "../../middlewares/validation.middleware";
import { confirmEmailSchema, loginSchema, logoutSchema, signUpSchema } from "./auth.validation";
import { IRequest } from "../../utils/types/req.types";
import { auth } from "../../middlewares/auth.middleware";
import { AppError, BadRequestExecption } from "../../utils/errorHandle/error.handle";






const router:routerType = Router()
const routes = {
    // base: "/auth",
    signup: "/signUp",
    confirmEmail:"/confirm-email",
    login:"/login",
    profile:"/profile",
    refreshToken:"/refresh-token",
    logout:"/logout"
}




router.post(routes.signup,
    validation(signUpSchema),
    async(req,res,next)=>{

        const {email,password,gender,age,phone,firstName,lastName} = req.body 
        const {data} = await authServices.signUp({email,password,gender,age,phone,firstName,lastName})

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



router.post(routes.refreshToken,
    async (req, res) => {

         
     const authHeader = req.headers.authorization;
     const refreshToken = authHeader?.split(" ")[1];

        // console.log("Extracted Token:", refreshToken)
        if (!refreshToken) {
            throw new AppError("there is no refresh token")
        }

        try {
            const { data } = await authServices.refreshToken(refreshToken)
            return successRes({ res, data })
        } catch (error: any) {
           throw new BadRequestExecption("error with decoded")
        }
    }
)




router.patch(routes.logout,
    auth,
    validation(logoutSchema),
    async(req:IRequest,res:Response)=>{
        const {flag} = req.body

        const {data}= await authServices.logoutService({
            user:req.user!,
            iat:req.decoded!.iat,
            jti:req.decoded!.jti,
            flag
        })

        successRes({res,data})
    }
)








export default router
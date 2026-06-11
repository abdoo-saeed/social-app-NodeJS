import express,{Express, NextFunction, Request, Response} from "express"
import { PORT } from "./config";
import authRouter from "./modules/auth/auth.controller";
import { IAppError } from "./utils/types/error";
import { NotFoundExecption } from "./utils/errorHandle/error.handle";
import{ DBConnection} from "./DB/db.connection"
import { testRedisConnection } from "./DB/redis.connection";
import userRouter from "./modules/user/user.controller";
import postRepo from "./modules/post/post.controller";
import { resolve } from "path";



const app:Express = express()

export const bootstrap =async ()=>{
app.use(express.json())
await DBConnection()
await testRedisConnection()




    app.use("/auth",authRouter)
    app.use("/user",userRouter)
    app.use("/post",postRepo)



    // try {
    //     const userrepo = new UserRepo()
    //     const user = await userrepo.inserMany({data:[{username:"abdo saeed", email:`${Date.now()}`,password:"Strong#1"}]})
    // } catch (error) {
        
    // }





    app.all("/*dummy",(req,res)=>{
        throw new NotFoundExecption("page not found")
    })

     
    app.use((err:IAppError,req:Request,res:Response,next:NextFunction)=>{

        if(err.name=="MulterError"){
            err.statusCode=400
        }

        const errData ={
            errMsg:err.message,
            cause:err.cause,
            statusCode:err.statusCode || 500,
            stack:err.stack,
            err
        }

        if(err.validationError?.length){
            Object.assign(errData,{validationError:err.validationError})
        }

        res.status(errData.statusCode).json(errData)
    })

    

    app.listen(PORT,()=>{
        console.log("server running...");
        
    })
}
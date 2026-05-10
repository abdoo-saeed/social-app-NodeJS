import express,{Express, NextFunction, Request, Response} from "express"
import { PORT } from "./config";
import authRouter from "./modules/auth/auth.controller";
import { IAppError } from "./utils/types/error";
import { NotFoundExecption } from "./utils/errorHandle/error.handle";
import{ DBConnection} from "./DB/db.connection"
import { testRedisConnection } from "./DB/redis.connection";


const app:Express = express()

export const bootstrap =async ()=>{
app.use(express.json())
await DBConnection()
await testRedisConnection()




    app.use("/auth",authRouter)









    app.all("/*dummy",(req,res)=>{
        throw new NotFoundExecption("page not found")
    })

     
    app.use((err:IAppError,req:Request,res:Response,next:NextFunction)=>{

        const errData ={
            errMsg:err.message,
            statusCode:err.statusCode || 500,
            stack:err.stack
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
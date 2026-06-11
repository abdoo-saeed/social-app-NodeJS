import { NextFunction, Request, Response } from "express"
import { BadRequestExecption, unAuthorizedExecption } from "../utils/errorHandle/error.handle"
import { verifyToken } from "../utils/security/token/token"
import { ACCESS_SIGNATURE } from "../config"
import { userModel } from "../DB/models/userModel"
import { get, revokedTokenKey } from "../DB/repo/redis.repo"
import { IRequest } from "../utils/types/req.types"





export const auth  = async (req:IRequest,res:Response,next:NextFunction)=>{

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
      if (!token) {
        throw new unAuthorizedExecption("token not correct");
    }

    const {email,_id,jti,iat} = verifyToken(token, ACCESS_SIGNATURE as string) as {
        email: string,
        jti: string,
        iat: number,
        _id: string
    }

    const user = await userModel.findById(_id)
    if(!user || !user.confirmEmail){
        throw new unAuthorizedExecption("user not found")
    }

    const tokenKey = revokedTokenKey({
        userId:_id,
        jti
        })

    const sessionData = await get({key:tokenKey}) as string
    if(sessionData){
        throw new BadRequestExecption("login again,session!!")
    }

    if(iat*1000 <= user.credential_changedAt?.getTime()){
        throw new BadRequestExecption("login again,credentials!!")
    }

    req.user = user 
    req.decoded = { iat, jti, _id }
    next()
    

}

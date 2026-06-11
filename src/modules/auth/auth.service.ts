import { deletByKey, get, getTtl, revokedTokenKey, set, update , confirmEmailKeyPrefix, addFCM, getFCMs } from "../../DB/repo/redis.repo"
import {  BadRequestExecption, NotFoundExecption } from "../../utils/errorHandle/error.handle"
import { generateEncryption } from "../../utils/security/encryption/encryption"
import {  compare, hash } from "../../utils/security/hash/hash"
import { confirmDTO, HUser, loginDTO, SignUpDTO } from "./auth.dto"
import { UserRepo } from "../../DB/repo"
import { createOtp } from "../../utils/email/createOTP"
import { emailEvent } from "../../utils/email/emailEvents"
import { createToken, decodeToken } from './../../utils/security/token/token';
import { randomUUID } from "crypto"
import { ACCESS_SIGNATURE, REFRESH_SIGNATURE } from "../../config"
import { logout, Logout} from "../../DB/Enums/user.enum"
import { notify } from "../../utils/notification/notification.service"









 class AuthService{

  private readonly userRepo = new UserRepo()
  
  private OTP_TTL = 300
  private OTP_MAX_ATTEMPTS = 5

  constructor(){}



async signUp(body:SignUpDTO){
    const {email,gender,firstName,lastName,password,age,phone} = body
     
      const isEmailExist = await this.userRepo.findByEmail(email)

      if (isEmailExist){
        throw new BadRequestExecption("email already exist")
      }
      
      
      const hashedPass = await hash(password)


      let encryptedPhone
      if(phone){
       
         encryptedPhone = await generateEncryption(phone)
      }
      
      
      const user = await this.userRepo.create({
        firstName,
        lastName,
        email,
        password:hashedPass,
        phone:encryptedPhone as string,
        gender,
        age: age as number
      })

      const otp = createOtp()


      await set({
        key:confirmEmailKeyPrefix({userId:user._id}),
        value: JSON.stringify({
                 otp: await hash(otp),
                 attempts: this.OTP_MAX_ATTEMPTS
                }),
        ttl:this.OTP_TTL
    })


       //send otp by eventEmitter
       emailEvent.publish("confirm-email",{to:email ,title:"SOCIAL MEDIA APP",otp,subject:"Confirm Email",expiredTime:this.OTP_TTL})
    

       return {
          data:{
            user
          }
        }
    }

////////

async confirmEmail({email,otp}:confirmDTO){

  const user =await  this.userRepo.findByEmail(email)

  if(!user){
      throw new NotFoundExecption("email not found")
  }

  if(user.confirmEmail){
     throw new BadRequestExecption("email already confirmed")
  }

  const otpKey = confirmEmailKeyPrefix({userId:user._id})


  const otpData = JSON.parse(await get({key:otpKey}) as string) as {
    otp : string,
    attempts:number
  }

  if (!otpData || otpData.attempts <= 0 ) {
    throw new BadRequestExecption("max attempts has done")
  }
  if (!await compare(otp,otpData.otp)) {
    await update({
      key:otpKey,
      value:{
        otp:otpData.otp,
        attempts:otpData.attempts -1
        },
      ttl:await getTtl(otpKey) as number   
    })

    throw new BadRequestExecption("in-valid otp")
  }


  user.confirmEmail = true
  await user.save()
  await deletByKey(otpKey)


  return{
    data:"confirmation done"
  } 

}


/////////////

async login({email,password,FCM}:loginDTO){

  const user = await this.userRepo.findByEmail(email)

  if(!user || !await compare(password,user.password)){
    throw new BadRequestExecption("in-valid credintials")
  }
  if(!user.confirmEmail){
    throw new BadRequestExecption("email not confirmed yet")
  }


  const jti = randomUUID()
  const accessToken = createToken({
    _id:user._id,
    email:user.email
  },ACCESS_SIGNATURE as string,{
    expiresIn:"30m",
    jwtid:jti
  })

  const refreshToken = createToken({
    _id:user._id,
    email:user.email
  },REFRESH_SIGNATURE as string,{
    expiresIn:"7D",
    jwtid:jti
  })


  // const tokenKey = revokedTokenKey({
  //   userId:user._id.toString(),
  //   jti
  // })
  // await set({
  //   key:tokenKey,
  //   value:jti,
  //   ttl:7*24*60*60
  // })


  if(FCM){

    await addFCM(user._id,FCM)
    const tokens = await getFCMs(user._id)

    if(tokens?.length){

      await notify.sendNotifications({tokens,data:{title:"login",body:`you login at  ${new Date()}`}})

    }

    

  }

  return {
    data:{
      accessToken,
      refreshToken
    }
  }

  


}

///////////

async refreshToken(refreshToken: string) {
    const decoded = decodeToken(refreshToken) as { _id: string; [key: string]: any }
    
    const accessToken = createToken(
        { _id: decoded._id },
        ACCESS_SIGNATURE,
        { expiresIn: 30 * 60 }
    )
    
    return {
        data: {
            accessToken
        }
    }
}



///////////////



async logoutService({user,iat,jti,flag = logout.all}:{user:HUser,iat:number,jti:string,flag?:Logout}){

    if(flag==logout.all){
        user.credential_changedAt = new Date()
        await user.save()

    }else{   //only this device
       
        const tokenKey = revokedTokenKey({
                userId:user._id.toString(),
                jti
              })
          const r=  await set({
                   key:tokenKey,
                   value:jti,
                   ttl:7*24*60*60
                  })

                  console.log(r);
                  
    }


    return {
        data:{}
    }
}


///////////////





}





export  const authServices = new AuthService()



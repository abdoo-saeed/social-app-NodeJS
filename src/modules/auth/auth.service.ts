import { deletByKey, get, getTtl, revokedTokenKey, set, update , confirmEmailKeyPrefix } from "../../DB/repo/redis.repo"
import {  BadRequestExecption, NotFoundExecption } from "../../utils/errorHandle/error.handle"
import { generateEncryption } from "../../utils/security/encryption/encryption"
import {  compare, hash } from "../../utils/security/hash/hash"
import { confirmDTO, loginDTO, SignUpDTO } from "./auth.dto"
import { UserRepo } from "./user.repo"
import { createOtp } from "../../utils/email/createOTP"
import { emailEvent } from "../../utils/email/emailEvents"
import { createToken } from './../../utils/security/token/token';
import { randomUUID } from "crypto"
import { ACCESS_SIGNATURE, REFRESH_SIGNATURE } from "../../config"






 class AuthService{

  private userRepo = new UserRepo()
  private OTP_TTL = 300
  private OTP_MAX_ATTEMPTS = 5




async signUp(body:SignUpDTO){
    const {email,gender,name,password,age,phone} = body
     
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
        name,
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
                 attempts: 3
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


////////

async login({email,password}:loginDTO){

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


  const tokenKey = revokedTokenKey({
    userId:user._id.toString(),
    jti
  })
  await set({
    key:tokenKey,
    value:jti,
    ttl:7*24*60*60
  })

  return {
    data:{
      accessToken,
      refreshToken
    }
  }

  


}





}





export  const authServices = new AuthService()




// export const login = async(body:loginDTO)=>{

//     const user = new UserRepo()
//     const result = await user.findByEmail(body.email)
    
//     if(!result){
//        throw new AppError("invalid credintials")
//     }

//     // if(!(user.provider==provider.system)){
//     //     throw new AppError("use google login")
//     // }

    
//     if(!(await compare( body.password ,result.password))){
//         throw new AppError("invalid credintials!")
//     }


//     return{
//         data:{

//         }

//     }
// }



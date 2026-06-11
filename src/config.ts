export const PORT=process.env.PORT as unknown as number
export const DB_URI=process.env.DB_URI as unknown as string
export const REDIS_URL=process.env.REDIS_URL as unknown as string



//encryption
export const IV_LENGTH=process.env.IV_LENGTH  
export const ENC_SECRET_KEY=process.env.ENC_SECRET_KEY as unknown as string

//hashing
export const SALT=process.env.SALT 


//otp
export const EMAIL=process.env.EMAIL 
export const EMAIL_PASSWORD=process.env.EMAIL_PASSWORD 

//token
export const ACCESS_SIGNATURE=process.env.ACCESS_SIGNATURE as string
export const REFRESH_SIGNATURE=process.env.REFRESH_SIGNATURE as string


//cloudinary
export const CLOUD_NAME=process.env.CLOUD_NAME as string
export const API_KEY=process.env.API_KEY as string
export const API_SECRET=process.env.API_SECRET as string



//application name
export const APPLICATION_NAME=process.env.APPLICATION_NAME as string
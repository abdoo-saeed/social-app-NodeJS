import chalk from "chalk";
import { createClient } from "redis";
import { REDIS_URL } from "../config";


export const redisClient = createClient({
    url:REDIS_URL,
    database:3,
})      



export const testRedisConnection = async ()=>{

    redisClient.connect()
         .then(()=>{
            console.log(chalk.green("redis conncted"));
            
         }).catch(()=>{
             console.log(chalk.red("redis not connected"));
             
         })

}
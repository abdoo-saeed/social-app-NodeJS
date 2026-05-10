import { connect } from "mongoose"
import { DB_URI } from "../config";
import chalk from "chalk";


export const DBConnection = async ()=>{

    await connect(DB_URI,{
        serverSelectionTimeoutMS:5000
    })
    .then(()=>{console.log(chalk.green("DB connected"))
    })
    .catch(()=>{console.log(chalk.red("DB can not connect"))  
    })
}
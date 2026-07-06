import { HydratedDocument } from "mongoose";



export interface IPaginate<TDocument>{
      docs:HydratedDocument<TDocument>[],
      currentPage?:number | string |undefined,
      pages?: number| string | undefined,
      size?: number | string| undefined
    
}
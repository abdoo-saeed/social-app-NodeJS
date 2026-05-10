import { ProjectionType, QueryOptions } from "mongoose";
import { IUser, userModel } from "../../DB/models/userModel";
import { DBRepo } from "../../DB/repo/DB.repo";
import { HydratedDocument } from "mongoose";




export class UserRepo extends DBRepo<IUser> {
  constructor() {
    super(userModel);
  }


  async findByEmail(
      email: string,
      projection?: ProjectionType<IUser>,
      options?: QueryOptions,
    ): Promise<HydratedDocument<IUser> | null> {
       const user = this.findOne({email,projection,options})
       return user
    }



}


import { DBRepo } from "./DB.repo";
import { IPost, postModel } from "../models";




export class PostRepo extends DBRepo<IPost> {
  constructor() {
    super(postModel);
  }
}

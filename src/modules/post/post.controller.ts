import { NextFunction, Request, Response, Router,  type Router as routerType} from "express";
import { auth } from "../../middlewares/auth.middleware";
import { cloudFileUploud, fileFieldValidation } from "../../utils/multer";
import { validation } from "../../middlewares/validation.middleware";
import { successRes } from "../../utils/types/success.response";
import { createPostSchema, reactPost } from "./post.validation";
import { postService } from "./post.service";
import { IRequest } from "../../utils/types/req.types";
import { paginateDto, paginationValidationSchema } from "../../utils/generalValidations/validation";
import { ReactPostparamDto, ReactPostQueryDto } from "./post.dto";




const router:routerType= Router()


const routes = {
    
}


router.post("/post",
    auth,
    cloudFileUploud({ validation: fileFieldValidation.image }).array("attachments", 2),
    validation(createPostSchema),
    async (req: IRequest, res: Response, next:NextFunction) => {
        const data = await postService.createPost({ ...req.body, files: req.files }, req.user!)
        return successRes({ res, data, status: 201 })
    }
)



router.get("/allPosts",
    auth,
    validation(paginationValidationSchema),
    async (req: IRequest, res: Response, next:NextFunction) => {
        const data = await postService.postList(req.query as paginateDto ,req.user!)
        return successRes({ res, data, status: 201 })
    }
)


router.patch("/:postId/react",
    auth,
    validation(reactPost),
    async (req: IRequest, res: Response, next:NextFunction) => {
        console.log('query:', req.query, 'body:', req.body, 'params:', req.params)
        const data = await postService.reactPost(req.params as ReactPostparamDto , req.query as unknown as ReactPostQueryDto , req.user!)

        
        return successRes({ res, data, status: 201 })
    }   
)




export default router
import { Response, Router, type Router as routerType  } from "express";
import { auth } from "../../middlewares/auth.middleware";
import { IRequest } from "../../utils/types/req.types";
import { successRes } from "../../utils/types/success.response";
import userService from "./user.service";
import { unAuthorizedExecption } from "../../utils/errorHandle/error.handle";
import { cloudFileUploud, fileFieldValidation } from "../../utils/multer";
import { validation } from "../../middlewares/validation.middleware";
import { uploadCoverSchema, uploadProfileSchema } from "../../utils/multer/generalValidation";



const router:routerType = Router()
const routes = {
    profile:"/profile",
    deleteProfile:"/delete-profile",
    profileImage:"/profile-image",
    coverImage:"/cover-image"


}



router.get(routes.profile,
    auth,
    async (req: IRequest, res:Response) => {
        if (!req.user) throw new unAuthorizedExecption();
        
        const user = await userService.profile(req.user)
        successRes({
            res,
            data: { user }
        })
    }
)



router.patch(
    routes.profileImage,
    auth,
    cloudFileUploud({
        validation: fileFieldValidation.image,
    }).single("profile"),
    validation(uploadProfileSchema),

    async (req: IRequest, res: Response) => {
        if (!req.user) throw new unAuthorizedExecption();

        const data = await userService.profileImage(
            req.file as Express.Multer.File,
            req.user
        );

        successRes({
            res,
            data
        });
    }
);




router.patch(
    routes.coverImage,
    auth,
    cloudFileUploud({
        validation: fileFieldValidation.image,
    }).array("coverImage",2), 
    validation(uploadCoverSchema),


    async (req: IRequest, res: Response) => {
        if (!req.user) throw new unAuthorizedExecption();

        const data = await userService.coverImage(
            req.files as Express.Multer.File[],
            req.user
        );

        successRes({
            res,
            data,
        });
    }
);





router.delete(routes.deleteProfile,
    auth,
    async (req: IRequest, res:Response) => {
        if (!req.user) throw new unAuthorizedExecption();
        
        const user = await userService.deleteProfile(req.user)
        successRes({
            res,
            data: { user }
        })
    }
)















export default router
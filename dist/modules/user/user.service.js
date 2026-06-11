"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_repo_1 = require("../../DB/repo/user.repo");
const error_handle_1 = require("../../utils/errorHandle/error.handle");
const config_1 = require("../../config");
const cloudinary_service_1 = require("../../utils/multer/cloudinary.service");
class userService {
    userRepo;
    constructor() {
        this.userRepo = new user_repo_1.UserRepo();
    }
    async profile(user) {
        return user.toJSON();
    }
    ///////////////////////////
    async profileImage(file, user) {
        if (user.profileImage?.public_id) {
            await (0, cloudinary_service_1.deleteFile)(user.profileImage.public_id);
        }
        const { public_id, secure_url } = await (0, cloudinary_service_1.uploud)({ filePath: file.path, folder: `${config_1.APPLICATION_NAME}/users/${user._id}/profile` });
        user.profileImage = { public_id, secure_url };
        await user.save();
        return "user profileImage uploaded ";
    }
    ///////////////////////////////////////////
    async coverImage(files, user) {
        if (user.coverImage?.length) {
            await (0, cloudinary_service_1.deleteFileWithPublicIds)(user.coverImage.map(({ public_id }) => public_id));
        }
        user.coverImage = await (0, cloudinary_service_1.uploadFiles)({ files, folder: `${config_1.APPLICATION_NAME}/users/${user._id}/cover` });
        await user.save();
        return "user coverImage uploaded";
    }
    ///////////////////////////
    async deleteProfile(user) {
        const account = await this.userRepo.deleteOne({ filter: { _id: user._id, force: true } });
        if (!account.deletedCount) {
            throw new error_handle_1.NotFoundExecption("invalid account");
        }
        return account;
    }
}
exports.default = new userService();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const success_response_1 = require("../../utils/types/success.response");
const user_service_1 = __importDefault(require("./user.service"));
const error_handle_1 = require("../../utils/errorHandle/error.handle");
const multer_1 = require("../../utils/multer");
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const generalValidation_1 = require("../../utils/multer/generalValidation");
const router = (0, express_1.Router)();
const routes = {
    profile: "/profile",
    deleteProfile: "/delete-profile",
    profileImage: "/profile-image",
    coverImage: "/cover-image"
};
router.get(routes.profile, auth_middleware_1.auth, async (req, res) => {
    if (!req.user)
        throw new error_handle_1.unAuthorizedExecption();
    const user = await user_service_1.default.profile(req.user);
    (0, success_response_1.successRes)({
        res,
        data: { user }
    });
});
router.patch(routes.profileImage, auth_middleware_1.auth, (0, multer_1.cloudFileUploud)({
    validation: multer_1.fileFieldValidation.image,
}).single("profile"), (0, validation_middleware_1.validation)(generalValidation_1.uploadProfileSchema), async (req, res) => {
    if (!req.user)
        throw new error_handle_1.unAuthorizedExecption();
    const data = await user_service_1.default.profileImage(req.file, req.user);
    (0, success_response_1.successRes)({
        res,
        data
    });
});
router.patch(routes.coverImage, auth_middleware_1.auth, (0, multer_1.cloudFileUploud)({
    validation: multer_1.fileFieldValidation.image,
}).array("coverImage", 2), (0, validation_middleware_1.validation)(generalValidation_1.uploadCoverSchema), async (req, res) => {
    if (!req.user)
        throw new error_handle_1.unAuthorizedExecption();
    const data = await user_service_1.default.coverImage(req.files, req.user);
    (0, success_response_1.successRes)({
        res,
        data,
    });
});
router.delete(routes.deleteProfile, auth_middleware_1.auth, async (req, res) => {
    if (!req.user)
        throw new error_handle_1.unAuthorizedExecption();
    const user = await user_service_1.default.deleteProfile(req.user);
    (0, success_response_1.successRes)({
        res,
        data: { user }
    });
});
exports.default = router;

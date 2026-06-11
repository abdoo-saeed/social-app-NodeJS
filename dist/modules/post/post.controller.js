"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const multer_1 = require("../../utils/multer");
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const success_response_1 = require("../../utils/types/success.response");
const post_validation_1 = require("./post.validation");
const post_service_1 = require("./post.service");
const router = (0, express_1.Router)();
const routes = {};
router.post("/post", auth_middleware_1.auth, (0, multer_1.cloudFileUploud)({ validation: multer_1.fileFieldValidation.image }).array("attachments", 2), (0, validation_middleware_1.validation)(post_validation_1.createPostSchema), async (req, res, next) => {
    const data = await post_service_1.postService.createPost({ ...req.body, files: req.files }, req.user);
    return (0, success_response_1.successRes)({ res, data, status: 201 });
});
exports.default = router;

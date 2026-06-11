"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const post_enum_1 = require("../../DB/Enums/post.enum");
const mongoose_1 = require("mongoose");
const generalValidation_1 = require("../../utils/multer/generalValidation");
const multer_1 = require("../../utils/multer");
exports.createPostSchema = {
    body: zod_1.default.object({
        content: zod_1.default.string().optional(),
        files: zod_1.default.array(generalValidation_1.generateValidationFeild.file(multer_1.fileFieldValidation.image)).optional(),
        tags: zod_1.default.array(zod_1.default.string()).optional(),
        availability: zod_1.default.coerce.number().default(post_enum_1.AvalibalityEnum.PUBLIC)
    }).superRefine((args, ctx) => {
        const hasContent = args.content && args.content.trim().length > 0;
        const hasAttachments = args.files && args.files.length > 0;
        if (!hasContent && !hasAttachments) {
            ctx.addIssue({
                code: "custom",
                path: ["content"],
                message: "content or attachments is required"
            });
        }
        if (args.tags?.length) {
            const uniqueTags = [...new Set(args.tags)];
            if (uniqueTags.length != args.tags.length) {
                ctx.addIssue({
                    code: "custom",
                    path: ["tags"],
                    message: "duplicated tags "
                });
            }
            for (const tag of args.tags) {
                if (!mongoose_1.Types.ObjectId.isValid(tag)) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["tags"],
                        message: `invalid tag object id ${tag} `
                    });
                }
            }
        }
    })
};

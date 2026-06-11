"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCoverSchema = exports.uploadProfileSchema = exports.generateValidationFeild = void 0;
const zod_1 = require("zod");
const _1 = require(".");
exports.generateValidationFeild = {
    file: function (mimetype) {
        return zod_1.z.strictObject({
            fieldname: zod_1.z.string(),
            originalname: zod_1.z.string(),
            encoding: zod_1.z.string(),
            mimetype: zod_1.z.enum(mimetype),
            // buffer: z.any().optional(),
            path: zod_1.z.string().optional(),
            destination: zod_1.z.string().optional(),
            filename: zod_1.z.string().optional(),
            size: zod_1.z.number()
        }).superRefine((args, ctx) => {
            if (!args.path) {
                ctx.addIssue({
                    code: "custom",
                    path: ["path"],
                    message: "path is required"
                });
            }
        });
    }
};
exports.uploadProfileSchema = {
    file: exports.generateValidationFeild.file(_1.fileFieldValidation.image).required()
};
exports.uploadCoverSchema = {
    files: zod_1.z
        .array(exports.generateValidationFeild.file(_1.fileFieldValidation.image))
        .min(1)
        .max(2)
};

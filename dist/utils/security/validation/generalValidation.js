"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateValidationFeild = void 0;
const zod_1 = require("zod");
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

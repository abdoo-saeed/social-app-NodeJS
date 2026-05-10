"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.confirmEmailSchema = exports.signUpSchema = void 0;
const zod_1 = require("zod");
exports.signUpSchema = {
    body: zod_1.z.object({
        name: zod_1.z.string().min(3).max(15),
        email: zod_1.z.email(),
        password: zod_1.z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#!_%^&*])(?=.*[0-9])(?!.*\s).{8,}$/),
        repeatPassword: zod_1.z.string().optional(),
        age: zod_1.z.number().optional(),
        phone: zod_1.z.string().min(10).max(11).optional(),
        gender: zod_1.z.union([
            zod_1.z.literal(0),
            zod_1.z.literal(1)
        ])
    }).superRefine((value, ctx) => {
        if (value.password != value.repeatPassword) {
            ctx.addIssue({
                code: "custom",
                message: "password mismatch",
                path: ["password", "repeatPassword"]
            });
        }
    })
};
exports.confirmEmailSchema = {
    body: zod_1.z.object({
        email: zod_1.z.email(),
        otp: zod_1.z.number().min(100000).max(999999)
    })
};
exports.loginSchema = {
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#!_%^&*])(?=.*[0-9])(?!.*\s).{8,}$/, "Invalid password format"),
    }),
};

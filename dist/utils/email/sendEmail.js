"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../../config");
const sendEmail = async ({ to, subject, html }) => {
    // Create a transporter using SMTP
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: config_1.EMAIL,
            pass: config_1.EMAIL_PASSWORD,
        },
    });
    await transporter.sendMail({
        from: `"Saraha App" <${config_1.EMAIL}>`,
        to,
        subject,
        html
    });
};
exports.sendEmail = sendEmail;

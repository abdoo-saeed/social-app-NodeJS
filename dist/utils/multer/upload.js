"use strict";
// utils/cloudinary/upload.ts
// import { cloud } from "./cloudinary"
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploud = void 0;
const cloudinary_1 = __importDefault(require("./cloudinary"));
// export const uploadBuffer = (buffer: Buffer, folder: string): Promise<string> => {
//     return new Promise((resolve, reject) => {
//         cloud().uploader.upload_stream(
//             { folder },
//             (error, result) => {
//                 if (error || !result) return reject(error)
//                 resolve(result.secure_url)
//             }
//         ).end(buffer)
//     })
// }
const uploud = async ({ filePath, folder }) => {
    return await cloudinary_1.default.uploader.upload(filePath, { folder });
};
exports.uploud = uploud;

"use strict";
// utils/cloudinary/upload.ts
// import { cloud } from "./cloudinary"
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileWithPublicIds = exports.deleteFile = exports.uploadFiles = exports.uploud = void 0;
const cloudinary_1 = __importDefault(require("./cloudinary"));
const uploud = async ({ filePath, folder }) => {
    return await cloudinary_1.default.uploader.upload(filePath, { folder });
};
exports.uploud = uploud;
const uploadFiles = async ({ files = [], folder }) => {
    let attachments = [];
    for (const file of files) {
        const { public_id, secure_url } = await (0, exports.uploud)({ filePath: file.path, folder });
        attachments.push({ public_id, secure_url });
    }
    return attachments;
};
exports.uploadFiles = uploadFiles;
const deleteFile = async (public_id) => {
    return await cloudinary_1.default.uploader.destroy(public_id);
};
exports.deleteFile = deleteFile;
const deleteFileWithPublicIds = async (public_ids) => {
    return await cloudinary_1.default.api.delete_resources(public_ids);
};
exports.deleteFileWithPublicIds = deleteFileWithPublicIds;

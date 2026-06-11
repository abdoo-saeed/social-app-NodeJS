"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudFileUploud = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_enum_1 = require("../../DB/Enums/multer.enum");
const validation_multr_1 = require("./validation.multr");
const cloudFileUploud = ({ storageApproach = multer_enum_1.storageApproachEnum.DISK, validation = [], maxSize = 2 }) => {
    // const storage = multer.memoryStorage() // on RAM 
    const storage = storageApproach == multer_enum_1.storageApproachEnum.MEMORY ? multer_1.default.memoryStorage() : multer_1.default.diskStorage({
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });
    return (0, multer_1.default)({ fileFilter: (0, validation_multr_1.fileFilter)(validation), storage, limits: { fileSize: maxSize * 1024 * 1024 } });
};
exports.cloudFileUploud = cloudFileUploud;

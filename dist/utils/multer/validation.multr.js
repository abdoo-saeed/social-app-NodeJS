"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileFilter = exports.fileFieldValidation = void 0;
const error_handle_1 = require("../errorHandle/error.handle");
exports.fileFieldValidation = {
    image: ["image/jpeg", "image/jpg", "image/png", "image/bmp"],
    video: ['video/mp4']
};
const fileFilter = (validation) => {
    return function (req, file, cb) {
        if (!validation.includes(file.mimetype)) {
            return cb(new error_handle_1.BadRequestExecption("invalid file format"));
        }
        return cb(null, true);
    };
};
exports.fileFilter = fileFilter;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.hash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../../../config");
const error_handle_1 = require("../../errorHandle/error.handle");
//hashing
const hash = async (text) => {
    if (!config_1.SALT) {
        throw new error_handle_1.AppError("internal server error", 400);
    }
    const hash = await bcrypt_1.default.hash(typeof text == "string" ? text : JSON.stringify(text), Number(config_1.SALT));
    return hash;
};
exports.hash = hash;
// compare hash
const compare = async (text, hashed) => {
    const compareResult = await bcrypt_1.default.compare(typeof text == "string" ? text : JSON.stringify(text), hashed);
    return compareResult;
};
exports.compare = compare;

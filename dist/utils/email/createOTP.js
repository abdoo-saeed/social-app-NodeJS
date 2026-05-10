"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOtp = void 0;
const crypto_1 = __importDefault(require("crypto"));
const createOtp = () => {
    return crypto_1.default.randomInt(100000, 999999);
};
exports.createOtp = createOtp;

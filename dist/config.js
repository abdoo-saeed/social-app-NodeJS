"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APPLICATION_NAME = exports.API_SECRET = exports.API_KEY = exports.CLOUD_NAME = exports.REFRESH_SIGNATURE = exports.ACCESS_SIGNATURE = exports.EMAIL_PASSWORD = exports.EMAIL = exports.SALT = exports.ENC_SECRET_KEY = exports.IV_LENGTH = exports.REDIS_URL = exports.DB_URI = exports.PORT = void 0;
exports.PORT = process.env.PORT;
exports.DB_URI = process.env.DB_URI;
exports.REDIS_URL = process.env.REDIS_URL;
//encryption
exports.IV_LENGTH = process.env.IV_LENGTH;
exports.ENC_SECRET_KEY = process.env.ENC_SECRET_KEY;
//hashing
exports.SALT = process.env.SALT;
//otp
exports.EMAIL = process.env.EMAIL;
exports.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
//token
exports.ACCESS_SIGNATURE = process.env.ACCESS_SIGNATURE;
exports.REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE;
//cloudinary
exports.CLOUD_NAME = process.env.CLOUD_NAME;
exports.API_KEY = process.env.API_KEY;
exports.API_SECRET = process.env.API_SECRET;
//application name
exports.APPLICATION_NAME = process.env.APPLICATION_NAME;

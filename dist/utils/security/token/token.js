"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const createToken = (data, signature, options) => {
    const token = (0, jsonwebtoken_1.sign)(data, signature, options);
    return token;
};
exports.createToken = createToken;
const verifyToken = (token, signature) => {
    return (0, jsonwebtoken_1.verify)(token, signature);
};
exports.verifyToken = verifyToken;
const decodeToken = (token) => {
    return (0, jsonwebtoken_1.decode)(token);
};
exports.decodeToken = decodeToken;

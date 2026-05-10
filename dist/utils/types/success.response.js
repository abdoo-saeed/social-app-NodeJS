"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successRes = void 0;
const successRes = ({ res, data = {}, message = "success", status = 200 }) => {
    res.status(status).json({
        message,
        data,
        status
    });
};
exports.successRes = successRes;

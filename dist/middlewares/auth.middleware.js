"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const error_handle_1 = require("../utils/errorHandle/error.handle");
const token_1 = require("../utils/security/token/token");
const config_1 = require("../config");
const userModel_1 = require("../DB/models/userModel");
const redis_repo_1 = require("../DB/repo/redis.repo");
const auth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw new error_handle_1.unAuthorizedExecption;
    }
    const { email, _id, jti, iat } = (0, token_1.verifyToken)(authorization, config_1.ACCESS_SIGNATURE);
    const user = await userModel_1.userModel.findById(_id);
    if (!user || !user.confirmEmail) {
        throw new error_handle_1.unAuthorizedExecption();
    }
    const tokenKey = (0, redis_repo_1.revokedTokenKey)({
        userId: _id,
        jti
    });
    const sessionData = await (0, redis_repo_1.get)({ key: tokenKey });
    if (sessionData) {
        throw new error_handle_1.BadRequestExecption("login again,session");
    }
    if (iat * 1000 <= user.credential_changedAt?.getTime()) {
        throw new error_handle_1.BadRequestExecption("login again,credentials");
    }
    req.user = user;
    req.decoded = { iat, jti, _id };
    next();
};
exports.auth = auth;

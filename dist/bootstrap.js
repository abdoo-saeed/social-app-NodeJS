"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const auth_controller_1 = __importDefault(require("./modules/auth/auth.controller"));
const error_handle_1 = require("./utils/errorHandle/error.handle");
const db_connection_1 = require("./DB/db.connection");
const redis_connection_1 = require("./DB/redis.connection");
const app = (0, express_1.default)();
const bootstrap = async () => {
    app.use(express_1.default.json());
    await (0, db_connection_1.DBConnection)();
    await (0, redis_connection_1.testRedisConnection)();
    app.use("/auth", auth_controller_1.default);
    app.all("/*dummy", (req, res) => {
        throw new error_handle_1.NotFoundExecption("page not found");
    });
    app.use((err, req, res, next) => {
        const errData = {
            errMsg: err.message,
            statusCode: err.statusCode || 500,
            stack: err.stack
        };
        if (err.validationError?.length) {
            Object.assign(errData, { validationError: err.validationError });
        }
        res.status(errData.statusCode).json(errData);
    });
    app.listen(config_1.PORT, () => {
        console.log("server running...");
    });
};
exports.bootstrap = bootstrap;

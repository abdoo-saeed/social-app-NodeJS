"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRedisConnection = exports.redisClient = void 0;
const chalk_1 = __importDefault(require("chalk"));
const redis_1 = require("redis");
const config_1 = require("../config");
exports.redisClient = (0, redis_1.createClient)({
    url: config_1.REDIS_URL,
    database: 3,
});
const testRedisConnection = async () => {
    exports.redisClient.connect()
        .then(() => {
        console.log(chalk_1.default.green("redis conncted"));
    }).catch(() => {
        console.log(chalk_1.default.red("redis not connected"));
    });
};
exports.testRedisConnection = testRedisConnection;

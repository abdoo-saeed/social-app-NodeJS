"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConnection = void 0;
const mongoose_1 = require("mongoose");
const config_1 = require("../config");
const chalk_1 = __importDefault(require("chalk"));
const DBConnection = async () => {
    await (0, mongoose_1.connect)(config_1.DB_URI, {
        serverSelectionTimeoutMS: 5000
    })
        .then(() => {
        console.log(chalk_1.default.green("DB connected"));
    })
        .catch(() => {
        console.log(chalk_1.default.red("DB can not connect"));
    });
};
exports.DBConnection = DBConnection;

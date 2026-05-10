"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepo = void 0;
const userModel_1 = require("../../DB/models/userModel");
const DB_repo_1 = require("../../DB/repo/DB.repo");
class UserRepo extends DB_repo_1.DBRepo {
    constructor() {
        super(userModel_1.userModel);
    }
    async findByEmail(email, projection, options) {
        const user = this.findOne({ email, projection, options });
        return user;
    }
}
exports.UserRepo = UserRepo;

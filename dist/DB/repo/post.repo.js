"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepo = void 0;
const DB_repo_1 = require("./DB.repo");
const models_1 = require("../models");
class PostRepo extends DB_repo_1.DBRepo {
    constructor() {
        super(models_1.postModel);
    }
}
exports.PostRepo = PostRepo;

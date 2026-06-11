"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notify = exports.NotificationService = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const mongoose_1 = require("mongoose");
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
class NotificationService {
    client;
    constructor() {
        const firebasePath = node_path_1.default.join(process.cwd(), "config", "social-app-abdo-firebase-adminsdk-fbsvc-f15432ea3a.json");
        const serviceAccount = JSON.parse((0, node_fs_1.readFileSync)(firebasePath, "utf8"));
        if (!firebase_admin_1.default.apps.length) {
            this.client = firebase_admin_1.default.initializeApp({
                credential: firebase_admin_1.default.credential.cert(serviceAccount),
            });
        }
        else {
            this.client = firebase_admin_1.default.app();
        }
    }
    async sendNotification({ token, data, }) {
        return this.client.messaging().send({
            token,
            data,
        });
    }
    async sendNotifications({ tokens, data, }) {
        await mongoose_1.Promise.allSettled(tokens.map((token) => this.sendNotification({
            token,
            data,
        })));
    }
}
exports.NotificationService = NotificationService;
exports.notify = new NotificationService();

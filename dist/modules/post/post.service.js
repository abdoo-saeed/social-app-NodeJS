"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postService = void 0;
const mongoose_1 = require("mongoose");
const repo_1 = require("../../DB/repo");
const error_handle_1 = require("../../utils/errorHandle/error.handle");
const post_repo_1 = require("./../../DB/repo/post.repo");
const notification_service_1 = require("../../utils/notification/notification.service");
const config_1 = require("../../config");
const multer_1 = require("../../utils/multer");
class PostService {
    userRepo = new repo_1.UserRepo();
    postRepo = new post_repo_1.PostRepo();
    async createPost({ availability, content, files, tags }, user) {
        const mentions = [];
        const FCM_tokens = [];
        if (tags?.length) {
            const mentionedAccount = await this.userRepo.find({
                filter: { _id: { $in: tags } }
            });
            if (mentionedAccount.length !== tags.length) {
                throw new error_handle_1.NotFoundExecption("fail to find some or all mentioned accounts");
            }
            for (const account of mentionedAccount) {
                mentions.push(mongoose_1.Types.ObjectId.createFromHexString(account._id.toString()));
                if (account.FCM_token) {
                    FCM_tokens.push(account.FCM_token);
                }
            }
        }
        const attachments = files?.length
            ? await Promise.all(files.map(async (file) => {
                const { public_id, secure_url } = await (0, multer_1.uploud)({
                    filePath: file.path,
                    folder: `${config_1.APPLICATION_NAME}/users/${user._id}/posts`
                });
                return {
                    public_id,
                    secure_url
                };
            }))
            : [];
        const post = await this.postRepo.create({
            ...(content && { content }),
            attachments,
            tags: mentions,
            availability,
            createdBy: user._id,
            folderId: user._id.toString()
        });
        if (!post) {
            throw new error_handle_1.BadRequestExecption("fail to upload post!");
        }
        if (FCM_tokens.length) {
            await notification_service_1.notify.sendNotifications({
                tokens: FCM_tokens,
                data: {
                    title: "post mention",
                    body: JSON.stringify({
                        message: `${user.username} mentioned you in his post`,
                        postId: post._id
                    })
                }
            });
        }
        return post;
    }
}
exports.postService = new PostService();

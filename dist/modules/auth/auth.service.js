"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const redis_repo_1 = require("../../DB/repo/redis.repo");
const error_handle_1 = require("../../utils/errorHandle/error.handle");
const encryption_1 = require("../../utils/security/encryption/encryption");
const hash_1 = require("../../utils/security/hash/hash");
const repo_1 = require("../../DB/repo");
const createOTP_1 = require("../../utils/email/createOTP");
const emailEvents_1 = require("../../utils/email/emailEvents");
const token_1 = require("./../../utils/security/token/token");
const crypto_1 = require("crypto");
const config_1 = require("../../config");
const user_enum_1 = require("../../DB/Enums/user.enum");
const notification_service_1 = require("../../utils/notification/notification.service");
class AuthService {
    userRepo = new repo_1.UserRepo();
    OTP_TTL = 300;
    OTP_MAX_ATTEMPTS = 5;
    constructor() { }
    async signUp(body) {
        const { email, gender, firstName, lastName, password, age, phone } = body;
        const isEmailExist = await this.userRepo.findByEmail(email);
        if (isEmailExist) {
            throw new error_handle_1.BadRequestExecption("email already exist");
        }
        const hashedPass = await (0, hash_1.hash)(password);
        let encryptedPhone;
        if (phone) {
            encryptedPhone = await (0, encryption_1.generateEncryption)(phone);
        }
        const user = await this.userRepo.create({
            firstName,
            lastName,
            email,
            password: hashedPass,
            phone: encryptedPhone,
            gender,
            age: age
        });
        const otp = (0, createOTP_1.createOtp)();
        await (0, redis_repo_1.set)({
            key: (0, redis_repo_1.confirmEmailKeyPrefix)({ userId: user._id }),
            value: JSON.stringify({
                otp: await (0, hash_1.hash)(otp),
                attempts: this.OTP_MAX_ATTEMPTS
            }),
            ttl: this.OTP_TTL
        });
        //send otp by eventEmitter
        emailEvents_1.emailEvent.publish("confirm-email", { to: email, title: "SOCIAL MEDIA APP", otp, subject: "Confirm Email", expiredTime: this.OTP_TTL });
        return {
            data: {
                user
            }
        };
    }
    ////////
    async confirmEmail({ email, otp }) {
        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            throw new error_handle_1.NotFoundExecption("email not found");
        }
        if (user.confirmEmail) {
            throw new error_handle_1.BadRequestExecption("email already confirmed");
        }
        const otpKey = (0, redis_repo_1.confirmEmailKeyPrefix)({ userId: user._id });
        const otpData = JSON.parse(await (0, redis_repo_1.get)({ key: otpKey }));
        if (!otpData || otpData.attempts <= 0) {
            throw new error_handle_1.BadRequestExecption("max attempts has done");
        }
        if (!await (0, hash_1.compare)(otp, otpData.otp)) {
            await (0, redis_repo_1.update)({
                key: otpKey,
                value: {
                    otp: otpData.otp,
                    attempts: otpData.attempts - 1
                },
                ttl: await (0, redis_repo_1.getTtl)(otpKey)
            });
            throw new error_handle_1.BadRequestExecption("in-valid otp");
        }
        user.confirmEmail = true;
        await user.save();
        await (0, redis_repo_1.deletByKey)(otpKey);
        return {
            data: "confirmation done"
        };
    }
    /////////////
    async login({ email, password, FCM }) {
        const user = await this.userRepo.findByEmail(email);
        if (!user || !await (0, hash_1.compare)(password, user.password)) {
            throw new error_handle_1.BadRequestExecption("in-valid credintials");
        }
        if (!user.confirmEmail) {
            throw new error_handle_1.BadRequestExecption("email not confirmed yet");
        }
        const jti = (0, crypto_1.randomUUID)();
        const accessToken = (0, token_1.createToken)({
            _id: user._id,
            email: user.email
        }, config_1.ACCESS_SIGNATURE, {
            expiresIn: "30m",
            jwtid: jti
        });
        const refreshToken = (0, token_1.createToken)({
            _id: user._id,
            email: user.email
        }, config_1.REFRESH_SIGNATURE, {
            expiresIn: "7D",
            jwtid: jti
        });
        // const tokenKey = revokedTokenKey({
        //   userId:user._id.toString(),
        //   jti
        // })
        // await set({
        //   key:tokenKey,
        //   value:jti,
        //   ttl:7*24*60*60
        // })
        if (FCM) {
            await (0, redis_repo_1.addFCM)(user._id, FCM);
            const tokens = await (0, redis_repo_1.getFCMs)(user._id);
            if (tokens?.length) {
                await notification_service_1.notify.sendNotifications({ tokens, data: { title: "login", body: `you login at  ${new Date()}` } });
            }
        }
        return {
            data: {
                accessToken,
                refreshToken
            }
        };
    }
    ///////////
    async refreshToken(refreshToken) {
        const decoded = (0, token_1.decodeToken)(refreshToken);
        const accessToken = (0, token_1.createToken)({ _id: decoded._id }, config_1.ACCESS_SIGNATURE, { expiresIn: 30 * 60 });
        return {
            data: {
                accessToken
            }
        };
    }
    ///////////////
    async logoutService({ user, iat, jti, flag = user_enum_1.logout.all }) {
        if (flag == user_enum_1.logout.all) {
            user.credential_changedAt = new Date();
            await user.save();
        }
        else { //only this device
            const tokenKey = (0, redis_repo_1.revokedTokenKey)({
                userId: user._id.toString(),
                jti
            });
            const r = await (0, redis_repo_1.set)({
                key: tokenKey,
                value: jti,
                ttl: 7 * 24 * 60 * 60
            });
            console.log(r);
        }
        return {
            data: {}
        };
    }
}
exports.authServices = new AuthService();

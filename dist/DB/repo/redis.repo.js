"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeyByPrefix = exports.getTtl = exports.expire = exports.deletByKey = exports.update = exports.get = exports.set = exports.forgetPassKeyPrefix = exports.confirmEmailKeyPrefix = exports.revokedTokenKey = exports.revokedTokenPrefix = void 0;
exports.addFCM = addFCM;
exports.removeFCM = removeFCM;
exports.getFCMs = getFCMs;
exports.hasFCMs = hasFCMs;
exports.removeFCMUser = removeFCMUser;
const redis_connection_1 = require("../redis.connection");
// when i want to delete all
const revokedTokenPrefix = ({ userId }) => {
    return `user:${userId}:revokedToken`;
};
exports.revokedTokenPrefix = revokedTokenPrefix;
const revokedTokenKey = ({ userId, jti }) => {
    return `${(0, exports.revokedTokenPrefix)({ userId })}:${jti}`;
};
exports.revokedTokenKey = revokedTokenKey;
const confirmEmailKeyPrefix = ({ userId }) => {
    return `user:${userId}:confirmEmail`;
};
exports.confirmEmailKeyPrefix = confirmEmailKeyPrefix;
const forgetPassKeyPrefix = ({ userId }) => {
    return `user:${userId}:forgetPassword`;
};
exports.forgetPassKeyPrefix = forgetPassKeyPrefix;
const set = async ({ key, value, ttl = null }) => {
    try {
        const data = typeof value != "string" ? JSON.stringify(value) : value;
        if (ttl) {
            return await redis_connection_1.redisClient.set(key, data, {
                expiration: { type: "EX", value: ttl }
            });
        }
        else {
            return await redis_connection_1.redisClient.set(key, data, {
                expiration: {
                    type: "EX",
                    value: ttl
                }
            });
        }
    }
    catch (error) {
        console.log('redis set error : ', error);
        return undefined;
    }
};
exports.set = set;
const get = async ({ key }) => {
    try {
        const data = await redis_connection_1.redisClient.get(key);
        return data;
    }
    catch (error) {
        console.log('redis get error : ', error);
        return undefined;
    }
};
exports.get = get;
const update = async ({ key, value, ttl = null }) => {
    try {
        const isExist = await redis_connection_1.redisClient.exists(key);
        if (!isExist) {
            return false;
        }
        return await (0, exports.set)({ key, value, ttl });
    }
    catch (error) {
        console.log('redis update error : ', error);
        return undefined;
    }
};
exports.update = update;
const deletByKey = async (key) => {
    try {
        return await redis_connection_1.redisClient.del(key);
    }
    catch (error) {
        console.log('redis delete error : ', error);
        return undefined;
    }
};
exports.deletByKey = deletByKey;
const expire = async ({ key, ttl }) => {
    try {
        return await redis_connection_1.redisClient.expire(key, ttl);
    }
    catch (error) {
        console.log('redis expire error : ', error);
        return undefined;
    }
};
exports.expire = expire;
const getTtl = async (key) => {
    try {
        return await redis_connection_1.redisClient.ttl(key);
    }
    catch (error) {
        console.log('redis ttl error : ', error);
        return undefined;
    }
};
exports.getTtl = getTtl;
const getKeyByPrefix = async (prefix) => {
    try {
        return await redis_connection_1.redisClient.keys(prefix);
    }
    catch (error) {
        console.log('redis get error : ', error);
        return undefined;
    }
};
exports.getKeyByPrefix = getKeyByPrefix;
function FCM_key(userId) {
    return `user:FCM:${userId.toString()}`;
}
async function addFCM(userId, FCMToken) {
    return await redis_connection_1.redisClient.sAdd(FCM_key(userId), FCMToken);
}
async function removeFCM(userId, FCMToken) {
    return await redis_connection_1.redisClient.sRem(FCM_key(userId), FCMToken);
}
async function getFCMs(userId) {
    return await redis_connection_1.redisClient.sMembers(FCM_key(userId));
}
async function hasFCMs(userId) {
    return await redis_connection_1.redisClient.sCard(FCM_key(userId));
}
async function removeFCMUser(userId) {
    return await redis_connection_1.redisClient.del(FCM_key(userId));
}

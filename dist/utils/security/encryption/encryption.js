"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDncryption = exports.generateEncryption = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const config_1 = require("../../../config");
// encryption
const generateEncryption = async (plainText) => {
    const IVLENGTH = Number(config_1.IV_LENGTH);
    const iv = node_crypto_1.default.randomBytes(IVLENGTH);
    const cipherIV = node_crypto_1.default.createCipheriv('aes-256-cbc', config_1.ENC_SECRET_KEY, iv);
    let cipherText = cipherIV.update(plainText, 'utf-8', 'hex');
    cipherText += cipherIV.final('hex');
    //    console.log({iv,cipherIV,cipherText});
    return `${iv.toString('hex')}:${cipherText}`;
};
exports.generateEncryption = generateEncryption;
/// decryption
const generateDncryption = async (cipherText) => {
    if (!cipherText) {
        throw new Error("Encrypted text is required for decryption");
    }
    const parts = cipherText.split(":");
    if (parts.length !== 2) {
        throw new Error("Invalid encrypted format");
    }
    const [iv, encryptedData] = parts;
    const ivLikeBinary = Buffer.from(iv, 'hex');
    let decipherIV = node_crypto_1.default.createDecipheriv('aes-256-cbc', config_1.ENC_SECRET_KEY, ivLikeBinary);
    let plainText = decipherIV.update(encryptedData, 'hex', 'utf-8');
    plainText += decipherIV.final('utf-8');
    // console.log({iv,encryptedData,ivLikeBinary,decipherIV,plainText});
    return plainText;
};
exports.generateDncryption = generateDncryption;

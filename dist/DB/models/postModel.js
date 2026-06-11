"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.postModel = void 0;
const mongoose_1 = require("mongoose");
const post_enum_1 = require("../Enums/post.enum");
const mongoose_2 = __importStar(require("mongoose"));
const postSchema = new mongoose_2.Schema({
    folderId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: function () { return !this.attachments?.length; }
    },
    attachments: [{
            public_id: String,
            secure_url: String
        }
    ],
    availability: {
        type: Number,
        enum: post_enum_1.AvalibalityEnum,
        default: post_enum_1.AvalibalityEnum.PUBLIC
    },
    likes: [
        {
            type: mongoose_2.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    tags: [
        {
            type: mongoose_2.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    createdBy: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true
    },
    updatedBy: {
        type: mongoose_1.Types.ObjectId,
        ref: "User"
    },
    deletedAt: {
        type: Date
    },
    restoredAt: {
        type: Date
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        getters: true,
    },
    toObject: {
        virtuals: true,
        getters: true,
    },
    strictQuery: true, // search stricted
    strict: true, // do not insert thing not in schema
    validateBeforeSave: true,
    optimisticConcurrency: true,
});
// model middleware
// userSchema.pre("insertMany",function(docs){
//     console.log(this,docs);
// })
// userSchema.post("insertMany",async function(docs,next){
//     console.log(this,docs);
// })
exports.postModel = mongoose_2.default.models.Post || (0, mongoose_2.model)("Post", postSchema);

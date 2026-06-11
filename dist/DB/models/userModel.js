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
exports.userModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const user_enum_1 = require("./../Enums/user.enum");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 25,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 25,
    },
    email: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 250,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        // function (this: UserDocument) {
        //   return this.provider === provider.system;
        // },
        minlength: 8,
    },
    gender: {
        type: Number,
        default: user_enum_1.Gender.male,
        enum: [user_enum_1.Gender.male, user_enum_1.Gender.female]
    },
    profileImage: {
        public_id: String,
        secure_url: String
    },
    coverImage: [{
            public_id: String,
            secure_url: String
        }],
    FCM_token: {
        type: String
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    age: Number,
    phone: String,
    credential_changedAt: Date,
    isDeleted: {
        type: Boolean,
        default: false,
    },
    provider: {
        type: Number,
        default: user_enum_1.provider.system,
        enum: [user_enum_1.provider.system, user_enum_1.provider.google]
    }
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
userSchema
    .virtual("name")
    .set(function (value) {
    const parts = value.trim().split(" ");
    this.firstName = parts[0] ?? "";
    this.lastName = parts.slice(1).join(" ") ?? "";
})
    .get(function () {
    return `${this.firstName} ${this.lastName}`;
});
// model middleware
// userSchema.pre("insertMany",function(docs){
//     console.log(this,docs);
// })
// userSchema.post("insertMany",async function(docs,next){
//     console.log(this,docs);
// })
exports.userModel = mongoose_1.default.models.User || (0, mongoose_1.model)("User", userSchema);

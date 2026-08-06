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
exports.ChatMessageSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const enums_1 = require("../enums");
exports.ChatMessageSchema = new mongoose_1.Schema({
    message_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose_1.default.Types.ObjectId(),
    },
    role: {
        type: String,
        required: true,
        enum: Object.values(enums_1.ChatRole),
    },
    content: {
        type: String,
        required: [true, 'Message content cannot be empty.'],
        trim: true,
        maxlength: [10000, 'Message content exceeds maximum allowed token character length.'],
    },
    tokens_used: {
        type: Number,
        required: true,
        min: [0, 'Tokens used cannot be negative.'],
        default: 0,
    },
    embedding: {
        type: [Number],
        required: false,
        select: false, // Exclude from standard read queries to conserve network bandwidth
        validate: {
            validator: (v) => !v || v.length === 768,
            message: 'Message embedding must be exactly 768 dimensions (Gemini text-embedding-004).',
        },
    },
    timestamp: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
}, {
    _id: false, // We use explicit message_id
    versionKey: false,
});

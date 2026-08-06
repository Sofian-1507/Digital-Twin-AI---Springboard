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
exports.RecommendationSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const enums_1 = require("./enums");
exports.RecommendationSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Recipient user ID is required for recommendation item.'],
        index: true,
    },
    title: {
        type: String,
        required: [true, 'Advice title is required.'],
        trim: true,
        maxlength: [150, 'Title cannot exceed 150 characters.'],
    },
    recommendation_text: {
        type: String,
        required: [true, 'Detailed recommendation text is required.'],
        trim: true,
        maxlength: [3000, 'Recommendation text cannot exceed 3000 characters.'],
    },
    category: {
        type: String,
        required: true,
        enum: Object.values(enums_1.RecommendationCategory),
    },
    priority: {
        type: String,
        required: true,
        enum: Object.values(enums_1.Priority),
        default: enums_1.Priority.MEDIUM,
    },
    impact_score: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: true,
        default: () => mongoose_1.default.Types.Decimal128.fromString('10.0'),
        validate: {
            validator: (v) => {
                const val = parseFloat(v.toString());
                return val >= 0.0 && val <= 100.0;
            },
            message: 'Impact score must be between 0.0 and 100.0.',
        },
    },
    linked_simulation_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Simulation',
        required: false,
    },
    linked_goal_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(enums_1.RecommendationStatus),
        default: enums_1.RecommendationStatus.UNREAD,
    },
    user_feedback: {
        type: String,
        required: false,
        enum: Object.values(enums_1.UserFeedback),
    },
    embedding: {
        type: [Number],
        required: false,
        select: false, // Exclude from standard read queries to conserve network bandwidth
        validate: {
            validator: (v) => !v || v.length === 768,
            message: 'Recommendation vector embedding must be exactly 768 dimensions (Gemini text-embedding-004).',
        },
    },
    generated_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    acted_upon_at: {
        type: Date,
        required: false,
    },
}, {
    timestamps: false,
    versionKey: false,
    toJSON: { getters: true },
    toObject: { getters: true },
});
// ESR Index 1: Action Center primary feed — unread critical recommendations first
exports.RecommendationSchema.index({ user_id: 1, status: 1, priority: 1, generated_at: -1 }, { name: 'idx_rec_action_center' });
// ESR Index 2: Domain-filtered recommendation views
exports.RecommendationSchema.index({ user_id: 1, category: 1, generated_at: -1 }, { name: 'idx_rec_category_date' });

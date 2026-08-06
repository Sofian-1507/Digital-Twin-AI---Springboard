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
exports.ActiveGoalSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const enums_1 = require("../enums");
exports.ActiveGoalSchema = new mongoose_1.Schema({
    goal_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose_1.default.Types.ObjectId(),
    },
    title: {
        type: String,
        required: [true, 'Goal title is required.'],
        trim: true,
        maxlength: [150, 'Goal title cannot exceed 150 characters.'],
    },
    category: {
        type: String,
        required: true,
        enum: Object.values(enums_1.GoalCategory),
    },
    target_value: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: [true, 'Target quantitative value is required.'],
        validate: {
            validator: (v) => parseFloat(v.toString()) > 0,
            message: 'Target value must be greater than 0.',
        },
    },
    current_value: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: true,
        default: () => mongoose_1.default.Types.Decimal128.fromString('0.00'),
        validate: {
            validator: (v) => parseFloat(v.toString()) >= 0,
            message: 'Current value cannot be negative.',
        },
    },
    unit: {
        type: String,
        required: true,
        trim: true,
        maxlength: [20, 'Unit string cannot exceed 20 characters.'],
    },
    target_date: {
        type: Date,
        required: [true, 'Target deadline date is required.'],
        validate: {
            validator: function (v) {
                // Allow existing goals to pass or validate new goals have future deadline
                if (!this.created_at)
                    return true;
                return v > this.created_at;
            },
            message: 'Target date must be in the future relative to creation date.',
        },
    },
}, {
    _id: false, // We use explicit goal_id instead of automatic _id
    timestamps: { createdAt: 'created_at', updatedAt: false },
});

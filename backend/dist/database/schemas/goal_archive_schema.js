"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalArchiveSchema = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("./enums");
exports.GoalArchiveSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID reference is required for archived goal.'],
        index: true,
    },
    original_goal_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        enum: Object.values(enums_1.GoalCategory),
    },
    target_value: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: true,
    },
    final_value: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(enums_1.GoalStatus),
    },
    ai_retrospective: {
        type: String,
        required: false,
        trim: true,
        maxlength: [3000, 'AI retrospective cannot exceed 3000 characters.'],
    },
    created_at: {
        type: Date,
        required: true,
    },
    closed_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
}, {
    timestamps: false,
    versionKey: false,
    toJSON: { getters: true },
    toObject: { getters: true },
});
// ESR Index: Historical milestone archive sorted chronologically
exports.GoalArchiveSchema.index({ user_id: 1, closed_at: -1 }, { name: 'idx_goals_user_closed' });

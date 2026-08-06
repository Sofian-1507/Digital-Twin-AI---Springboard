"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardCacheSchema = void 0;
const mongoose_1 = require("mongoose");
exports.DashboardCacheSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID reference is required for dashboard cache payload.'],
    },
    cache_key: {
        type: String,
        required: [true, 'Cache key identifier is required.'],
        trim: true,
        uppercase: true,
        maxlength: [100, 'Cache key cannot exceed 100 characters.'],
    },
    payload: {
        type: mongoose_1.Schema.Types.Mixed,
        required: [true, 'Pre-aggregated UI payload is required.'],
        default: {},
    },
    generated_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
}, {
    timestamps: false,
    versionKey: false,
    minimize: false,
});
// Unique Compound Index: Ensures 1 cache payload per user per UI widget/dashboard key
exports.DashboardCacheSchema.index({ user_id: 1, cache_key: 1 }, { unique: true, name: 'idx_cache_user_key_unique' });
// 15-Minute Automatic TTL Index: Purges pre-computed UI dashboard summaries exactly 15 minutes (900s) after generation
exports.DashboardCacheSchema.index({ generated_at: 1 }, { expireAfterSeconds: 900, name: 'idx_cache_ttl_15m' });

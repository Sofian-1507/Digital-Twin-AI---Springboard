"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsLogSchema = exports.LogLevel = void 0;
const mongoose_1 = require("mongoose");
var LogLevel;
(function (LogLevel) {
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
    LogLevel["CRITICAL"] = "CRITICAL";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
exports.AnalyticsLogSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // System logs may not be associated with a specific user
        index: true,
    },
    event_type: {
        type: String,
        required: [true, 'Event type identifier is required.'],
        trim: true,
        uppercase: true,
        maxlength: [100, 'Event type cannot exceed 100 characters.'],
    },
    module: {
        type: String,
        required: [true, 'System module name is required.'],
        trim: true,
        maxlength: [100, 'Module name cannot exceed 100 characters.'],
    },
    level: {
        type: String,
        required: true,
        enum: Object.values(LogLevel),
        default: LogLevel.INFO,
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
        default: {},
    },
    client_ip: {
        type: String,
        required: false,
        trim: true,
    },
    timestamp: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
}, {
    timestamps: false,
    versionKey: false,
});
// 90-Day Automatic TTL Index: MongoDB Atlas engine silently deletes telemetry older than 90 days (7,776,000s)
exports.AnalyticsLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000, name: 'idx_analytics_ttl_90d' });
// ESR Index: Filter system logs by module and event severity
exports.AnalyticsLogSchema.index({ module: 1, level: 1, timestamp: -1 }, { name: 'idx_analytics_mod_level_date' });

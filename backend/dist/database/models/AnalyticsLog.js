"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsLog = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const analytics_schema_1 = require("../schemas/analytics_schema");
/**
 * Mongoose ODM Model for the 'analytics_logs' collection.
 * High-velocity system telemetry sink governed by a 90-day automatic TTL index.
 */
exports.AnalyticsLog = mongoose_1.default.models.AnalyticsLog || mongoose_1.default.model('AnalyticsLog', analytics_schema_1.AnalyticsLogSchema, 'analytics_logs');

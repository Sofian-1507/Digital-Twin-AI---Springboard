"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardCache = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cache_schema_1 = require("../schemas/cache_schema");
/**
 * Mongoose ODM Model for the 'dashboard_cache' collection.
 * Ephemeral UI aggregation cache governed by a 15-minute automatic TTL index.
 */
exports.DashboardCache = mongoose_1.default.models.DashboardCache || mongoose_1.default.model('DashboardCache', cache_schema_1.DashboardCacheSchema, 'dashboard_cache');

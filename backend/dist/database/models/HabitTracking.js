"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HabitTracking = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const habit_schema_1 = require("../schemas/habit_schema");
/**
 * Mongoose ODM Model for the 'habit_tracking' collection.
 * Biometric routine log feeding Scikit-Learn K-Means burnout clustering.
 */
exports.HabitTracking = mongoose_1.default.models.HabitTracking || mongoose_1.default.model('HabitTracking', habit_schema_1.HabitTrackingSchema, 'habit_tracking');

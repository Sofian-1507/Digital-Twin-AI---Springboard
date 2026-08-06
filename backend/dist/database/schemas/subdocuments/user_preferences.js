"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPreferencesSchema = void 0;
const mongoose_1 = require("mongoose");
exports.UserPreferencesSchema = new mongoose_1.Schema({
    currency: {
        type: String,
        required: true,
        default: 'INR',
        trim: true,
        uppercase: true,
        maxlength: 5,
    },
    language: {
        type: String,
        required: true,
        default: 'en',
        trim: true,
        lowercase: true,
        maxlength: 10,
    },
    dark_mode: {
        type: Boolean,
        required: true,
        default: true,
    },
    email_notifications: {
        type: Boolean,
        required: true,
        default: true,
    },
    weekly_report_enabled: {
        type: Boolean,
        required: true,
        default: true,
    },
}, {
    _id: false, // Suppress automatic _id generation for 1:1 embedded subdocuments
    versionKey: false,
});

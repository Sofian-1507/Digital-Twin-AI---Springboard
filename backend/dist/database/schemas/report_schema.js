"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportSchema = exports.ReportType = void 0;
const mongoose_1 = require("mongoose");
var ReportType;
(function (ReportType) {
    ReportType["WEEKLY"] = "WEEKLY";
    ReportType["MONTHLY"] = "MONTHLY";
    ReportType["PREDICTION_SUMMARY"] = "PREDICTION_SUMMARY";
    ReportType["FINANCIAL_AUDIT"] = "FINANCIAL_AUDIT";
    ReportType["HABIT_ANALYTICS"] = "HABIT_ANALYTICS";
})(ReportType || (exports.ReportType = ReportType = {}));
exports.ReportSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID reference is required for generated report.'],
        index: true,
    },
    title: {
        type: String,
        required: [true, 'Report title is required.'],
        trim: true,
        maxlength: [200, 'Report title cannot exceed 200 characters.'],
    },
    report_type: {
        type: String,
        required: true,
        enum: Object.values(ReportType),
    },
    s3_download_url: {
        type: String,
        required: false,
        trim: true,
    },
    period_start: {
        type: Date,
        required: true,
    },
    period_end: {
        type: Date,
        required: true,
    },
    summary_metadata: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
        default: {},
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    versionKey: false,
});
// ESR Index: Report history archive sorted chronologically
exports.ReportSchema.index({ user_id: 1, report_type: 1, created_at: -1 }, { name: 'idx_report_user_type_date' });

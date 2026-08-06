"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const report_schema_1 = require("../schemas/report_schema");
/**
 * Mongoose ODM Model for the 'reports' collection.
 * Generated PDF report artifacts and periodic summary metadata.
 */
exports.Report = mongoose_1.default.models.Report || mongoose_1.default.model('Report', report_schema_1.ReportSchema, 'reports');

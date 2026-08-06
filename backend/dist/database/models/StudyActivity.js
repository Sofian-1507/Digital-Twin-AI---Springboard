"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyActivity = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const academic_schema_1 = require("../schemas/academic_schema");
/**
 * Mongoose ODM Model for the 'study_activities' collection.
 * Academic telemetry log feeding the Random Forest mark prediction engine.
 */
exports.StudyActivity = mongoose_1.default.models.StudyActivity || mongoose_1.default.model('StudyActivity', academic_schema_1.StudyActivitySchema, 'study_activities');

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalArchive = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const goal_archive_schema_1 = require("../schemas/goal_archive_schema");
/**
 * Mongoose ODM Model for the 'goals' (archive) collection.
 * Preserves lifelong user milestone history and AI retrospectives without bloating the User root document.
 */
exports.GoalArchive = mongoose_1.default.models.GoalArchive || mongoose_1.default.model('GoalArchive', goal_archive_schema_1.GoalArchiveSchema, 'goals');

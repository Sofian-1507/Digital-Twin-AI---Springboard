"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studyActivityRepository = exports.StudyActivityRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const base_repository_1 = require("./base_repository");
const index_1 = require("../models/index");
/**
 * Enterprise Study Activity Data Access Object (DAO).
 * Extracts academic telemetry and formats 3D feature matrices for Random Forest exam score prediction.
 */
class StudyActivityRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(index_1.StudyActivity);
    }
    /**
     * Aggregates study hours and average performance metrics grouped by academic subject.
     */
    async getSubjectPerformanceSummary(userId, startDate) {
        const uId = new mongoose_1.default.Types.ObjectId(userId.toString());
        const matchStage = { user_id: uId };
        if (startDate)
            matchStage['session_date'] = { $gte: startDate };
        const results = await this.model.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$subject',
                    total_study_hours: { $sum: '$study_hours' },
                    average_attendance_pct: { $avg: '$attendance_pct' },
                    average_quiz_pct: { $avg: '$quiz_marks_pct' },
                    average_exam_pct: { $avg: '$exam_marks_pct' },
                    session_count: { $sum: 1 },
                },
            },
            { $sort: { total_study_hours: -1 } },
        ]).exec();
        return results.map((r) => ({
            subject: r._id,
            total_study_hours: r.total_study_hours,
            average_attendance_pct: parseFloat((r.average_attendance_pct || 0).toFixed(2)),
            average_quiz_pct: parseFloat((r.average_quiz_pct || 0).toFixed(2)),
            average_exam_pct: parseFloat((r.average_exam_pct || 0).toFixed(2)),
            session_count: r.session_count,
        }));
    }
    /**
     * Extracts a cleaned 3D feature matrix (Study Hours, Attendance, Quiz Marks -> Target Exam Marks)
     * for training or inference in Python / Node.js Scikit-Learn pipelines.
     */
    async extractRandomForestFeatureMatrix(userId) {
        const uId = new mongoose_1.default.Types.ObjectId(userId.toString());
        const logs = await this.model.find({
            user_id: uId,
            $or: [
                { quiz_marks_pct: { $exists: true, $ne: null } },
                { exam_marks_pct: { $exists: true, $ne: null } },
            ],
        }).exec();
        return logs.map((l) => ({
            user_id: l.user_id.toString(),
            subject: l.subject,
            study_hours: parseFloat(l.study_hours.toString()),
            attendance_pct: parseFloat(l.attendance_pct.toString()),
            quiz_marks_pct: l.quiz_marks_pct ? parseFloat(l.quiz_marks_pct.toString()) : 0,
            target_exam_pct: l.exam_marks_pct ? parseFloat(l.exam_marks_pct.toString()) : 0,
        }));
    }
}
exports.StudyActivityRepository = StudyActivityRepository;
exports.studyActivityRepository = new StudyActivityRepository();

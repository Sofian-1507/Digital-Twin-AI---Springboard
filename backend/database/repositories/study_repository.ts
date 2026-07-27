import mongoose from 'mongoose';
import { BaseRepository } from './base_repository';
import { IStudyActivity } from '../schemas/academic_schema';
import { StudyActivity } from '../models/index';

export interface AcademicSubjectSummary {
  subject: string;
  total_study_hours: mongoose.Types.Decimal128;
  average_attendance_pct: number;
  average_quiz_pct: number;
  average_exam_pct: number;
  session_count: number;
}

export interface AcademicMLFeatureRow {
  user_id: string;
  subject: string;
  study_hours: number;
  attendance_pct: number;
  quiz_marks_pct: number;
  target_exam_pct: number;
}

/**
 * Enterprise Study Activity Data Access Object (DAO).
 * Extracts academic telemetry and formats 3D feature matrices for Random Forest exam score prediction.
 */
export class StudyActivityRepository extends BaseRepository<IStudyActivity> {
  constructor() {
    super(StudyActivity);
  }

  /**
   * Aggregates study hours and average performance metrics grouped by academic subject.
   */
  public async getSubjectPerformanceSummary(
    userId: string | mongoose.Types.ObjectId,
    startDate?: Date
  ): Promise<AcademicSubjectSummary[]> {
    const uId = new mongoose.Types.ObjectId(userId.toString());
    const matchStage: Record<string, any> = { user_id: uId };
    if (startDate) matchStage['session_date'] = { $gte: startDate };

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
  public async extractRandomForestFeatureMatrix(userId: string | mongoose.Types.ObjectId): Promise<AcademicMLFeatureRow[]> {
    const uId = new mongoose.Types.ObjectId(userId.toString());

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

export const studyActivityRepository = new StudyActivityRepository();

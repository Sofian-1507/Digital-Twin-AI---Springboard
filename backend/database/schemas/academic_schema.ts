import mongoose, { Schema } from 'mongoose';
import { SessionType } from './enums';

export interface IStudyActivity extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  subject: string;
  study_hours: mongoose.Types.Decimal128;
  session_type: SessionType;
  attendance_pct: mongoose.Types.Decimal128;
  quiz_marks?: mongoose.Types.Decimal128;
  max_quiz_marks?: mongoose.Types.Decimal128;
  quiz_marks_pct?: mongoose.Types.Decimal128;
  exam_marks?: mongoose.Types.Decimal128;
  max_exam_marks?: mongoose.Types.Decimal128;
  exam_marks_pct?: mongoose.Types.Decimal128;
  focus_score?: number;
  linked_goal_id?: mongoose.Types.ObjectId;
  session_date: Date;
  created_at: Date;
}

export const StudyActivitySchema = new Schema<IStudyActivity>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required for study activity log.'],
      index: true,
    },
    subject: {
      type: String,
      required: [true, 'Academic subject name is required.'],
      trim: true,
      maxlength: [100, 'Subject name cannot exceed 100 characters.'],
    },
    study_hours: {
      type: Schema.Types.Decimal128,
      required: [true, 'Study duration in hours is required.'],
      validate: {
        validator: (v: mongoose.Types.Decimal128) => {
          const val = parseFloat(v.toString());
          return val >= 0.1 && val <= 24.0;
        },
        message: 'Study hours must be between 0.1 and 24.0 hours.',
      },
    },
    session_type: {
      type: String,
      required: true,
      enum: Object.values(SessionType),
    },
    attendance_pct: {
      type: Schema.Types.Decimal128,
      required: true,
      default: () => mongoose.Types.Decimal128.fromString('100.0'),
      validate: {
        validator: (v: mongoose.Types.Decimal128) => {
          const val = parseFloat(v.toString());
          return val >= 0.0 && val <= 100.0;
        },
        message: 'Attendance percentage must be between 0.0 and 100.0.',
      },
    },
    quiz_marks: {
      type: Schema.Types.Decimal128,
      required: false,
    },
    max_quiz_marks: {
      type: Schema.Types.Decimal128,
      required: function (this: IStudyActivity) {
        return this.quiz_marks !== undefined && this.quiz_marks !== null;
      },
    },
    quiz_marks_pct: {
      type: Schema.Types.Decimal128,
      required: false,
    },
    exam_marks: {
      type: Schema.Types.Decimal128,
      required: false,
    },
    max_exam_marks: {
      type: Schema.Types.Decimal128,
      required: function (this: IStudyActivity) {
        return this.exam_marks !== undefined && this.exam_marks !== null;
      },
    },
    exam_marks_pct: {
      type: Schema.Types.Decimal128,
      required: false,
    },
    focus_score: {
      type: Number,
      required: false,
      min: [0, 'Minimum focus score is 0.'],
      max: [100, 'Maximum focus score is 100.'],
    },
    linked_goal_id: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    session_date: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    versionKey: false,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// Pre-validate middleware: Automatically compute normalized percentage scores for ML feature stability
StudyActivitySchema.pre('validate', function (next) {
  if (this.quiz_marks && this.max_quiz_marks) {
    const q = parseFloat(this.quiz_marks.toString());
    const mq = parseFloat(this.max_quiz_marks.toString());
    if (mq > 0) {
      const pct = (q / mq) * 100.0;
      this.quiz_marks_pct = mongoose.Types.Decimal128.fromString(pct.toFixed(2));
    }
  }

  if (this.exam_marks && this.max_exam_marks) {
    const e = parseFloat(this.exam_marks.toString());
    const me = parseFloat(this.max_exam_marks.toString());
    if (me > 0) {
      const pct = (e / me) * 100.0;
      this.exam_marks_pct = mongoose.Types.Decimal128.fromString(pct.toFixed(2));
    }
  }
  next();
});

// ESR Index 1: Recent study session timeline
StudyActivitySchema.index({ user_id: 1, session_date: -1 }, { name: 'idx_study_user_date' });

// ESR Index 2: Subject-filtered academic trend + Random Forest feature extraction
StudyActivitySchema.index({ user_id: 1, subject: 1, session_date: -1 }, { name: 'idx_study_user_subj_date' });

// ESR Index 3: Session modality analysis
StudyActivitySchema.index({ user_id: 1, session_type: 1, session_date: -1 }, { name: 'idx_study_user_type_date' });

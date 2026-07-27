import mongoose, { Schema } from 'mongoose';

export enum ReportType {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  PREDICTION_SUMMARY = 'PREDICTION_SUMMARY',
  FINANCIAL_AUDIT = 'FINANCIAL_AUDIT',
  HABIT_ANALYTICS = 'HABIT_ANALYTICS',
}

export interface IReport extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  title: string;
  report_type: ReportType;
  s3_download_url?: string;
  period_start: Date;
  period_end: Date;
  summary_metadata: Record<string, any>;
  created_at: Date;
}

export const ReportSchema = new Schema<IReport>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
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
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    versionKey: false,
  }
);

// ESR Index: Report history archive sorted chronologically
ReportSchema.index({ user_id: 1, report_type: 1, created_at: -1 }, { name: 'idx_report_user_type_date' });

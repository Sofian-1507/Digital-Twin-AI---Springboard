import mongoose, { Model } from 'mongoose';
import { IReport, ReportSchema } from '../schemas/report_schema';

/**
 * Mongoose ODM Model for the 'reports' collection.
 * Generated PDF report artifacts and periodic summary metadata.
 */
export const Report: Model<IReport> =
  mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema, 'reports');

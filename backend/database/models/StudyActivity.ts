import mongoose, { Model } from 'mongoose';
import { IStudyActivity, StudyActivitySchema } from '../schemas/academic_schema';

/**
 * Mongoose ODM Model for the 'study_activities' collection.
 * Academic telemetry log feeding the Random Forest mark prediction engine.
 */
export const StudyActivity: Model<IStudyActivity> =
  mongoose.models.StudyActivity || mongoose.model<IStudyActivity>('StudyActivity', StudyActivitySchema, 'study_activities');

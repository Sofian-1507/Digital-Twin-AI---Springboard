import mongoose, { Schema } from 'mongoose';
import { GoalCategory, GoalStatus } from './enums';

export interface IGoalArchive extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  original_goal_id: mongoose.Types.ObjectId;
  title: string;
  category: GoalCategory;
  target_value: mongoose.Types.Decimal128;
  final_value: mongoose.Types.Decimal128;
  unit: string;
  status: GoalStatus;
  ai_retrospective?: string;
  created_at: Date;
  closed_at: Date;
}

export const GoalArchiveSchema = new Schema<IGoalArchive>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required for archived goal.'],
      index: true,
    },
    original_goal_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: Object.values(GoalCategory),
    },
    target_value: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    final_value: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(GoalStatus),
    },
    ai_retrospective: {
      type: String,
      required: false,
      trim: true,
      maxlength: [3000, 'AI retrospective cannot exceed 3000 characters.'],
    },
    created_at: {
      type: Date,
      required: true,
    },
    closed_at: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  {
    timestamps: false,
    versionKey: false,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// ESR Index: Historical milestone archive sorted chronologically
GoalArchiveSchema.index({ user_id: 1, closed_at: -1 }, { name: 'idx_goals_user_closed' });

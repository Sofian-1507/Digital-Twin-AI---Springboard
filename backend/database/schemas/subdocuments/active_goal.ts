import mongoose, { Schema } from 'mongoose';
import { GoalCategory } from '../enums';

export interface IActiveGoal {
  goal_id: mongoose.Types.ObjectId;
  title: string;
  category: GoalCategory;
  target_value: mongoose.Types.Decimal128;
  current_value: mongoose.Types.Decimal128;
  unit: string;
  target_date: Date;
  created_at?: Date;
}

export const ActiveGoalSchema = new Schema<IActiveGoal>(
  {
    goal_id: {
      type: Schema.Types.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    title: {
      type: String,
      required: [true, 'Goal title is required.'],
      trim: true,
      maxlength: [150, 'Goal title cannot exceed 150 characters.'],
    },
    category: {
      type: String,
      required: true,
      enum: Object.values(GoalCategory),
    },
    target_value: {
      type: Schema.Types.Decimal128,
      required: [true, 'Target quantitative value is required.'],
      validate: {
        validator: (v: mongoose.Types.Decimal128) => parseFloat(v.toString()) > 0,
        message: 'Target value must be greater than 0.',
      },
    },
    current_value: {
      type: Schema.Types.Decimal128,
      required: true,
      default: () => mongoose.Types.Decimal128.fromString('0.00'),
      validate: {
        validator: (v: mongoose.Types.Decimal128) => parseFloat(v.toString()) >= 0,
        message: 'Current value cannot be negative.',
      },
    },
    unit: {
      type: String,
      required: true,
      trim: true,
      maxlength: [20, 'Unit string cannot exceed 20 characters.'],
    },
    target_date: {
      type: Date,
      required: [true, 'Target deadline date is required.'],
      validate: {
        validator: function (this: IActiveGoal, v: Date) {
          // Allow existing goals to pass or validate new goals have future deadline
          if (!this.created_at) return true;
          return v > this.created_at;
        },
        message: 'Target date must be in the future relative to creation date.',
      },
    },
  },
  {
    _id: false, // We use explicit goal_id instead of automatic _id
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

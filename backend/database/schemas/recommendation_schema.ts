import mongoose, { Schema } from 'mongoose';
import { RecommendationCategory, Priority, RecommendationStatus, UserFeedback } from './enums';

export interface IRecommendation extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  title: string;
  recommendation_text: string;
  category: RecommendationCategory;
  priority: Priority;
  impact_score: mongoose.Types.Decimal128;
  linked_simulation_id?: mongoose.Types.ObjectId;
  linked_goal_id?: mongoose.Types.ObjectId;
  status: RecommendationStatus;
  user_feedback?: UserFeedback;
  embedding?: number[]; // Exactly 768 float dimensions for Google Gemini text-embedding-004
  generated_at: Date;
  acted_upon_at?: Date;
}

export const RecommendationSchema = new Schema<IRecommendation>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient user ID is required for recommendation item.'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Advice title is required.'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters.'],
    },
    recommendation_text: {
      type: String,
      required: [true, 'Detailed recommendation text is required.'],
      trim: true,
      maxlength: [3000, 'Recommendation text cannot exceed 3000 characters.'],
    },
    category: {
      type: String,
      required: true,
      enum: Object.values(RecommendationCategory),
    },
    priority: {
      type: String,
      required: true,
      enum: Object.values(Priority),
      default: Priority.MEDIUM,
    },
    impact_score: {
      type: Schema.Types.Decimal128,
      required: true,
      default: () => mongoose.Types.Decimal128.fromString('10.0'),
      validate: {
        validator: (v: mongoose.Types.Decimal128) => {
          const val = parseFloat(v.toString());
          return val >= 0.0 && val <= 100.0;
        },
        message: 'Impact score must be between 0.0 and 100.0.',
      },
    },
    linked_simulation_id: {
      type: Schema.Types.ObjectId,
      ref: 'Simulation',
      required: false,
    },
    linked_goal_id: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(RecommendationStatus),
      default: RecommendationStatus.UNREAD,
    },
    user_feedback: {
      type: String,
      required: false,
      enum: Object.values(UserFeedback),
    },
    embedding: {
      type: [Number],
      required: false,
      select: false, // Exclude from standard read queries to conserve network bandwidth
      validate: {
        validator: (v: number[]) => !v || v.length === 768,
        message: 'Recommendation vector embedding must be exactly 768 dimensions (Gemini text-embedding-004).',
      },
    },
    generated_at: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    acted_upon_at: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: false,
    versionKey: false,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// ESR Index 1: Action Center primary feed — unread critical recommendations first
RecommendationSchema.index(
  { user_id: 1, status: 1, priority: 1, generated_at: -1 },
  { name: 'idx_rec_action_center' }
);

// ESR Index 2: Domain-filtered recommendation views
RecommendationSchema.index({ user_id: 1, category: 1, generated_at: -1 }, { name: 'idx_rec_category_date' });

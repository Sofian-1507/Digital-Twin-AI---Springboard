import mongoose, { Schema } from 'mongoose';
import { SimulationDomain, SimulationStatus } from './enums';

export interface ISimulation extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  scenario_name: string;
  domain: SimulationDomain;
  status: SimulationStatus;
  input_parameters: Record<string, any>;
  baseline_projection: Record<string, any>;
  alternative_projection: Record<string, any>;
  comparative_summary: Record<string, any>;
  ai_recommendation_text: string;
  execution_time_ms: number;
  linked_goal_id?: mongoose.Types.ObjectId;
  generated_at: Date;
}

export const SimulationSchema = new Schema<ISimulation>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required for simulation record.'],
      index: true,
    },
    scenario_name: {
      type: String,
      required: [true, 'Scenario title is required.'],
      trim: true,
      maxlength: [200, 'Scenario name cannot exceed 200 characters.'],
    },
    domain: {
      type: String,
      required: true,
      enum: Object.values(SimulationDomain),
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(SimulationStatus),
      default: SimulationStatus.SUCCESS,
    },
    input_parameters: {
      type: Schema.Types.Mixed,
      required: [true, 'Polymorphic input variables are required.'],
      default: {},
    },
    baseline_projection: {
      type: Schema.Types.Mixed,
      required: [true, 'Baseline ML trajectory projection is required.'],
      default: {},
    },
    alternative_projection: {
      type: Schema.Types.Mixed,
      required: [true, 'Alternative ML trajectory projection is required.'],
      default: {},
    },
    comparative_summary: {
      type: Schema.Types.Mixed,
      required: [true, 'Pre-computed comparative summary deltas are required.'],
      default: {},
    },
    ai_recommendation_text: {
      type: String,
      required: [true, 'Gemini AI executive summary text is required.'],
      trim: true,
      maxlength: [5000, 'AI recommendation text cannot exceed 5000 characters.'],
    },
    execution_time_ms: {
      type: Number,
      required: true,
      min: [0, 'Execution time cannot be negative.'],
    },
    linked_goal_id: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    generated_at: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  {
    timestamps: false, // Immutable archive! Use generated_at timestamp.
    versionKey: false,
    minimize: false, // Ensure empty objects {} in mixed fields are preserved in BSON
  }
);

// ESR Index 1: Simulation history panel — most recent first
SimulationSchema.index({ user_id: 1, generated_at: -1 }, { name: 'idx_sim_user_date' });

// ESR Index 2: Filter history by simulation domain
SimulationSchema.index({ user_id: 1, domain: 1, generated_at: -1 }, { name: 'idx_sim_user_domain_date' });

import mongoose, { Schema } from 'mongoose';
import { BurnoutRisk } from '../enums';

export interface IDigitalTwinState {
  savings_rate_pct: mongoose.Types.Decimal128;
  emergency_fund_months: mongoose.Types.Decimal128;
  study_consistency_score: mongoose.Types.Decimal128;
  predicted_exam_score?: mongoose.Types.Decimal128;
  habit_completion_rate: mongoose.Types.Decimal128;
  lifestyle_score: mongoose.Types.Decimal128;
  productivity_score: mongoose.Types.Decimal128;
  burnout_risk_cluster: BurnoutRisk;
  last_updated_at: Date;
}

const percentageValidator = [
  {
    validator: (v: mongoose.Types.Decimal128) => parseFloat(v.toString()) >= 0.0 && parseFloat(v.toString()) <= 100.0,
    message: 'Percentage metrics must be between 0.0 and 100.0.',
  },
];

export const DigitalTwinStateSchema = new Schema<IDigitalTwinState>(
  {
    savings_rate_pct: {
      type: Schema.Types.Decimal128,
      required: true,
      default: () => mongoose.Types.Decimal128.fromString('0.0'),
      validate: percentageValidator,
    },
    emergency_fund_months: {
      type: Schema.Types.Decimal128,
      required: true,
      default: () => mongoose.Types.Decimal128.fromString('0.0'),
      validate: {
        validator: (v: mongoose.Types.Decimal128) => parseFloat(v.toString()) >= 0.0,
        message: 'Emergency fund months cannot be negative.',
      },
    },
    study_consistency_score: {
      type: Schema.Types.Decimal128,
      required: true,
      default: () => mongoose.Types.Decimal128.fromString('0.0'),
      validate: percentageValidator,
    },
    predicted_exam_score: {
      type: Schema.Types.Decimal128,
      required: false,
      validate: percentageValidator,
    },
    habit_completion_rate: {
      type: Schema.Types.Decimal128,
      required: true,
      default: () => mongoose.Types.Decimal128.fromString('0.0'),
      validate: percentageValidator,
    },
    lifestyle_score: {
      type: Schema.Types.Decimal128,
      required: true,
      default: () => mongoose.Types.Decimal128.fromString('0.0'),
      validate: percentageValidator,
    },
    productivity_score: {
      type: Schema.Types.Decimal128,
      required: true,
      default: () => mongoose.Types.Decimal128.fromString('0.0'),
      validate: percentageValidator,
    },
    burnout_risk_cluster: {
      type: String,
      required: true,
      enum: Object.values(BurnoutRisk),
      default: BurnoutRisk.UNKNOWN,
    },
    last_updated_at: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  {
    _id: false,
    versionKey: false,
  }
);

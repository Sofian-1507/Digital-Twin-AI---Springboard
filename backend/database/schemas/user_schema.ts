import mongoose, { Schema } from 'mongoose';
import { Gender, RiskTolerance } from './enums';
import { IUserPreferences, UserPreferencesSchema } from './subdocuments/user_preferences';
import { IActiveGoal, ActiveGoalSchema } from './subdocuments/active_goal';
import { IDigitalTwinState, DigitalTwinStateSchema } from './subdocuments/digital_twin_state';

export interface IProfile {
  name: string;
  age: number;
  gender?: Gender;
  occupation?: string;
  monthly_income_baseline: mongoose.Types.Decimal128;
  risk_tolerance: RiskTolerance;
}

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password_hash: string;
  profile: IProfile;
  preferences: IUserPreferences;
  active_goals: IActiveGoal[];
  digital_twin_state: IDigitalTwinState;
  created_at: Date;
  updated_at: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    name: {
      type: String,
      required: [true, 'Full display name is required.'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters.'],
      maxlength: [100, 'Name cannot exceed 100 characters.'],
    },
    age: {
      type: Number,
      required: [true, 'Demographic age is required for K-Means cohort clustering.'],
      min: [13, 'Minimum age is 13.'],
      max: [120, 'Maximum realistic age is 120.'],
    },
    gender: {
      type: String,
      required: false,
      enum: Object.values(Gender),
    },
    occupation: {
      type: String,
      required: false,
      trim: true,
      maxlength: [100, 'Occupation cannot exceed 100 characters.'],
    },
    monthly_income_baseline: {
      type: Schema.Types.Decimal128,
      required: true,
      default: () => mongoose.Types.Decimal128.fromString('0.00'),
      validate: {
        validator: (v: mongoose.Types.Decimal128) => parseFloat(v.toString()) >= 0,
        message: 'Monthly income baseline cannot be negative.',
      },
    },
    risk_tolerance: {
      type: String,
      required: true,
      enum: Object.values(RiskTolerance),
      default: RiskTolerance.MODERATE,
    },
  },
  { _id: false }
);

export const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email address is required.'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please fill a valid email address.'],
    },
    password_hash: {
      type: String,
      required: [true, 'Cryptographic password hash is required.'],
      select: false, // Never return password hash in read queries by default
    },
    profile: {
      type: ProfileSchema,
      required: true,
      default: () => ({}),
    },
    preferences: {
      type: UserPreferencesSchema,
      required: true,
      default: () => ({}),
    },
    active_goals: {
      type: [ActiveGoalSchema],
      required: true,
      default: [],
      validate: [
        {
          validator: (val: IActiveGoal[]) => val.length <= 30,
          message: 'Active goals array cannot exceed 30 items. Please complete or archive existing targets.',
        },
      ],
    },
    digital_twin_state: {
      type: DigitalTwinStateSchema,
      required: true,
      default: () => ({}),
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// Compound Index: Accelerates goal notification engine queries
UserSchema.index({ 'active_goals.category': 1, 'active_goals.target_date': 1 }, { name: 'idx_users_goal_deadline' });

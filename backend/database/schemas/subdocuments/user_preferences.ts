import { Schema } from 'mongoose';

export interface IUserPreferences {
  currency: string;
  language: string;
  dark_mode: boolean;
  email_notifications: boolean;
  weekly_report_enabled: boolean;
}

export const UserPreferencesSchema = new Schema<IUserPreferences>(
  {
    currency: {
      type: String,
      required: true,
      default: 'INR',
      trim: true,
      uppercase: true,
      maxlength: 5,
    },
    language: {
      type: String,
      required: true,
      default: 'en',
      trim: true,
      lowercase: true,
      maxlength: 10,
    },
    dark_mode: {
      type: Boolean,
      required: true,
      default: true,
    },
    email_notifications: {
      type: Boolean,
      required: true,
      default: true,
    },
    weekly_report_enabled: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    _id: false, // Suppress automatic _id generation for 1:1 embedded subdocuments
    versionKey: false,
  }
);

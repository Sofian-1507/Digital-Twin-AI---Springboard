import mongoose, { Model } from 'mongoose';
import { IUser, UserSchema } from '../schemas/user_schema';

/**
 * Mongoose ODM Model for the 'users' collection.
 * Serves as the central aggregate root for identity, embedded profile, active goals, and real-time AI twin state.
 */
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema, 'users');

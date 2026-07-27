import mongoose, { Model } from 'mongoose';
import { IChatHistory, ChatHistorySchema } from '../schemas/chat_schema';

/**
 * Mongoose ODM Model for the 'chat_history' collection.
 * Conversational memory threads with Google Gemini / OpenAI assistants.
 */
export const ChatHistory: Model<IChatHistory> =
  mongoose.models.ChatHistory || mongoose.model<IChatHistory>('ChatHistory', ChatHistorySchema, 'chat_history');

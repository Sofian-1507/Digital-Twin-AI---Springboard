import mongoose, { Schema } from 'mongoose';
import { IChatMessage, ChatMessageSchema } from './subdocuments/chat_turn';

export interface IChatHistory extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  session_title: string;
  total_tokens_used: number;
  messages: IChatMessage[];
  started_at: Date;
  last_message_at: Date;
}

export const ChatHistorySchema = new Schema<IChatHistory>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required for chat session.'],
      index: true,
    },
    session_title: {
      type: String,
      required: [true, 'Session title is required.'],
      trim: true,
      maxlength: [150, 'Session title cannot exceed 150 characters.'],
      default: 'New Conversation',
    },
    total_tokens_used: {
      type: Number,
      required: true,
      min: [0, 'Total tokens cannot be negative.'],
      default: 0,
    },
    messages: {
      type: [ChatMessageSchema],
      required: true,
      default: [],
      validate: [
        {
          validator: (val: IChatMessage[]) => val.length <= 100,
          message: 'Chat thread cannot exceed 100 turns. Please initiate a new chat session to maintain performance.',
        },
      ],
    },
    started_at: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    last_message_at: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// ESR Index: Orders conversational sidebar by most recently active threads first
ChatHistorySchema.index({ user_id: 1, last_message_at: -1 }, { name: 'idx_chat_user_last_msg' });

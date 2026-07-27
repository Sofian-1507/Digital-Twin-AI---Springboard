import mongoose, { Schema } from 'mongoose';
import { ChatRole } from '../enums';

export interface IChatMessage {
  message_id: mongoose.Types.ObjectId;
  role: ChatRole;
  content: string;
  tokens_used: number;
  embedding?: number[]; // Optional 768-dim vector embedding per turn for fine-grained semantic recall
  timestamp: Date;
}

export const ChatMessageSchema = new Schema<IChatMessage>(
  {
    message_id: {
      type: Schema.Types.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(ChatRole),
    },
    content: {
      type: String,
      required: [true, 'Message content cannot be empty.'],
      trim: true,
      maxlength: [10000, 'Message content exceeds maximum allowed token character length.'],
    },
    tokens_used: {
      type: Number,
      required: true,
      min: [0, 'Tokens used cannot be negative.'],
      default: 0,
    },
    embedding: {
      type: [Number],
      required: false,
      select: false, // Exclude from standard read queries to conserve network bandwidth
      validate: {
        validator: (v: number[]) => !v || v.length === 768,
        message: 'Message embedding must be exactly 768 dimensions (Gemini text-embedding-004).',
      },
    },
    timestamp: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  {
    _id: false, // We use explicit message_id
    versionKey: false,
  }
);

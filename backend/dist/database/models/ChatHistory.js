"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHistory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chat_schema_1 = require("../schemas/chat_schema");
/**
 * Mongoose ODM Model for the 'chat_history' collection.
 * Conversational memory threads with Google Gemini / OpenAI assistants.
 */
exports.ChatHistory = mongoose_1.default.models.ChatHistory || mongoose_1.default.model('ChatHistory', chat_schema_1.ChatHistorySchema, 'chat_history');

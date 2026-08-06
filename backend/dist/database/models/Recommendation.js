"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recommendation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const recommendation_schema_1 = require("../schemas/recommendation_schema");
/**
 * Mongoose ODM Model for the 'recommendations' collection.
 * AI guidance feed with native Atlas Vector Search support over 768-dim Gemini embeddings.
 */
exports.Recommendation = mongoose_1.default.models.Recommendation || mongoose_1.default.model('Recommendation', recommendation_schema_1.RecommendationSchema, 'recommendations');

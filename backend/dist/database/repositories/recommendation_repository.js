"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationRepository = exports.RecommendationRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const base_repository_1 = require("./base_repository");
const index_1 = require("../models/index");
const enums_1 = require("../schemas/enums");
const vector_client_1 = require("../connections/vector_client");
/**
 * Enterprise Recommendation Data Access Object (DAO).
 * Manages Action Center prioritization, user feedback logging, and semantic RAG vector searches.
 */
class RecommendationRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(index_1.Recommendation);
    }
    /**
     * Retrieves Action Center primary feed: unread recommendations sorted by critical priority and date.
     * Excludes heavy 768-dim vector embeddings by default.
     */
    async getActionCenterFeed(userId, status = enums_1.RecommendationStatus.UNREAD, limit = 20) {
        const uId = new mongoose_1.default.Types.ObjectId(userId.toString());
        return await this.model
            .find({ user_id: uId, status: status })
            .sort({ priority: 1, generated_at: -1 })
            .limit(limit)
            .exec();
    }
    /**
     * Atomically records user feedback (Helpful / Unhelpful / Irrelevant) and updates action status.
     */
    async recordFeedback(recId, feedback, status = enums_1.RecommendationStatus.VIEWED) {
        const updatePayload = {
            user_feedback: feedback,
            status: status,
        };
        if (status === enums_1.RecommendationStatus.APPLIED) {
            updatePayload['acted_upon_at'] = new Date();
        }
        return await this.model.findByIdAndUpdate(recId, { $set: updatePayload }, { new: true }).exec();
    }
    /**
     * Executes semantic RAG similarity search via native MongoDB Atlas $vectorSearch over 768-dim Gemini embeddings.
     */
    async findSemanticSimilarAdvice(queryVector, userId, limit = 5) {
        return await vector_client_1.AtlasVectorClient.searchSimilarRecommendations({
            queryVector,
            userId,
            limit,
        });
    }
}
exports.RecommendationRepository = RecommendationRepository;
exports.recommendationRepository = new RecommendationRepository();

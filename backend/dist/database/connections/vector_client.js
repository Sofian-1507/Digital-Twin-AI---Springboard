"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtlasVectorClient = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Recommendation_1 = require("../models/Recommendation");
/**
 * Native MongoDB Atlas Vector Search Helper Client.
 * Facilitates Retrieval-Augmented Generation (RAG) by executing $vectorSearch queries
 * over 768-dimensional Google Gemini embeddings stored in Atlas.
 */
class AtlasVectorClient {
    /**
     * Executes a semantic similarity search on the recommendations collection using Atlas Vector Search ($vectorSearch).
     * Note: This requires an active Atlas cluster with the 'idx_rec_vector_search' HNSW index deployed.
     */
    static async searchSimilarRecommendations(options) {
        const { queryVector, limit = 5, numCandidates = 50, userId, category, status, } = options;
        if (queryVector.length !== 768) {
            throw new Error(`[AtlasVectorClient] Query vector must be exactly 768 dimensions (Gemini text-embedding-004). Got ${queryVector.length}.`);
        }
        // Build pre-filter query for vector search
        const filter = {};
        if (userId)
            filter['user_id'] = new mongoose_1.default.Types.ObjectId(userId.toString());
        if (category)
            filter['category'] = category;
        if (status)
            filter['status'] = status;
        const vectorSearchStage = {
            $vectorSearch: {
                index: 'idx_rec_vector_search',
                path: 'embedding',
                queryVector: queryVector,
                numCandidates: numCandidates,
                limit: limit,
            },
        };
        // Include filter if any criteria were specified
        if (Object.keys(filter).length > 0) {
            vectorSearchStage.$vectorSearch.filter = filter;
        }
        const pipeline = [
            vectorSearchStage,
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    title: 1,
                    recommendation_text: 1,
                    category: 1,
                    priority: 1,
                    impact_score: 1,
                    score: { $meta: 'vectorSearchScore' },
                },
            },
        ];
        const results = await Recommendation_1.Recommendation.aggregate(pipeline).exec();
        return results;
    }
}
exports.AtlasVectorClient = AtlasVectorClient;

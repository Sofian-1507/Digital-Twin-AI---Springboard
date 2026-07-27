import mongoose, { PipelineStage } from 'mongoose';
import { Recommendation } from '../models/Recommendation';

export interface VectorSearchOptions {
  queryVector: number[];
  limit?: number;
  numCandidates?: number;
  userId?: string | mongoose.Types.ObjectId;
  category?: string;
  status?: string;
}

export interface VectorSearchResult {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  title: string;
  recommendation_text: string;
  category: string;
  priority: string;
  impact_score: mongoose.Types.Decimal128;
  score: number; // Cosine similarity score returned by $vectorSearch
}

/**
 * Native MongoDB Atlas Vector Search Helper Client.
 * Facilitates Retrieval-Augmented Generation (RAG) by executing $vectorSearch queries
 * over 768-dimensional Google Gemini embeddings stored in Atlas.
 */
export class AtlasVectorClient {
  /**
   * Executes a semantic similarity search on the recommendations collection using Atlas Vector Search ($vectorSearch).
   * Note: This requires an active Atlas cluster with the 'idx_rec_vector_search' HNSW index deployed.
   */
  public static async searchSimilarRecommendations(options: VectorSearchOptions): Promise<VectorSearchResult[]> {
    const {
      queryVector,
      limit = 5,
      numCandidates = 50,
      userId,
      category,
      status,
    } = options;

    if (queryVector.length !== 768) {
      throw new Error(`[AtlasVectorClient] Query vector must be exactly 768 dimensions (Gemini text-embedding-004). Got ${queryVector.length}.`);
    }

    // Build pre-filter query for vector search
    const filter: Record<string, any> = {};
    if (userId) filter['user_id'] = new mongoose.Types.ObjectId(userId.toString());
    if (category) filter['category'] = category;
    if (status) filter['status'] = status;

    const vectorSearchStage: any = {
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

    const pipeline: PipelineStage[] = [
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

    const results = await Recommendation.aggregate<VectorSearchResult>(pipeline).exec();
    return results;
  }
}

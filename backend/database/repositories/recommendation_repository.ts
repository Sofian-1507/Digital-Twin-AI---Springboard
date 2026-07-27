import mongoose from 'mongoose';
import { BaseRepository } from './base_repository';
import { IRecommendation } from '../schemas/recommendation_schema';
import { Recommendation } from '../models/index';
import { RecommendationStatus, Priority, UserFeedback } from '../schemas/enums';
import { AtlasVectorClient, VectorSearchResult } from '../connections/vector_client';

/**
 * Enterprise Recommendation Data Access Object (DAO).
 * Manages Action Center prioritization, user feedback logging, and semantic RAG vector searches.
 */
export class RecommendationRepository extends BaseRepository<IRecommendation> {
  constructor() {
    super(Recommendation);
  }

  /**
   * Retrieves Action Center primary feed: unread recommendations sorted by critical priority and date.
   * Excludes heavy 768-dim vector embeddings by default.
   */
  public async getActionCenterFeed(
    userId: string | mongoose.Types.ObjectId,
    status: RecommendationStatus = RecommendationStatus.UNREAD,
    limit: number = 20
  ): Promise<IRecommendation[]> {
    const uId = new mongoose.Types.ObjectId(userId.toString());

    return await this.model
      .find({ user_id: uId, status: status })
      .sort({ priority: 1, generated_at: -1 })
      .limit(limit)
      .exec();
  }

  /**
   * Atomically records user feedback (Helpful / Unhelpful / Irrelevant) and updates action status.
   */
  public async recordFeedback(
    recId: string | mongoose.Types.ObjectId,
    feedback: UserFeedback,
    status: RecommendationStatus = RecommendationStatus.VIEWED
  ): Promise<IRecommendation | null> {
    const updatePayload: Record<string, any> = {
      user_feedback: feedback,
      status: status,
    };
    if (status === RecommendationStatus.APPLIED) {
      updatePayload['acted_upon_at'] = new Date();
    }

    return await this.model.findByIdAndUpdate(recId, { $set: updatePayload }, { new: true }).exec();
  }

  /**
   * Executes semantic RAG similarity search via native MongoDB Atlas $vectorSearch over 768-dim Gemini embeddings.
   */
  public async findSemanticSimilarAdvice(
    queryVector: number[],
    userId?: string | mongoose.Types.ObjectId,
    limit: number = 5
  ): Promise<VectorSearchResult[]> {
    return await AtlasVectorClient.searchSimilarRecommendations({
      queryVector,
      userId,
      limit,
    });
  }
}

export const recommendationRepository = new RecommendationRepository();

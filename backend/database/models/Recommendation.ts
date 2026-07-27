import mongoose, { Model } from 'mongoose';
import { IRecommendation, RecommendationSchema } from '../schemas/recommendation_schema';

/**
 * Mongoose ODM Model for the 'recommendations' collection.
 * AI guidance feed with native Atlas Vector Search support over 768-dim Gemini embeddings.
 */
export const Recommendation: Model<IRecommendation> =
  mongoose.models.Recommendation || mongoose.model<IRecommendation>('Recommendation', RecommendationSchema, 'recommendations');

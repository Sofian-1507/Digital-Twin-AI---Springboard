import mongoose from 'mongoose';
import { BaseRepository } from './base_repository';
import { IFinancialRecord } from '../schemas/finance_schema';
import { FinancialRecord } from '../models/index';
import { TransactionType } from '../schemas/enums';

export interface MonthlyCashflowAggregation {
  _id: {
    year: number;
    month: number;
    type: TransactionType;
  };
  total_amount: mongoose.Types.Decimal128;
  transaction_count: number;
}

export interface CategorySpendingBreakdown {
  category: string;
  total_amount: mongoose.Types.Decimal128;
  percentage_of_total: number;
}

/**
 * Enterprise Financial Record Data Access Object (DAO).
 * Encapsulates time-series ledger queries and Mongoose aggregation pipelines
 * designed specifically to feed the Random Forest savings prediction ML model.
 */
export class FinancialRecordRepository extends BaseRepository<IFinancialRecord> {
  constructor() {
    super(FinancialRecord);
  }

  /**
   * Aggregates monthly cash flow (Income vs Expense vs Savings) over a specified time window.
   * Feeds directly into Scikit-Learn Random Forest regression feature matrices.
   */
  public async getMonthlyCashflowPipeline(
    userId: string | mongoose.Types.ObjectId,
    startDate: Date,
    endDate: Date = new Date()
  ): Promise<MonthlyCashflowAggregation[]> {
    const uId = new mongoose.Types.ObjectId(userId.toString());

    return await this.model.aggregate<MonthlyCashflowAggregation>([
      {
        $match: {
          user_id: uId,
          transaction_date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$transaction_date' },
            month: { $month: '$transaction_date' },
            type: '$type',
          },
          total_amount: { $sum: '$amount' },
          transaction_count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]).exec();
  }

  /**
   * Generates category-wise spending breakdown for UI donut charts and financial audit reports.
   */
  public async getCategorySpendingBreakdown(
    userId: string | mongoose.Types.ObjectId,
    startDate: Date,
    endDate: Date = new Date()
  ): Promise<CategorySpendingBreakdown[]> {
    const uId = new mongoose.Types.ObjectId(userId.toString());

    const results = await this.model.aggregate([
      {
        $match: {
          user_id: uId,
          type: TransactionType.EXPENSE,
          transaction_date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          total_amount: { $sum: '$amount' },
        },
      },
      {
        $sort: { total_amount: -1 },
      },
    ]).exec();

    // Compute total expenses for percentage calculation
    let grandTotal = 0;
    for (const r of results) {
      grandTotal += parseFloat(r.total_amount.toString());
    }

    return results.map((r) => ({
      category: r._id,
      total_amount: r.total_amount,
      percentage_of_total: grandTotal > 0 ? parseFloat(((parseFloat(r.total_amount.toString()) / grandTotal) * 100).toFixed(2)) : 0,
    }));
  }
}

export const financialRecordRepository = new FinancialRecordRepository();

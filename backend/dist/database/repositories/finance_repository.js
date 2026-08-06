"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.financialRecordRepository = exports.FinancialRecordRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const base_repository_1 = require("./base_repository");
const index_1 = require("../models/index");
const enums_1 = require("../schemas/enums");
/**
 * Enterprise Financial Record Data Access Object (DAO).
 * Encapsulates time-series ledger queries and Mongoose aggregation pipelines
 * designed specifically to feed the Random Forest savings prediction ML model.
 */
class FinancialRecordRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(index_1.FinancialRecord);
    }
    /**
     * Aggregates monthly cash flow (Income vs Expense vs Savings) over a specified time window.
     * Feeds directly into Scikit-Learn Random Forest regression feature matrices.
     */
    async getMonthlyCashflowPipeline(userId, startDate, endDate = new Date()) {
        const uId = new mongoose_1.default.Types.ObjectId(userId.toString());
        return await this.model.aggregate([
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
    async getCategorySpendingBreakdown(userId, startDate, endDate = new Date()) {
        const uId = new mongoose_1.default.Types.ObjectId(userId.toString());
        const results = await this.model.aggregate([
            {
                $match: {
                    user_id: uId,
                    type: enums_1.TransactionType.EXPENSE,
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
exports.FinancialRecordRepository = FinancialRecordRepository;
exports.financialRecordRepository = new FinancialRecordRepository();

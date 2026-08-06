"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialRecordSchema = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("./enums");
exports.FinancialRecordSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID reference is required for transaction ledger entry.'],
        index: true,
    },
    type: {
        type: String,
        required: [true, 'Transaction type is required.'],
        enum: Object.values(enums_1.TransactionType),
    },
    amount: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: [true, 'Monetary amount is required.'],
        validate: {
            validator: (v) => parseFloat(v.toString()) > 0,
            message: 'Transaction amount must be strictly greater than 0.00.',
        },
    },
    category: {
        type: String,
        required: [true, 'Spending/Income category is required.'],
        enum: Object.values(enums_1.FinancialCategory),
    },
    description: {
        type: String,
        required: false,
        trim: true,
        maxlength: [255, 'Transaction description cannot exceed 255 characters.'],
    },
    is_recurring: {
        type: Boolean,
        required: true,
        default: false,
    },
    recurring_frequency: {
        type: String,
        required: function () {
            return this.is_recurring === true;
        },
        enum: Object.values(enums_1.RecurringFrequency),
    },
    linked_goal_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        description: 'Reference to users.active_goals.goal_id if this is a savings transfer.',
    },
    transaction_date: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false }, // Ledger entries are immutable! No updatedAt.
    versionKey: false,
    toJSON: { getters: true },
    toObject: { getters: true },
});
// ESR Index 1: Dashboard recent transaction ledger view
exports.FinancialRecordSchema.index({ user_id: 1, transaction_date: -1 }, { name: 'idx_finance_user_date' });
// ESR Index 2: Budget breakdown by category donut charts
exports.FinancialRecordSchema.index({ user_id: 1, category: 1, transaction_date: -1 }, { name: 'idx_finance_user_cat_date' });
// ESR Index 3: Cashflow segmentation (Income vs Expense) for Random Forest regression pipeline
exports.FinancialRecordSchema.index({ user_id: 1, type: 1, transaction_date: -1 }, { name: 'idx_finance_user_type_date' });

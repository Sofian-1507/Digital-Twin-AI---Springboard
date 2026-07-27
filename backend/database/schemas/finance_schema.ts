import mongoose, { Schema } from 'mongoose';
import { TransactionType, FinancialCategory, RecurringFrequency } from './enums';

export interface IFinancialRecord extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  type: TransactionType;
  amount: mongoose.Types.Decimal128;
  category: FinancialCategory;
  description?: string;
  is_recurring: boolean;
  recurring_frequency?: RecurringFrequency;
  linked_goal_id?: mongoose.Types.ObjectId;
  transaction_date: Date;
  created_at: Date;
}

export const FinancialRecordSchema = new Schema<IFinancialRecord>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required for transaction ledger entry.'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required.'],
      enum: Object.values(TransactionType),
    },
    amount: {
      type: Schema.Types.Decimal128,
      required: [true, 'Monetary amount is required.'],
      validate: {
        validator: (v: mongoose.Types.Decimal128) => parseFloat(v.toString()) > 0,
        message: 'Transaction amount must be strictly greater than 0.00.',
      },
    },
    category: {
      type: String,
      required: [true, 'Spending/Income category is required.'],
      enum: Object.values(FinancialCategory),
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
      required: function (this: IFinancialRecord) {
        return this.is_recurring === true;
      },
      enum: Object.values(RecurringFrequency),
    },
    linked_goal_id: {
      type: Schema.Types.ObjectId,
      required: false,
      description: 'Reference to users.active_goals.goal_id if this is a savings transfer.',
    },
    transaction_date: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false }, // Ledger entries are immutable! No updatedAt.
    versionKey: false,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// ESR Index 1: Dashboard recent transaction ledger view
FinancialRecordSchema.index({ user_id: 1, transaction_date: -1 }, { name: 'idx_finance_user_date' });

// ESR Index 2: Budget breakdown by category donut charts
FinancialRecordSchema.index({ user_id: 1, category: 1, transaction_date: -1 }, { name: 'idx_finance_user_cat_date' });

// ESR Index 3: Cashflow segmentation (Income vs Expense) for Random Forest regression pipeline
FinancialRecordSchema.index({ user_id: 1, type: 1, transaction_date: -1 }, { name: 'idx_finance_user_type_date' });

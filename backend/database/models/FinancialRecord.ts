import mongoose, { Model } from 'mongoose';
import { IFinancialRecord, FinancialRecordSchema } from '../schemas/finance_schema';

/**
 * Mongoose ODM Model for the 'financial_records' collection.
 * Time-series ledger storing immutable income, expense, and savings transactions.
 */
export const FinancialRecord: Model<IFinancialRecord> =
  mongoose.models.FinancialRecord || mongoose.model<IFinancialRecord>('FinancialRecord', FinancialRecordSchema, 'financial_records');

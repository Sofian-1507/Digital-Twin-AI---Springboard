"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialRecord = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const finance_schema_1 = require("../schemas/finance_schema");
/**
 * Mongoose ODM Model for the 'financial_records' collection.
 * Time-series ledger storing immutable income, expense, and savings transactions.
 */
exports.FinancialRecord = mongoose_1.default.models.FinancialRecord || mongoose_1.default.model('FinancialRecord', finance_schema_1.FinancialRecordSchema, 'financial_records');

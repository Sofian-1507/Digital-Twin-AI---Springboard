import mongoose from 'mongoose';

/**
 * Enterprise Custom Mongoose Schema Validators for Digital Twin AI.
 * Provides reusable validation functions and messages for financial currencies,
 * biometric boundaries, and vector embeddings.
 */
export class DatabaseValidators {
  /**
   * Validates that a string is a valid 3-letter ISO currency code (default: INR, USD, EUR, GBP, JPY).
   */
  public static isValidCurrency(val: string): boolean {
    const validCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'SGD'];
    return validCurrencies.includes(val.toUpperCase());
  }

  /**
   * Validates that an array of numbers is exactly 768 dimensions (Google Gemini text-embedding-004).
   */
  public static isValidGeminiEmbedding(val: number[] | undefined): boolean {
    if (!val) return true; // Optional field
    if (!Array.isArray(val)) return false;
    if (val.length !== 768) return false;
    return val.every((num) => typeof num === 'number' && !isNaN(num));
  }

  /**
   * Validates that an active goals array does not exceed the hard cap of 30 items.
   */
  public static isValidActiveGoalLimit(val: any[]): boolean {
    if (!Array.isArray(val)) return false;
    return val.length <= 30;
  }

  /**
   * Validates that a chat messages array does not exceed the hard cap of 100 turns.
   */
  public static isValidChatTurnLimit(val: any[]): boolean {
    if (!Array.isArray(val)) return false;
    return val.length <= 100;
  }

  /**
   * Validates that a Decimal128 monetary amount is strictly positive (> 0).
   */
  public static isPositiveDecimal(val: mongoose.Types.Decimal128): boolean {
    if (!val) return false;
    const num = parseFloat(val.toString());
    return !isNaN(num) && num > 0;
  }

  /**
   * Validates that a percentage Decimal128 is within [0.0, 100.0].
   */
  public static isPercentageDecimal(val: mongoose.Types.Decimal128): boolean {
    if (!val) return false;
    const num = parseFloat(val.toString());
    return !isNaN(num) && num >= 0.0 && num <= 100.0;
  }
}

/**
 * Centralized TypeScript Enums for Digital Twin AI Database Layer.
 * These enums are bound directly to Mongoose Schema enum validators and TypeScript interfaces.
 */

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export enum RiskTolerance {
  CONSERVATIVE = 'CONSERVATIVE',
  MODERATE = 'MODERATE',
  AGGRESSIVE = 'AGGRESSIVE',
}

export enum GoalCategory {
  FINANCE = 'FINANCE',
  STUDY = 'STUDY',
  HABIT = 'HABIT',
  FITNESS = 'FITNESS',
  CAREER = 'CAREER',
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  SAVINGS_DEPOSIT = 'SAVINGS_DEPOSIT',
  INVESTMENT = 'INVESTMENT',
}

export enum FinancialCategory {
  HOUSING = 'HOUSING',
  FOOD = 'FOOD',
  UTILITIES = 'UTILITIES',
  SALARY = 'SALARY',
  ENTERTAINMENT = 'ENTERTAINMENT',
  HEALTH = 'HEALTH',
  EDUCATION = 'EDUCATION',
  INVESTMENT = 'INVESTMENT',
  TRANSPORT = 'TRANSPORT',
  SAVINGS = 'SAVINGS',
  OTHER = 'OTHER',
}

export enum RecurringFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY',
}

export enum SessionType {
  DEEP_WORK = 'DEEP_WORK',
  REVIEW = 'REVIEW',
  LECTURE = 'LECTURE',
  PRACTICE_EXAM = 'PRACTICE_EXAM',
  ASSIGNMENT = 'ASSIGNMENT',
  RESEARCH = 'RESEARCH',
}

export enum BurnoutRisk {
  LOW_RISK = 'LOW_RISK',
  MODERATE_RISK = 'MODERATE_RISK',
  HIGH_RISK = 'HIGH_RISK',
  CRITICAL_BURNOUT = 'CRITICAL_BURNOUT',
  UNKNOWN = 'UNKNOWN',
}

export enum SimulationDomain {
  FINANCE = 'FINANCE',
  ACADEMIC = 'ACADEMIC',
  HABIT = 'HABIT',
  HYBRID_LIFESTYLE = 'HYBRID_LIFESTYLE',
}

export enum SimulationStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PARTIAL = 'PARTIAL',
}

export enum RecommendationCategory {
  FINANCE = 'FINANCE',
  ACADEMIC = 'ACADEMIC',
  HABIT = 'HABIT',
  FITNESS = 'FITNESS',
  PRODUCTIVITY = 'PRODUCTIVITY',
  WELL_BEING = 'WELL_BEING',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum RecommendationStatus {
  UNREAD = 'UNREAD',
  VIEWED = 'VIEWED',
  APPLIED = 'APPLIED',
  DISMISSED = 'DISMISSED',
}

export enum UserFeedback {
  HELPFUL = 'HELPFUL',
  UNHELPFUL = 'UNHELPFUL',
  IRRELEVANT = 'IRRELEVANT',
}

export enum GoalStatus {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ABANDONED = 'ABANDONED',
}

export enum ChatRole {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
  SYSTEM = 'SYSTEM',
}

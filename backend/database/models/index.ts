/**
 * Central Model Barrel Export for Digital Twin AI Database Layer.
 * Re-exports all 10 compiled Mongoose ODM models from a single top-level module
 * to prevent duplicate model compilation crashes and streamline repository imports.
 */

export * from '../schemas/enums';
export * from '../schemas/subdocuments/user_preferences';
export * from '../schemas/subdocuments/active_goal';
export * from '../schemas/subdocuments/digital_twin_state';
export * from '../schemas/subdocuments/chat_turn';

export * from './User';
export * from './FinancialRecord';
export * from './StudyActivity';
export * from './HabitTracking';
export * from './Simulation';
export * from './Recommendation';
export * from './ChatHistory';
export * from './Report';
export * from './AnalyticsLog';
export * from './DashboardCache';
export * from './GoalArchive';

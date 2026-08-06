"use strict";
/**
 * Centralized TypeScript Enums for Digital Twin AI Database Layer.
 * These enums are bound directly to Mongoose Schema enum validators and TypeScript interfaces.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRole = exports.GoalStatus = exports.UserFeedback = exports.RecommendationStatus = exports.Priority = exports.RecommendationCategory = exports.SimulationStatus = exports.SimulationDomain = exports.BurnoutRisk = exports.SessionType = exports.RecurringFrequency = exports.FinancialCategory = exports.TransactionType = exports.GoalCategory = exports.RiskTolerance = exports.Gender = void 0;
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["NON_BINARY"] = "NON_BINARY";
    Gender["PREFER_NOT_TO_SAY"] = "PREFER_NOT_TO_SAY";
})(Gender || (exports.Gender = Gender = {}));
var RiskTolerance;
(function (RiskTolerance) {
    RiskTolerance["CONSERVATIVE"] = "CONSERVATIVE";
    RiskTolerance["MODERATE"] = "MODERATE";
    RiskTolerance["AGGRESSIVE"] = "AGGRESSIVE";
})(RiskTolerance || (exports.RiskTolerance = RiskTolerance = {}));
var GoalCategory;
(function (GoalCategory) {
    GoalCategory["FINANCE"] = "FINANCE";
    GoalCategory["STUDY"] = "STUDY";
    GoalCategory["HABIT"] = "HABIT";
    GoalCategory["FITNESS"] = "FITNESS";
    GoalCategory["CAREER"] = "CAREER";
})(GoalCategory || (exports.GoalCategory = GoalCategory = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["INCOME"] = "INCOME";
    TransactionType["EXPENSE"] = "EXPENSE";
    TransactionType["SAVINGS_DEPOSIT"] = "SAVINGS_DEPOSIT";
    TransactionType["INVESTMENT"] = "INVESTMENT";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var FinancialCategory;
(function (FinancialCategory) {
    FinancialCategory["HOUSING"] = "HOUSING";
    FinancialCategory["FOOD"] = "FOOD";
    FinancialCategory["UTILITIES"] = "UTILITIES";
    FinancialCategory["SALARY"] = "SALARY";
    FinancialCategory["ENTERTAINMENT"] = "ENTERTAINMENT";
    FinancialCategory["HEALTH"] = "HEALTH";
    FinancialCategory["EDUCATION"] = "EDUCATION";
    FinancialCategory["INVESTMENT"] = "INVESTMENT";
    FinancialCategory["TRANSPORT"] = "TRANSPORT";
    FinancialCategory["SAVINGS"] = "SAVINGS";
    FinancialCategory["OTHER"] = "OTHER";
})(FinancialCategory || (exports.FinancialCategory = FinancialCategory = {}));
var RecurringFrequency;
(function (RecurringFrequency) {
    RecurringFrequency["DAILY"] = "DAILY";
    RecurringFrequency["WEEKLY"] = "WEEKLY";
    RecurringFrequency["BIWEEKLY"] = "BIWEEKLY";
    RecurringFrequency["MONTHLY"] = "MONTHLY";
    RecurringFrequency["QUARTERLY"] = "QUARTERLY";
    RecurringFrequency["ANNUALLY"] = "ANNUALLY";
})(RecurringFrequency || (exports.RecurringFrequency = RecurringFrequency = {}));
var SessionType;
(function (SessionType) {
    SessionType["DEEP_WORK"] = "DEEP_WORK";
    SessionType["REVIEW"] = "REVIEW";
    SessionType["LECTURE"] = "LECTURE";
    SessionType["PRACTICE_EXAM"] = "PRACTICE_EXAM";
    SessionType["ASSIGNMENT"] = "ASSIGNMENT";
    SessionType["RESEARCH"] = "RESEARCH";
})(SessionType || (exports.SessionType = SessionType = {}));
var BurnoutRisk;
(function (BurnoutRisk) {
    BurnoutRisk["LOW_RISK"] = "LOW_RISK";
    BurnoutRisk["MODERATE_RISK"] = "MODERATE_RISK";
    BurnoutRisk["HIGH_RISK"] = "HIGH_RISK";
    BurnoutRisk["CRITICAL_BURNOUT"] = "CRITICAL_BURNOUT";
    BurnoutRisk["UNKNOWN"] = "UNKNOWN";
})(BurnoutRisk || (exports.BurnoutRisk = BurnoutRisk = {}));
var SimulationDomain;
(function (SimulationDomain) {
    SimulationDomain["FINANCE"] = "FINANCE";
    SimulationDomain["ACADEMIC"] = "ACADEMIC";
    SimulationDomain["HABIT"] = "HABIT";
    SimulationDomain["HYBRID_LIFESTYLE"] = "HYBRID_LIFESTYLE";
})(SimulationDomain || (exports.SimulationDomain = SimulationDomain = {}));
var SimulationStatus;
(function (SimulationStatus) {
    SimulationStatus["SUCCESS"] = "SUCCESS";
    SimulationStatus["FAILED"] = "FAILED";
    SimulationStatus["PARTIAL"] = "PARTIAL";
})(SimulationStatus || (exports.SimulationStatus = SimulationStatus = {}));
var RecommendationCategory;
(function (RecommendationCategory) {
    RecommendationCategory["FINANCE"] = "FINANCE";
    RecommendationCategory["ACADEMIC"] = "ACADEMIC";
    RecommendationCategory["HABIT"] = "HABIT";
    RecommendationCategory["FITNESS"] = "FITNESS";
    RecommendationCategory["PRODUCTIVITY"] = "PRODUCTIVITY";
    RecommendationCategory["WELL_BEING"] = "WELL_BEING";
})(RecommendationCategory || (exports.RecommendationCategory = RecommendationCategory = {}));
var Priority;
(function (Priority) {
    Priority["LOW"] = "LOW";
    Priority["MEDIUM"] = "MEDIUM";
    Priority["HIGH"] = "HIGH";
    Priority["CRITICAL"] = "CRITICAL";
})(Priority || (exports.Priority = Priority = {}));
var RecommendationStatus;
(function (RecommendationStatus) {
    RecommendationStatus["UNREAD"] = "UNREAD";
    RecommendationStatus["VIEWED"] = "VIEWED";
    RecommendationStatus["APPLIED"] = "APPLIED";
    RecommendationStatus["DISMISSED"] = "DISMISSED";
})(RecommendationStatus || (exports.RecommendationStatus = RecommendationStatus = {}));
var UserFeedback;
(function (UserFeedback) {
    UserFeedback["HELPFUL"] = "HELPFUL";
    UserFeedback["UNHELPFUL"] = "UNHELPFUL";
    UserFeedback["IRRELEVANT"] = "IRRELEVANT";
})(UserFeedback || (exports.UserFeedback = UserFeedback = {}));
var GoalStatus;
(function (GoalStatus) {
    GoalStatus["COMPLETED"] = "COMPLETED";
    GoalStatus["FAILED"] = "FAILED";
    GoalStatus["ABANDONED"] = "ABANDONED";
})(GoalStatus || (exports.GoalStatus = GoalStatus = {}));
var ChatRole;
(function (ChatRole) {
    ChatRole["USER"] = "USER";
    ChatRole["ASSISTANT"] = "ASSISTANT";
    ChatRole["SYSTEM"] = "SYSTEM";
})(ChatRole || (exports.ChatRole = ChatRole = {}));

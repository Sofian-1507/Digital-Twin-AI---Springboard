"use strict";
/**
 * Central Model Barrel Export for Digital Twin AI Database Layer.
 * Re-exports all 10 compiled Mongoose ODM models from a single top-level module
 * to prevent duplicate model compilation crashes and streamline repository imports.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("../schemas/enums"), exports);
__exportStar(require("../schemas/subdocuments/user_preferences"), exports);
__exportStar(require("../schemas/subdocuments/active_goal"), exports);
__exportStar(require("../schemas/subdocuments/digital_twin_state"), exports);
__exportStar(require("../schemas/subdocuments/chat_turn"), exports);
__exportStar(require("./User"), exports);
__exportStar(require("./FinancialRecord"), exports);
__exportStar(require("./StudyActivity"), exports);
__exportStar(require("./HabitTracking"), exports);
__exportStar(require("./Simulation"), exports);
__exportStar(require("./Recommendation"), exports);
__exportStar(require("./ChatHistory"), exports);
__exportStar(require("./Report"), exports);
__exportStar(require("./AnalyticsLog"), exports);
__exportStar(require("./DashboardCache"), exports);
__exportStar(require("./GoalArchive"), exports);

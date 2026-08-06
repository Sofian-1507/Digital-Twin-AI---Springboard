"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulationSchema = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("./enums");
exports.SimulationSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID reference is required for simulation record.'],
        index: true,
    },
    scenario_name: {
        type: String,
        required: [true, 'Scenario title is required.'],
        trim: true,
        maxlength: [200, 'Scenario name cannot exceed 200 characters.'],
    },
    domain: {
        type: String,
        required: true,
        enum: Object.values(enums_1.SimulationDomain),
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(enums_1.SimulationStatus),
        default: enums_1.SimulationStatus.SUCCESS,
    },
    input_parameters: {
        type: mongoose_1.Schema.Types.Mixed,
        required: [true, 'Polymorphic input variables are required.'],
        default: {},
    },
    baseline_projection: {
        type: mongoose_1.Schema.Types.Mixed,
        required: [true, 'Baseline ML trajectory projection is required.'],
        default: {},
    },
    alternative_projection: {
        type: mongoose_1.Schema.Types.Mixed,
        required: [true, 'Alternative ML trajectory projection is required.'],
        default: {},
    },
    comparative_summary: {
        type: mongoose_1.Schema.Types.Mixed,
        required: [true, 'Pre-computed comparative summary deltas are required.'],
        default: {},
    },
    ai_recommendation_text: {
        type: String,
        required: [true, 'Gemini AI executive summary text is required.'],
        trim: true,
        maxlength: [5000, 'AI recommendation text cannot exceed 5000 characters.'],
    },
    execution_time_ms: {
        type: Number,
        required: true,
        min: [0, 'Execution time cannot be negative.'],
    },
    linked_goal_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
    },
    generated_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
}, {
    timestamps: false, // Immutable archive! Use generated_at timestamp.
    versionKey: false,
    minimize: false, // Ensure empty objects {} in mixed fields are preserved in BSON
});
// ESR Index 1: Simulation history panel — most recent first
exports.SimulationSchema.index({ user_id: 1, generated_at: -1 }, { name: 'idx_sim_user_date' });
// ESR Index 2: Filter history by simulation domain
exports.SimulationSchema.index({ user_id: 1, domain: 1, generated_at: -1 }, { name: 'idx_sim_user_domain_date' });

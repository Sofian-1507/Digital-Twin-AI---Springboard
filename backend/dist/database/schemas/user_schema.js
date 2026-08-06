"use strict";
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const enums_1 = require("./enums");
const user_preferences_1 = require("./subdocuments/user_preferences");
const active_goal_1 = require("./subdocuments/active_goal");
const digital_twin_state_1 = require("./subdocuments/digital_twin_state");
const ProfileSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Full display name is required.'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters.'],
        maxlength: [100, 'Name cannot exceed 100 characters.'],
    },
    age: {
        type: Number,
        required: [true, 'Demographic age is required for K-Means cohort clustering.'],
        min: [13, 'Minimum age is 13.'],
        max: [120, 'Maximum realistic age is 120.'],
    },
    gender: {
        type: String,
        required: false,
        enum: Object.values(enums_1.Gender),
    },
    occupation: {
        type: String,
        required: false,
        trim: true,
        maxlength: [100, 'Occupation cannot exceed 100 characters.'],
    },
    monthly_income_baseline: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: true,
        default: () => mongoose_1.default.Types.Decimal128.fromString('0.00'),
        validate: {
            validator: (v) => parseFloat(v.toString()) >= 0,
            message: 'Monthly income baseline cannot be negative.',
        },
    },
    risk_tolerance: {
        type: String,
        required: true,
        enum: Object.values(enums_1.RiskTolerance),
        default: enums_1.RiskTolerance.MODERATE,
    },
}, { _id: false });
exports.UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, 'Email address is required.'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please fill a valid email address.'],
    },
    password_hash: {
        type: String,
        required: [true, 'Cryptographic password hash is required.'],
        select: false, // Never return password hash in read queries by default
    },
    profile: {
        type: ProfileSchema,
        required: true,
        default: () => ({}),
    },
    preferences: {
        type: user_preferences_1.UserPreferencesSchema,
        required: true,
        default: () => ({}),
    },
    active_goals: {
        type: [active_goal_1.ActiveGoalSchema],
        required: true,
        default: [],
        validate: [
            {
                validator: (val) => val.length <= 30,
                message: 'Active goals array cannot exceed 30 items. Please complete or archive existing targets.',
            },
        ],
    },
    digital_twin_state: {
        type: digital_twin_state_1.DigitalTwinStateSchema,
        required: true,
        default: () => ({}),
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
    toJSON: { getters: true },
    toObject: { getters: true },
});
// Compound Index: Accelerates goal notification engine queries
exports.UserSchema.index({ 'active_goals.category': 1, 'active_goals.target_date': 1 }, { name: 'idx_users_goal_deadline' });

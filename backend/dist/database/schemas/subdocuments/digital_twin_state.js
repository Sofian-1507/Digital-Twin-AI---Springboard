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
exports.DigitalTwinStateSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const enums_1 = require("../enums");
const percentageValidator = [
    {
        validator: (v) => parseFloat(v.toString()) >= 0.0 && parseFloat(v.toString()) <= 100.0,
        message: 'Percentage metrics must be between 0.0 and 100.0.',
    },
];
exports.DigitalTwinStateSchema = new mongoose_1.Schema({
    savings_rate_pct: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: true,
        default: () => mongoose_1.default.Types.Decimal128.fromString('0.0'),
        validate: percentageValidator,
    },
    emergency_fund_months: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: true,
        default: () => mongoose_1.default.Types.Decimal128.fromString('0.0'),
        validate: {
            validator: (v) => parseFloat(v.toString()) >= 0.0,
            message: 'Emergency fund months cannot be negative.',
        },
    },
    study_consistency_score: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: true,
        default: () => mongoose_1.default.Types.Decimal128.fromString('0.0'),
        validate: percentageValidator,
    },
    predicted_exam_score: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: false,
        validate: percentageValidator,
    },
    habit_completion_rate: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: true,
        default: () => mongoose_1.default.Types.Decimal128.fromString('0.0'),
        validate: percentageValidator,
    },
    lifestyle_score: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: true,
        default: () => mongoose_1.default.Types.Decimal128.fromString('0.0'),
        validate: percentageValidator,
    },
    productivity_score: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: true,
        default: () => mongoose_1.default.Types.Decimal128.fromString('0.0'),
        validate: percentageValidator,
    },
    burnout_risk_cluster: {
        type: String,
        required: true,
        enum: Object.values(enums_1.BurnoutRisk),
        default: enums_1.BurnoutRisk.UNKNOWN,
    },
    last_updated_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
}, {
    _id: false,
    versionKey: false,
});

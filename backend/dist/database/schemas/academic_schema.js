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
exports.StudyActivitySchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const enums_1 = require("./enums");
exports.StudyActivitySchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID reference is required for study activity log.'],
        index: true,
    },
    subject: {
        type: String,
        required: [true, 'Academic subject name is required.'],
        trim: true,
        maxlength: [100, 'Subject name cannot exceed 100 characters.'],
    },
    study_hours: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: [true, 'Study duration in hours is required.'],
        validate: {
            validator: (v) => {
                const val = parseFloat(v.toString());
                return val >= 0.1 && val <= 24.0;
            },
            message: 'Study hours must be between 0.1 and 24.0 hours.',
        },
    },
    session_type: {
        type: String,
        required: true,
        enum: Object.values(enums_1.SessionType),
    },
    attendance_pct: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: true,
        default: () => mongoose_1.default.Types.Decimal128.fromString('100.0'),
        validate: {
            validator: (v) => {
                const val = parseFloat(v.toString());
                return val >= 0.0 && val <= 100.0;
            },
            message: 'Attendance percentage must be between 0.0 and 100.0.',
        },
    },
    quiz_marks: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: false,
    },
    max_quiz_marks: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: function () {
            return this.quiz_marks !== undefined && this.quiz_marks !== null;
        },
    },
    quiz_marks_pct: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: false,
    },
    exam_marks: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: false,
    },
    max_exam_marks: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: function () {
            return this.exam_marks !== undefined && this.exam_marks !== null;
        },
    },
    exam_marks_pct: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: false,
    },
    focus_score: {
        type: Number,
        required: false,
        min: [0, 'Minimum focus score is 0.'],
        max: [100, 'Maximum focus score is 100.'],
    },
    linked_goal_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
    },
    session_date: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    versionKey: false,
    toJSON: { getters: true },
    toObject: { getters: true },
});
// Pre-validate middleware: Automatically compute normalized percentage scores for ML feature stability
exports.StudyActivitySchema.pre('validate', function (next) {
    if (this.quiz_marks && this.max_quiz_marks) {
        const q = parseFloat(this.quiz_marks.toString());
        const mq = parseFloat(this.max_quiz_marks.toString());
        if (mq > 0) {
            const pct = (q / mq) * 100.0;
            this.quiz_marks_pct = mongoose_1.default.Types.Decimal128.fromString(pct.toFixed(2));
        }
    }
    if (this.exam_marks && this.max_exam_marks) {
        const e = parseFloat(this.exam_marks.toString());
        const me = parseFloat(this.max_exam_marks.toString());
        if (me > 0) {
            const pct = (e / me) * 100.0;
            this.exam_marks_pct = mongoose_1.default.Types.Decimal128.fromString(pct.toFixed(2));
        }
    }
    next();
});
// ESR Index 1: Recent study session timeline
exports.StudyActivitySchema.index({ user_id: 1, session_date: -1 }, { name: 'idx_study_user_date' });
// ESR Index 2: Subject-filtered academic trend + Random Forest feature extraction
exports.StudyActivitySchema.index({ user_id: 1, subject: 1, session_date: -1 }, { name: 'idx_study_user_subj_date' });
// ESR Index 3: Session modality analysis
exports.StudyActivitySchema.index({ user_id: 1, session_type: 1, session_date: -1 }, { name: 'idx_study_user_type_date' });

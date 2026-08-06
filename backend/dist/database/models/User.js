"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_schema_1 = require("../schemas/user_schema");
/**
 * Mongoose ODM Model for the 'users' collection.
 * Serves as the central aggregate root for identity, embedded profile, active goals, and real-time AI twin state.
 */
exports.User = mongoose_1.default.models.User || mongoose_1.default.model('User', user_schema_1.UserSchema, 'users');

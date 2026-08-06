"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbSettings = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
function getEnvVar(key, defaultValue) {
    const val = process.env[key] || defaultValue;
    if (!val) {
        throw new Error(`[DatabaseConfig] Critical Environment Variable Missing: ${key}`);
    }
    return val;
}
function getEnvNumber(key, defaultValue) {
    const val = process.env[key];
    if (!val)
        return defaultValue;
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) {
        throw new Error(`[DatabaseConfig] Environment Variable ${key} must be a valid integer.`);
    }
    return parsed;
}
exports.dbSettings = {
    mongoUri: getEnvVar('MONGODB_URI', 'mongodb://localhost:27017'),
    dbName: getEnvVar('MONGODB_DB_NAME', 'digital_twin_ai_prod'),
    maxPoolSize: getEnvNumber('MONGODB_MAX_POOL_SIZE', 100),
    minPoolSize: getEnvNumber('MONGODB_MIN_POOL_SIZE', 10),
    socketTimeoutMs: getEnvNumber('MONGODB_SOCKET_TIMEOUT_MS', 45000),
    connectTimeoutMs: getEnvNumber('MONGODB_CONNECT_TIMEOUT_MS', 10000),
    nodeEnv: process.env.NODE_ENV || 'development',
};

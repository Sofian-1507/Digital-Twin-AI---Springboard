import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface DatabaseSettings {
  mongoUri: string;
  dbName: string;
  maxPoolSize: number;
  minPoolSize: number;
  socketTimeoutMs: number;
  connectTimeoutMs: number;
  nodeEnv: 'development' | 'staging' | 'production';
}

function getEnvVar(key: string, defaultValue?: string): string {
  const val = process.env[key] || defaultValue;
  if (!val) {
    throw new Error(`[DatabaseConfig] Critical Environment Variable Missing: ${key}`);
  }
  return val;
}

function getEnvNumber(key: string, defaultValue: number): number {
  const val = process.env[key];
  if (!val) return defaultValue;
  const parsed = parseInt(val, 10);
  if (isNaN(parsed)) {
    throw new Error(`[DatabaseConfig] Environment Variable ${key} must be a valid integer.`);
  }
  return parsed;
}

export const dbSettings: DatabaseSettings = {
  mongoUri: getEnvVar('MONGODB_URI', 'mongodb://localhost:27017'),
  dbName: getEnvVar('MONGODB_DB_NAME', 'digital_twin_ai_prod'),
  maxPoolSize: getEnvNumber('MONGODB_MAX_POOL_SIZE', 100),
  minPoolSize: getEnvNumber('MONGODB_MIN_POOL_SIZE', 10),
  socketTimeoutMs: getEnvNumber('MONGODB_SOCKET_TIMEOUT_MS', 45000),
  connectTimeoutMs: getEnvNumber('MONGODB_CONNECT_TIMEOUT_MS', 10000),
  nodeEnv: (process.env.NODE_ENV as 'development' | 'staging' | 'production') || 'development',
};

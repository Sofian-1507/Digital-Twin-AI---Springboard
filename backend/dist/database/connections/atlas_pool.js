"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.atlasPool = exports.AtlasPoolManager = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const db_settings_1 = require("../config/db_settings");
/**
 * Singleton MongoDB Atlas Connection Pool Manager.
 * Implements enterprise connection reuse, graceful shutdown hooks, and event monitoring
 * suitable for Node.js servers, AWS Lambda, and containerized microservices.
 */
class AtlasPoolManager {
    static instance;
    isConnected = false;
    constructor() {
        this.setupEventListeners();
    }
    static getInstance() {
        if (!AtlasPoolManager.instance) {
            AtlasPoolManager.instance = new AtlasPoolManager();
        }
        return AtlasPoolManager.instance;
    }
    setupEventListeners() {
        mongoose_1.default.connection.on('connected', () => {
            this.isConnected = true;
            console.log(`🟢 [AtlasPool] Connected to MongoDB Atlas cluster (DB: '${db_settings_1.dbSettings.dbName}'). Pool Size: ${db_settings_1.dbSettings.minPoolSize}-${db_settings_1.dbSettings.maxPoolSize}`);
        });
        mongoose_1.default.connection.on('error', (err) => {
            console.error('🔴 [AtlasPool] MongoDB Atlas connection error:', err);
            this.isConnected = false;
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.warn('🟡 [AtlasPool] Disconnected from MongoDB Atlas cluster.');
            this.isConnected = false;
        });
        // Graceful shutdown on process termination
        process.on('SIGINT', this.handleGracefulShutdown.bind(this, 'SIGINT'));
        process.on('SIGTERM', this.handleGracefulShutdown.bind(this, 'SIGTERM'));
    }
    /**
     * Establishes a pooled connection to MongoDB Atlas.
     * Uses Mongoose 8+ standard options with explicit pool sizing.
     */
    async connect() {
        if (this.isConnected && mongoose_1.default.connection.readyState === 1) {
            return mongoose_1.default;
        }
        try {
            console.log(`⏳ [AtlasPool] Establishing connection pool to MongoDB Atlas...`);
            const connection = await mongoose_1.default.connect(db_settings_1.dbSettings.mongoUri, {
                dbName: db_settings_1.dbSettings.dbName,
                maxPoolSize: db_settings_1.dbSettings.maxPoolSize,
                minPoolSize: db_settings_1.dbSettings.minPoolSize,
                socketTimeoutMS: db_settings_1.dbSettings.socketTimeoutMs,
                connectTimeoutMS: db_settings_1.dbSettings.connectTimeoutMs,
                autoIndex: db_settings_1.dbSettings.nodeEnv !== 'production', // Disable autoIndex in production; use sync-indexes CLI
                retryWrites: true,
                w: 'majority',
            });
            return connection;
        }
        catch (error) {
            console.error('❌ [AtlasPool] Failed to connect to MongoDB Atlas:', error);
            throw error;
        }
    }
    /**
     * Gracefully closes the MongoDB Atlas connection pool.
     */
    async disconnect() {
        if (mongoose_1.default.connection.readyState !== 0) {
            await mongoose_1.default.connection.close();
            this.isConnected = false;
            console.log('🏁 [AtlasPool] MongoDB Atlas connection pool closed cleanly.');
        }
    }
    async handleGracefulShutdown(signal) {
        console.log(`⚠️ [AtlasPool] Received ${signal}. Shutting down database connection pool...`);
        await this.disconnect();
        process.exit(0);
    }
    getStatus() {
        return {
            isConnected: this.isConnected,
            readyState: mongoose_1.default.connection.readyState,
            host: mongoose_1.default.connection.host || 'N/A',
            name: mongoose_1.default.connection.name || 'N/A',
        };
    }
}
exports.AtlasPoolManager = AtlasPoolManager;
exports.atlasPool = AtlasPoolManager.getInstance();

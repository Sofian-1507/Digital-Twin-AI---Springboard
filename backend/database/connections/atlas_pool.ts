import mongoose from 'mongoose';
import { dbSettings } from '../config/db_settings';

/**
 * Singleton MongoDB Atlas Connection Pool Manager.
 * Implements enterprise connection reuse, graceful shutdown hooks, and event monitoring
 * suitable for Node.js servers, AWS Lambda, and containerized microservices.
 */
export class AtlasPoolManager {
  private static instance: AtlasPoolManager;
  private isConnected: boolean = false;

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): AtlasPoolManager {
    if (!AtlasPoolManager.instance) {
      AtlasPoolManager.instance = new AtlasPoolManager();
    }
    return AtlasPoolManager.instance;
  }

  private setupEventListeners(): void {
    mongoose.connection.on('connected', () => {
      this.isConnected = true;
      console.log(`🟢 [AtlasPool] Connected to MongoDB Atlas cluster (DB: '${dbSettings.dbName}'). Pool Size: ${dbSettings.minPoolSize}-${dbSettings.maxPoolSize}`);
    });

    mongoose.connection.on('error', (err) => {
      console.error('🔴 [AtlasPool] MongoDB Atlas connection error:', err);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
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
  public async connect(): Promise<typeof mongoose> {
    if (this.isConnected && mongoose.connection.readyState === 1) {
      return mongoose;
    }

    try {
      console.log(`⏳ [AtlasPool] Establishing connection pool to MongoDB Atlas...`);
      const connection = await mongoose.connect(dbSettings.mongoUri, {
        dbName: dbSettings.dbName,
        maxPoolSize: dbSettings.maxPoolSize,
        minPoolSize: dbSettings.minPoolSize,
        socketTimeoutMS: dbSettings.socketTimeoutMs,
        connectTimeoutMS: dbSettings.connectTimeoutMs,
        autoIndex: dbSettings.nodeEnv !== 'production', // Disable autoIndex in production; use sync-indexes CLI
        retryWrites: true,
        w: 'majority',
      });
      return connection;
    } catch (error) {
      console.error('❌ [AtlasPool] Failed to connect to MongoDB Atlas:', error);
      throw error;
    }
  }

  /**
   * Gracefully closes the MongoDB Atlas connection pool.
   */
  public async disconnect(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      this.isConnected = false;
      console.log('🏁 [AtlasPool] MongoDB Atlas connection pool closed cleanly.');
    }
  }

  private async handleGracefulShutdown(signal: string): Promise<void> {
    console.log(`⚠️ [AtlasPool] Received ${signal}. Shutting down database connection pool...`);
    await this.disconnect();
    process.exit(0);
  }

  public getStatus(): { isConnected: boolean; readyState: number; host: string; name: string } {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host || 'N/A',
      name: mongoose.connection.name || 'N/A',
    };
  }
}

export const atlasPool = AtlasPoolManager.getInstance();

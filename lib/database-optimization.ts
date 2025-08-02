/**
 * Database Optimization and Connection Management
 * Production-ready database configuration and query optimization
 */

import { PrismaClient } from '@prisma/client';
import { logger } from './production-logger';

// Database connection configuration for production
const databaseConfig = {
  // Connection pooling settings
  datasourceUrl: process.env.DATABASE_URL,
  
  // Logging configuration
  log: process.env.NODE_ENV === 'production' 
    ? ['error', 'warn'] as const
    : ['query', 'info', 'warn', 'error'] as const,
  
  // Error formatting
  errorFormat: 'pretty' as const,
  
  // Connection timeout
  connectTimeout: 20000, // 20 seconds
  
  // Query timeout
  queryTimeout: 30000, // 30 seconds
  
  // Pool configuration (for production)
  pool: {
    timeout: 20000,
    idleTimeout: 300000, // 5 minutes
  }
};

// Global Prisma client with connection optimization
declare global {
  var __prisma: PrismaClient | undefined;
}

// Singleton pattern for database connection
export const prisma = globalThis.__prisma || new PrismaClient({
  datasourceUrl: databaseConfig.datasourceUrl,
  log: process.env.NODE_ENV === 'production' 
    ? ['error', 'warn']
    : ['query', 'info', 'warn', 'error'],
  errorFormat: databaseConfig.errorFormat,
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

// Database health check
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  details: any;
}> {
  try {
    const start = Date.now();
    
    // Test basic connection
    await prisma.$queryRaw`SELECT 1`;
    
    const connectionTime = Date.now() - start;
    
    // Test critical tables
    const [userCount, contentCount] = await Promise.all([
      prisma.user.count().catch(() => -1),
      prisma.aboutContent.count().catch(() => -1),
    ]);

    const isHealthy = connectionTime < 5000 && userCount >= 0 && contentCount >= 0;

    const details = {
      connectionTime,
      userCount,
      contentCount,
      timestamp: new Date().toISOString(),
    };

    logger.systemHealth('Database', isHealthy ? 'healthy' : 'unhealthy', details);

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      details,
    };
  } catch (error) {
    logger.error('Database health check failed', error);
    return {
      status: 'unhealthy',
      details: { error: error instanceof Error ? error.message : String(error) },
    };
  }
}

// Query optimization helpers
export class QueryOptimizer {
  // Cache for frequently accessed data
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  // Get cached data or execute query
  static async getCached<T>(
    key: string,
    queryFn: () => Promise<T>,
    ttlMs: number = 300000 // 5 minutes default
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < cached.ttl) {
      logger.debug('Cache hit', { key });
      return cached.data;
    }

    logger.debug('Cache miss, executing query', { key });
    const start = Date.now();
    
    try {
      const data = await queryFn();
      const queryTime = Date.now() - start;
      
      this.cache.set(key, { data, timestamp: now, ttl: ttlMs });
      
      logger.performance('Database query', queryTime, 1000);
      
      return data;
    } catch (error) {
      logger.error('Query execution failed', error, { key });
      throw error;
    }
  }

  // Clear cache for specific key or all
  static clearCache(key?: string) {
    if (key) {
      this.cache.delete(key);
      logger.debug('Cache cleared for key', { key });
    } else {
      this.cache.clear();
      logger.debug('All cache cleared');
    }
  }

  // Batch queries for efficiency
  static async batchQueries<T>(queries: Array<() => Promise<T>>): Promise<T[]> {
    const start = Date.now();
    
    try {
      const results = await Promise.all(queries.map(query => query()));
      const batchTime = Date.now() - start;
      
      logger.performance('Batch query', batchTime, 2000);
      
      return results;
    } catch (error) {
      logger.error('Batch query failed', error);
      throw error;
    }
  }
}

// Frequently used optimized queries
export class OptimizedQueries {
  // Get active content with caching
  static async getActiveContent(type: string) {
    return QueryOptimizer.getCached(
      `active-content-${type}`,
      async () => {
        switch (type) {
          case 'about':
            return prisma.aboutContent.findFirst();
          case 'header':
            return prisma.headerSettings.findFirst();
          case 'footer':
            return prisma.footerSettings.findFirst();
          default:
            throw new Error(`Unknown content type: ${type}`);
        }
      },
      600000 // 10 minutes cache
    );
  }

  // Get user with role efficiently
  static async getUserWithRole(userId: string) {
    return QueryOptimizer.getCached(
      `user-${userId}`,
      async () => {
        return prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            // Don't select password for security
          }
        });
      },
      60000 // 1 minute cache for user data
    );
  }
}

// Database cleanup and maintenance
export class DatabaseMaintenance {
  // Clean up expired OTPs
  static async cleanupExpiredOTPs() {
    try {
      const result = await prisma.oTP.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      });

      logger.info('Cleaned up expired OTPs', { count: result.count });
      return result.count;
    } catch (error) {
      logger.error('Failed to cleanup expired OTPs', error);
      return 0;
    }
  }

  // Clean up old contact submissions (older than 90 days)
  static async cleanupOldContactSubmissions() {
    try {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      
      const result = await prisma.contactSubmission.deleteMany({
        where: {
          createdAt: {
            lt: ninetyDaysAgo
          }
        }
      });

      logger.info('Cleaned up old contact submissions', { count: result.count });
      return result.count;
    } catch (error) {
      logger.error('Failed to cleanup old contact submissions', error);
      return 0;
    }
  }

  // Analyze database performance
  static async analyzePerformance() {
    try {
      const start = Date.now();
      
      // Count records in major tables
      const [
        userCount,
        contentCount,
        contactSubmissions
      ] = await QueryOptimizer.batchQueries([
        () => prisma.user.count(),
        () => prisma.aboutContent.count(),
        () => prisma.contactSubmission.count()
      ]);

      const analysisTime = Date.now() - start;

      const performance = {
        analysisTime,
        tableStats: {
          users: userCount,
          content: contentCount,
          contactSubmissions
        },
        recommendations: [] as string[]
      };

      // Add recommendations based on data
      if (contactSubmissions > 10000) {
        performance.recommendations.push('Consider archiving old contact submissions');
      }
      
      if (analysisTime > 5000) {
        performance.recommendations.push('Database queries are slow, consider optimization');
      }

      logger.info('Database performance analysis completed', performance);
      return performance;
    } catch (error) {
      logger.error('Database performance analysis failed', error);
      throw error;
    }
  }
}

// Graceful shutdown
export async function gracefulDatabaseShutdown() {
  try {
    logger.info('Closing database connections...');
    await prisma.$disconnect();
    logger.info('Database connections closed successfully');
  } catch (error) {
    logger.error('Error during database shutdown', error);
  }
}

// Initialize database optimizations
export function initializeDatabaseOptimizations() {
  // Setup periodic cleanup
  if (process.env.NODE_ENV === 'production') {
    // Clean up expired OTPs every hour
    setInterval(() => {
      DatabaseMaintenance.cleanupExpiredOTPs();
    }, 60 * 60 * 1000);

    // Clean up old contact submissions weekly
    setInterval(() => {
      DatabaseMaintenance.cleanupOldContactSubmissions();
    }, 7 * 24 * 60 * 60 * 1000);

    // Performance analysis weekly
    setInterval(() => {
      DatabaseMaintenance.analyzePerformance();
    }, 7 * 24 * 60 * 60 * 1000);
  }

  logger.info('Database optimizations initialized');
}

export default prisma;
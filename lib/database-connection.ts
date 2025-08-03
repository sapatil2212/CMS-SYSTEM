/**
 * Database Connection Management
 * Optimized for serverless environments to prevent connection pool exhaustion
 */

import { PrismaClient } from '@prisma/client'
import { logger } from './production-logger'

// Connection pool configuration
const CONNECTION_CONFIG = {
  // Serverless-optimized pool settings
  pool: {
    min: 0,
    max: 1, // Single connection per serverless function
    acquireTimeoutMillis: 10000,
    createTimeoutMillis: 10000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
  },
  
  // Query timeout
  queryTimeout: 30000,
  
  // Connection timeout
  connectTimeout: 20000,
}

// Global Prisma client instance
let prismaClient: PrismaClient | null = null

// Connection state tracking
let isConnecting = false
let connectionPromise: Promise<PrismaClient> | null = null

/**
 * Get or create Prisma client with connection pooling
 */
export async function getPrismaClient(): Promise<PrismaClient> {
  // Return existing client if available
  if (prismaClient) {
    return prismaClient
  }

  // Prevent multiple simultaneous connection attempts
  if (isConnecting && connectionPromise) {
    return connectionPromise
  }

  isConnecting = true
  connectionPromise = createPrismaClient()
  
  try {
    prismaClient = await connectionPromise
    logger.info('Database connection established successfully')
    return prismaClient
  } catch (error) {
    logger.error('Failed to establish database connection', error)
    isConnecting = false
    connectionPromise = null
    throw error
  } finally {
    isConnecting = false
  }
}

/**
 * Create a new Prisma client with optimized configuration
 */
async function createPrismaClient(): Promise<PrismaClient> {
  const client = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === 'production' 
      ? ['error'] 
      : ['query', 'error', 'warn'],
    errorFormat: 'pretty',
  })

  // Test the connection
  try {
    await client.$connect()
    logger.info('Database connection test successful')
  } catch (error) {
    logger.error('Database connection test failed', error)
    await client.$disconnect()
    throw error
  }

  return client
}

/**
 * Gracefully close database connection
 */
export async function closeDatabaseConnection(): Promise<void> {
  if (prismaClient) {
    try {
      await prismaClient.$disconnect()
      logger.info('Database connection closed gracefully')
    } catch (error) {
      logger.error('Error closing database connection', error)
    } finally {
      prismaClient = null
      connectionPromise = null
    }
  }
}

/**
 * Execute database operation with automatic connection management
 */
export async function withDatabaseConnection<T>(
  operation: (client: PrismaClient) => Promise<T>
): Promise<T> {
  const client = await getPrismaClient()
  
  try {
    return await operation(client)
  } catch (error) {
    logger.error('Database operation failed', error)
    
    // If it's a connection error, try to reconnect
    if (error instanceof Error && 
        (error.message.includes('connection') || 
         error.message.includes('timeout') ||
         error.message.includes('Too many connections'))) {
      
      logger.info('Attempting to reconnect to database...')
      await closeDatabaseConnection()
      
      // Retry once with fresh connection
      const newClient = await getPrismaClient()
      return await operation(newClient)
    }
    
    throw error
  }
}

/**
 * Health check for database connection
 */
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy'
  details: any
}> {
  try {
    const client = await getPrismaClient()
    const start = Date.now()
    
    // Test basic connection
    await client.$queryRaw`SELECT 1`
    
    const connectionTime = Date.now() - start
    
    // Test critical tables
    const [userCount, contentCount] = await Promise.all([
      client.user.count().catch(() => -1),
      client.aboutContent.count().catch(() => -1),
    ])

    const isHealthy = connectionTime < 5000 && userCount >= 0 && contentCount >= 0

    const details = {
      connectionTime,
      userCount,
      contentCount,
      timestamp: new Date().toISOString(),
    }

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      details,
    }
  } catch (error) {
    logger.error('Database health check failed', error)
    return {
      status: 'unhealthy',
      details: { error: error instanceof Error ? error.message : String(error) },
    }
  }
}

// Register cleanup handlers for serverless environments
if (typeof window === 'undefined') {
  const gracefulShutdown = async () => {
    await closeDatabaseConnection()
  }

  process.on('beforeExit', gracefulShutdown)
  process.on('SIGTERM', gracefulShutdown)
  process.on('SIGINT', gracefulShutdown)
  
  process.on('uncaughtException', async (error) => {
    logger.error('Uncaught Exception:', error)
    await gracefulShutdown()
    process.exit(1)
  })
  
  process.on('unhandledRejection', async (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
    await gracefulShutdown()
    process.exit(1)
  })
} 
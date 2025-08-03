import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Enhanced Prisma client configuration for serverless environments
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Optimized logging for production
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
  
  // Connection pool configuration for serverless
  // These settings help prevent "Too many connections" errors
  __internal: {
    engine: {
      // Reduce connection pool size for serverless
      connectionLimit: 1,
      // Shorter timeouts for serverless functions
      pool: {
        min: 0,
        max: 1,
        acquireTimeoutMillis: 10000,
        createTimeoutMillis: 10000,
        destroyTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 100,
      },
    },
  },
})

// Enhanced connection cleanup for serverless environments
if (typeof window === 'undefined') {
  // Handle graceful shutdown
  const gracefulShutdown = async () => {
    try {
      await prisma.$disconnect()
      console.log('Database connection closed gracefully')
    } catch (error) {
      console.error('Error during database shutdown:', error)
    }
  }

  // Register shutdown handlers
  process.on('beforeExit', gracefulShutdown)
  process.on('SIGTERM', gracefulShutdown)
  process.on('SIGINT', gracefulShutdown)
  
  // Handle uncaught exceptions
  process.on('uncaughtException', async (error) => {
    console.error('Uncaught Exception:', error)
    await gracefulShutdown()
    process.exit(1)
  })
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason)
    await gracefulShutdown()
    process.exit(1)
  })
}

// Only set global in development to prevent memory leaks
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
} 
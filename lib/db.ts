import { logger } from '@/lib/logger';
import {  PrismaClient  } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Enhanced connection configuration for TiDB Cloud
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  // Add connection pooling and timeout configurations
  __internal: {
    engine: {
      connectTimeout: 60000, // 60 seconds
      queryTimeout: 30000,   // 30 seconds
    },
  },
})

// Add connection cleanup on process termination
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
  
  // Handle SIGTERM for serverless environments
  process.on('SIGTERM', async () => {
    await prisma.$disconnect()
  })
  
  // Handle SIGINT for graceful shutdown
  process.on('SIGINT', async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
}

// Enhanced error handling for connection issues
prisma.$use(async (params, next) => {
  let retryCount = 0
  const maxRetries = 3
  
  while (retryCount < maxRetries) {
    try {
      return await next(params)
    } catch (error: any) {
      // Handle connection closed errors and other connection issues
      if (error?.code === 'P1017' || 
          error?.message?.includes('Server has closed the connection') ||
          error?.message?.includes('Connection terminated') ||
          error?.code === 'P1001') {
        
        retryCount++
        logger.log(`Database connection error (attempt ${retryCount}/${maxRetries}): ${error.message}`)
        
        if (retryCount < maxRetries) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000))
          
          // Force disconnect and reconnect
          try {
            await prisma.$disconnect()
          } catch (disconnectError) {
            // Ignore disconnect errors
          }
          
          // The next query will automatically reconnect
          continue
        }
      }
      
      // If it's not a connection error or we've exhausted retries, throw the error
      throw error
    }
  }
  
  throw new Error('Max retry attempts exceeded for database connection')
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 
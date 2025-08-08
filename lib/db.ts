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
  // Add connection pooling configuration for serverless
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
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

// Add error handling for connection issues
prisma.$use(async (params, next) => {
  try {
    return await next(params)
  } catch (error: any) {
    // Handle connection closed errors
    if (error?.code === 'P1017' || error?.message?.includes('Server has closed the connection')) {
      logger.log('Database connection closed, attempting to reconnect...')
      // Force disconnect and reconnect
      await prisma.$disconnect()
      // The next query will automatically reconnect
    }
    throw error
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 
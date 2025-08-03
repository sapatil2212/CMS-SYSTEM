import { PrismaClient } from '@prisma/client'

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

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 
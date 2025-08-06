import { logger } from '@/lib/logger';
import {  PrismaClient  } from '@prisma/client';

const prisma = new PrismaClient()

const capabilities = [
  {
    icon: 'CheckCircle',
    title: 'Advanced Plating Systems',
    description: 'Equipped with state-of-the-art plating and inspection systems for superior results.',
    order: 1,
    isActive: true
  },
  {
    icon: 'Users',
    title: 'Expert Team',
    description: 'Staffed by highly skilled professionals with years of industry experience.',
    order: 2,
    isActive: true
  },
  {
    icon: 'Award',
    title: 'Scalable Solutions',
    description: 'Capable of handling both prototypes and high-volume production requirements.',
    order: 3,
    isActive: true
  },
  {
    icon: 'Clock',
    title: 'On-Time Delivery',
    description: 'Committed to precision results with reliable, on-time delivery every time.',
    order: 4,
    isActive: true
  },
  {
    icon: 'Shield',
    title: 'Safety & Compliance',
    description: 'Focused on safety, compliance, and environmentally conscious practices.',
    order: 5,
    isActive: true
  },
  {
    icon: 'Clock',
    title: 'Timely Delivery',
    description: 'On-time project delivery powered by streamlined processes and smart scheduling systems.',
    order: 6,
    isActive: true
  }
]

async function seedAboutCapabilities() {
  try {
    logger.log('🌱 Seeding About capabilities...')

    // Clear existing capabilities
    await prisma.aboutCapability.deleteMany({})

    // Create new capabilities
    for (const capability of capabilities) {
      await prisma.aboutCapability.create({
        data: capability
      })
    }

    logger.log('✅ About capabilities seeded successfully!')
  } catch (error) {
    logger.error('❌ Error seeding About capabilities:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedAboutCapabilities() 
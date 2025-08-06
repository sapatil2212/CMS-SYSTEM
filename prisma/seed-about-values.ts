import { logger } from '@/lib/logger';
import {  PrismaClient  } from '@prisma/client';

const prisma = new PrismaClient()

const values = [
  {
    icon: 'Crown',
    title: 'Quality',
    description: 'We deliver high-performance plating solutions that meet the rigorous demands of modern industries with uncompromising quality standards.',
    order: 1,
    isActive: true
  },
  {
    icon: 'Shield',
    title: 'Reliability',
    description: 'Our consistent, dependable processes ensure exceptional finishes and reliable results for every project, every time.',
    order: 2,
    isActive: true
  },
  {
    icon: 'Zap',
    title: 'Innovation',
    description: 'We combine advanced technology with cutting-edge plating and inspection systems to stay ahead in surface treatment solutions.',
    order: 3,
    isActive: true
  },
  {
    icon: 'Cog',
    title: 'Precision',
    description: 'Precision in every layer and commitment in every process - from prototypes to high-volume production runs.',
    order: 4,
    isActive: true
  }
]

async function seedAboutValues() {
  try {
    logger.log('🌱 Seeding About values...')

    // Clear existing values
    await prisma.aboutValue.deleteMany({})

    // Create new values
    for (const value of values) {
      await prisma.aboutValue.create({
        data: value
      })
    }

    logger.log('✅ About values seeded successfully!')
  } catch (error) {
    logger.error('❌ Error seeding About values:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedAboutValues() 
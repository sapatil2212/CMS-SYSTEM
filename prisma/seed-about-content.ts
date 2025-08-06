import { logger } from '@/lib/logger';
import {  PrismaClient  } from '@prisma/client';

const prisma = new PrismaClient()

async function seedAboutContent() {
  try {
    logger.log('🌱 Seeding About content...')

    // Clear existing content
    await prisma.aboutContent.deleteMany({})

    // Create About content
    await prisma.aboutContent.create({
      data: {
        title: 'About Alkalyne',
        subtitle: 'Precision in Every Layer. Commitment in Every Process.',
        description: 'Alkalyne is a trusted name in the field of metal finishing and surface treatment, known for delivering high-performance plating solutions that meet the rigorous demands of modern industries.',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      }
    })

    logger.log('✅ About content seeded successfully!')
  } catch (error) {
    logger.error('❌ Error seeding About content:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedAboutContent() 
import { logger } from '@/lib/logger';
import {  PrismaClient  } from '@prisma/client';

const prisma = new PrismaClient()

async function seedWhyChooseUsContent() {
  try {
    logger.log('🌱 Seeding WhyChooseUs content...')

    // Clear existing content
    await prisma.whyChooseUsContent.deleteMany({})

    // Create WhyChooseUs content
    await prisma.whyChooseUsContent.create({
      data: {
        title: 'Why Choose Alkalyne Surface Technologies?',
        description: 'We understand the challenges of finding a reliable, technically sound plating partner. At Alkalyne, we are committed to delivering precision, performance, and peace of mind — every time.',
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&h=800&fit=crop',
        rating: 5,
        ratingText: 'Decades of Experience',
        technologyText: 'Advanced Tech'
      }
    })

    logger.log('✅ WhyChooseUs content seeded successfully!')
  } catch (error) {
    logger.error('❌ Error seeding WhyChooseUs content:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedWhyChooseUsContent() 
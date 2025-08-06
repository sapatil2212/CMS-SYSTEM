import { logger } from '@/lib/logger';
import {  PrismaClient  } from '@prisma/client';

const prisma = new PrismaClient()

async function seedTestimonialContent() {
  try {
    logger.log('🌱 Seeding testimonial content...')

    // Clear existing content
    await prisma.testimonialContent.deleteMany({})

    // Create testimonial content
    await prisma.testimonialContent.create({
      data: {
        title: 'Trusted by Industry Leaders',
        subtitle: 'CLIENT TESTIMONIALS',
        description: 'What leading manufacturers say about our metal finishing services',
        averageRating: '4.9',
        totalClients: '200+',
        qualityCompliance: '100%'
      }
    })

    logger.log('✅ Testimonial content seeded successfully!')
  } catch (error) {
    logger.error('❌ Error seeding testimonial content:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedTestimonialContent() 
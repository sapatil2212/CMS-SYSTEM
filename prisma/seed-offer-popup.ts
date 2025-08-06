import { logger } from '@/lib/logger';
import {  PrismaClient  } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {
  logger.log('🌱 Seeding offer popup...')

  // Create a sample offer popup
  const offerPopup = await prisma.offerPopup.create({
    data: {
      title: 'Special Offer - 20% Off!',
      description: 'Get 20% off on all our plating services this month. Limited time offer for new customers.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
      ctaText: 'Get Offer Now',
      ctaLink: '/contact',
      isActive: true
    }
  })

  logger.log('✅ Offer popup seeded successfully:', offerPopup)
}

main()
  .catch((e) => {
    logger.error('❌ Error seeding offer popup:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
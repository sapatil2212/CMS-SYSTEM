import { logger } from '@/lib/logger';
import {  PrismaClient  } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {
  logger.log('🌱 Seeding header settings...')

  // Check if header settings already exist
  const existingSettings = await prisma.headerSettings.findFirst()

  if (!existingSettings) {
    // Create default header settings
    const headerSettings = await prisma.headerSettings.create({
      data: {
        logoUrl: '/logo/logo.png',
        logoAlt: 'CMS System Logo',
        phoneNumber: '+91 93731 02887',
        email: 'info@example.com'
      }
    })

    logger.log('✅ Header settings created:', headerSettings)
  } else {
    logger.log('ℹ️ Header settings already exist, skipping...')
  }

  logger.log('✅ Header settings seeding completed!')
}

main()
  .catch((e) => {
    logger.error('❌ Error seeding header settings:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
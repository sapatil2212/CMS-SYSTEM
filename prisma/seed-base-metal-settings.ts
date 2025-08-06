import { logger } from '@/lib/logger';
import {  PrismaClient  } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {
  logger.log('🌱 Seeding base metal settings...')

  const baseMetals = [
    { slug: 'aluminium', name: 'Aluminium' },
    { slug: 'copper', name: 'Copper' },
    { slug: 'brass', name: 'Brass' },
    { slug: 'stainless-steel', name: 'Stainless Steel' },
    { slug: 'carbon-steel', name: 'Carbon Steel' }
  ]

  for (const metal of baseMetals) {
    await prisma.baseMetalSettings.upsert({
      where: { slug: metal.slug },
      update: { isActive: true },
      create: {
        slug: metal.slug,
        name: metal.name,
        isActive: true
      }
    })
  }

  logger.log('✅ Base metal settings seeded successfully!')
}

main()
  .catch((e) => {
    logger.error('❌ Error seeding base metal settings:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
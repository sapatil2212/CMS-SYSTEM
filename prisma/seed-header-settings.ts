import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding header settings...')

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

    console.log('✅ Header settings created:', headerSettings)
  } else {
    console.log('ℹ️ Header settings already exist, skipping...')
  }

  console.log('✅ Header settings seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding header settings:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
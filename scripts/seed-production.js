const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting production database seed...')

  try {
    // Import and run the main seed function
    const { main: seedMain } = require('../prisma/seed.ts')
    await seedMain()
    
    console.log('✅ Production seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error during production seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding production database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
const { PrismaClient } = require('@prisma/client')

async function diagnoseDatabase() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Checking database connection...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Check if critical tables exist by trying to query them
    const tests = [
      { name: 'User', query: async () => await prisma.user.count() },
      { name: 'AboutContent', query: async () => await prisma.aboutContent.count() },
      { name: 'AboutValue', query: async () => await prisma.aboutValue.count() },
      { name: 'CopperPlatingContent', query: async () => await prisma.copperPlatingContent.count() },
      { name: 'ZincPlatingContent', query: async () => await prisma.zincPlatingContent.count() },
      { name: 'BrightTinPlatingContent', query: async () => await prisma.brightTinPlatingContent.count() },
      { name: 'ZincFlakeCoatingContent', query: async () => await prisma.zincFlakeCoatingContent.count() },
      { name: 'HeaderSettings', query: async () => await prisma.headerSettings.count() },
    ]
    
    console.log('\n📊 Checking table existence and data:')
    
    for (const test of tests) {
      try {
        const count = await test.query()
        console.log(`✅ ${test.name}: ${count} records`)
      } catch (error) {
        console.log(`❌ ${test.name}: Error - ${error.message}`)
      }
    }
    
    // Check for any process content that has data
    console.log('\n🔄 Checking process content tables:')
    const processModels = [
      'copperPlatingContent',
      'silverPlatingContent', 
      'goldPlatingContent',
      'busbarPlatingContent',
      'zincPlatingContent',
      'nickelPlatingContent',
      'electrolessNickelPlatingContent',
      'brightTinPlatingContent',
      'dullTinPlatingContent',
      'rackBarrelPlatingContent',
      'zincFlakeCoatingContent',
      'molykoteContent'
    ]
    
    for (const model of processModels) {
      try {
        const count = await prisma[model].count()
        console.log(`${count > 0 ? '✅' : '⚠️'} ${model}: ${count} records`)
      } catch (error) {
        console.log(`❌ ${model}: ${error.message}`)
      }
    }
    
  } catch (error) {
    console.error('❌ Database diagnosis failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

diagnoseDatabase()
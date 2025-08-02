const { PrismaClient } = require('@prisma/client')

async function testDatabaseConnection() {
  const prisma = new PrismaClient()
  
  console.log('🔍 Testing Database Connection...')
  console.log('🌍 Environment:', process.env.NODE_ENV || 'development')
  console.log('📊 Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')
  console.log('')

  try {
    // Test basic connection
    console.log('1. Testing basic database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful')

    // Test HeaderSettings table
    console.log('\n2. Testing HeaderSettings table...')
    const headerSettings = await prisma.headerSettings.findFirst()
    console.log('📋 Current header settings:', headerSettings)

    if (!headerSettings) {
      console.log('📝 Creating default header settings...')
      const newSettings = await prisma.headerSettings.create({
        data: {
          logoUrl: '/logo/logo.svg',
          logoAlt: 'CMS System Logo',
          phoneNumber: '+91 93731 02887',
          email: 'info@example.com'
        }
      })
      console.log('✅ Created default settings:', newSettings)
    }

    // Test update operation
    console.log('\n3. Testing update operation...')
    const updatedSettings = await prisma.headerSettings.update({
      where: { id: headerSettings?.id || (await prisma.headerSettings.findFirst()).id },
      data: {
        phoneNumber: '+91 98765 43210',
        email: 'test@example.com'
      }
    })
    console.log('✅ Update operation successful:', updatedSettings)

    // Test all tables
    console.log('\n4. Testing all relevant tables...')
    const tables = [
      'headerSettings',
      'headerMenuItem',
      'footerSettings',
      'user',
      'contactSubmission'
    ]

    for (const table of tables) {
      try {
        const count = await prisma[table].count()
        console.log(`✅ ${table}: ${count} records`)
      } catch (error) {
        console.log(`❌ ${table}: Error - ${error.message}`)
      }
    }

  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    console.error('Stack trace:', error.stack)
  } finally {
    await prisma.$disconnect()
    console.log('\n🔌 Database connection closed')
  }
}

// Run the test
testDatabaseConnection() 
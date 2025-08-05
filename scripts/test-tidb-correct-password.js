const { PrismaClient } = require('@prisma/client')

console.log('🔧 Testing TiDB Connection with Correct Password...')

const connectionStrings = [
  // Option 1: Basic SSL
  'mysql://3C5Z7raHFNZYPVu.root:pk26AXA91k503jjk@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db?ssl=true',
  
  // Option 2: SSL with mode
  'mysql://3C5Z7raHFNZYPVu.root:pk26AXA91k503jjk@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db?ssl=true&sslmode=require',
  
  // Option 3: SSL with verify
  'mysql://3C5Z7raHFNZYPVu.root:pk26AXA91k503jjk@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db?ssl=true&sslverify=true',
  
  // Option 4: SSL with rejectUnauthorized=false
  'mysql://3C5Z7raHFNZYPVu.root:pk26AXA91k503jjk@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db?ssl=true&rejectUnauthorized=false',
  
  // Option 5: No SSL (for testing)
  'mysql://3C5Z7raHFNZYPVu.root:pk26AXA91k503jjk@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db'
]

async function testConnection(connectionString, option) {
  console.log(`\n🧪 Testing Option ${option}:`)
  console.log(`   ${connectionString.substring(0, 80)}...`)
  
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: connectionString,
        },
      },
    })
    
    // Test connection
    await prisma.$connect()
    console.log(`   ✅ SUCCESS - Option ${option} works!`)
    await prisma.$disconnect()
    return true
  } catch (error) {
    console.log(`   ❌ FAILED - Option ${option}: ${error.message}`)
    return false
  }
}

async function runTests() {
  console.log('📋 Testing different connection string formats with correct password...')
  
  for (let i = 0; i < connectionStrings.length; i++) {
    const success = await testConnection(connectionStrings[i], i + 1)
    if (success) {
      console.log(`\n🎉 SUCCESS! Use Option ${i + 1} for your DATABASE_URL`)
      console.log(`   DATABASE_URL="${connectionStrings[i]}"`)
      break
    }
  }
  
  console.log('\n📝 If all options fail, try:')
  console.log('1. Check TiDB Cloud network access settings')
  console.log('2. Contact TiDB Cloud support')
}

runTests().catch(console.error) 
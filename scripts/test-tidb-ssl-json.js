const { PrismaClient } = require('@prisma/client')

console.log('🔧 Testing TiDB Connection with SSL JSON Configuration...')

const connectionStrings = [
  // Option 1: SSL with rejectUnauthorized:true
  'mysql://3C5Z7raHFNZYPVu.root:pk26AXA91k503jjk@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db?ssl={"rejectUnauthorized":true}',
  
  // Option 2: SSL with rejectUnauthorized:false
  'mysql://3C5Z7raHFNZYPVu.root:pk26AXA91k503jjk@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db?ssl={"rejectUnauthorized":false}',
  
  // Option 3: SSL with ca parameter
  'mysql://3C5Z7raHFNZYPVu.root:pk26AXA91k503jjk@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db?ssl={"ca":"certs/tidb-ca.pem"}',
  
  // Option 4: SSL with both ca and rejectUnauthorized
  'mysql://3C5Z7raHFNZYPVu.root:pk26AXA91k503jjk@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db?ssl={"ca":"certs/tidb-ca.pem","rejectUnauthorized":false}',
  
  // Option 5: Basic SSL
  'mysql://3C5Z7raHFNZYPVu.root:pk26AXA91k503jjk@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db?ssl=true'
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
  console.log('📋 Testing different SSL JSON configurations...')
  
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
  console.log('2. Try using Railway temporarily to create tables')
  console.log('3. Contact TiDB Cloud support')
}

runTests().catch(console.error) 
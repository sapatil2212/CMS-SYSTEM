const { PrismaClient } = require('@prisma/client')

console.log('🔧 Testing TiDB Connection with sslaccept=strict...')

const connectionStrings = [
  // Option 1: sslaccept=strict
  'mysql://3C5Z7raHFNZYPVu.root:hMrrBsxuXoYJbK7G@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db?sslaccept=strict',
  
  // Option 2: sslaccept=strict with ssl=true
  'mysql://3C5Z7raHFNZYPVu.root:hMrrBsxuXoYJbK7G@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db?ssl=true&sslaccept=strict',
  
  // Option 3: sslaccept=strict with sslmode=require
  'mysql://3C5Z7raHFNZYPVu.root:hMrrBsxuXoYJbK7G@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db?sslaccept=strict&sslmode=require',
  
  // Option 4: sslaccept=strict with CA certificate
  'mysql://3C5Z7raHFNZYPVu.root:hMrrBsxuXoYJbK7G@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db?sslaccept=strict&sslca=certs/tidb-ca.pem',
  
  // Option 5: sslaccept=strict with rejectUnauthorized=false
  'mysql://3C5Z7raHFNZYPVu.root:hMrrBsxuXoYJbK7G@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db?sslaccept=strict&rejectUnauthorized=false'
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
  console.log('📋 Testing different sslaccept configurations...')
  
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
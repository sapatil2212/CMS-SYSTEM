const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

console.log('🔧 Testing TiDB Connection with Environment Variables...')

// Set SSL environment variables
process.env.MYSQL_SSL_CA = path.join(__dirname, '..', 'certs', 'tidb-ca.pem')
process.env.MYSQL_SSL_MODE = 'VERIFY_IDENTITY'

const connectionStrings = [
  // Option 1: Basic SSL with environment variables
  'mysql://3C5Z7raHFNZYPVu.root:hMrrBsxuXoYJbK7G@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db?ssl=true',
  
  // Option 2: SSL with mode
  'mysql://3C5Z7raHFNZYPVu.root:hMrrBsxuXoYJbK7G@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db?ssl=true&sslmode=require',
  
  // Option 3: SSL with verify
  'mysql://3C5Z7raHFNZYPVu.root:hMrrBsxuXoYJbK7G@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db?ssl=true&sslverify=true',
  
  // Option 4: SSL with rejectUnauthorized=false
  'mysql://3C5Z7raHFNZYPVu.root:hMrrBsxuXoYJbK7G@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db?ssl=true&rejectUnauthorized=false'
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
  console.log('📋 Testing different connection string formats with SSL environment variables...')
  console.log('SSL CA Path:', process.env.MYSQL_SSL_CA)
  console.log('SSL Mode:', process.env.MYSQL_SSL_MODE)
  
  for (let i = 0; i < connectionStrings.length; i++) {
    const success = await testConnection(connectionStrings[i], i + 1)
    if (success) {
      console.log(`\n🎉 SUCCESS! Use Option ${i + 1} for your DATABASE_URL`)
      console.log(`   DATABASE_URL="${connectionStrings[i]}"`)
      break
    }
  }
  
  console.log('\n📝 If all options fail, try:')
  console.log('1. Check if the password is correct')
  console.log('2. Try without SSL (temporarily)')
  console.log('3. Contact TiDB Cloud support')
}

runTests().catch(console.error) 
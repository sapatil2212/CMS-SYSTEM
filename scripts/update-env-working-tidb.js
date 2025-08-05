const fs = require('fs')
const path = require('path')

console.log('🔧 Updating .env file with working TiDB connection...')

// Read current .env file
const envPath = path.join(__dirname, '..', '.env')
let envContent = fs.readFileSync(envPath, 'utf8')

// Working TiDB connection string
const workingDatabaseUrl = 'DATABASE_URL=mysql://3C5Z7raHFNZYPVu.root:pk26AXA91k503jjk@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db?sslaccept=strict'

// Replace the DATABASE_URL line
envContent = envContent.replace(/DATABASE_URL=.*/, workingDatabaseUrl)

// Write back to .env file
fs.writeFileSync(envPath, envContent)

console.log('✅ Updated .env file with working TiDB connection')
console.log('📝 New DATABASE_URL:', workingDatabaseUrl)
console.log('')
console.log('🔄 Now run: npm run db:push')
console.log('🔄 Then run: npm run db:seed')
console.log('')
console.log('📝 Don\'t forget to update Vercel environment variables with the same DATABASE_URL') 
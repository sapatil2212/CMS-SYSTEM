const fs = require('fs')
const path = require('path')

console.log('🔧 Updating .env file with correct password...')

// Read current .env file
const envPath = path.join(__dirname, '..', '.env')
let envContent = fs.readFileSync(envPath, 'utf8')

// Update DATABASE_URL with correct password
const newDatabaseUrl = 'DATABASE_URL=mysql://3C5Z7raHFNZYPVu.root:pk26AXA91k503jjk@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db?ssl=true'

// Replace the DATABASE_URL line
envContent = envContent.replace(/DATABASE_URL=.*/, newDatabaseUrl)

// Write back to .env file
fs.writeFileSync(envPath, envContent)

console.log('✅ Updated .env file with correct password')
console.log('📝 New DATABASE_URL:', newDatabaseUrl)
console.log('')
console.log('🔄 Now run: npm run db:push') 
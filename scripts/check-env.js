require('dotenv').config()

console.log('🔍 Environment Variables Check')
console.log('==============================')

const envVars = [
  'NODE_ENV',
  'DATABASE_URL',
  'JWT_SECRET',
  'NEXTAUTH_URL',
  'CLOUDINARY_CLOUD_NAME',
  'EMAIL_USERNAME',
  'MAX_FILE_SIZE'
]

envVars.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    if (varName === 'DATABASE_URL') {
      console.log(`✅ ${varName}: ${value.substring(0, 50)}...`)
    } else {
      console.log(`✅ ${varName}: ${value}`)
    }
  } else {
    console.log(`❌ ${varName}: NOT SET`)
  }
})

console.log('\n📝 Note: If DATABASE_URL shows Railway URL, check your local .env file')
console.log('📝 For Vercel deployment, check environment variables in Vercel dashboard') 
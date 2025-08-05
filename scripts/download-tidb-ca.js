const https = require('https')
const fs = require('fs')
const path = require('path')

console.log('🔧 Downloading TiDB Cloud CA Certificate...')

// TiDB Cloud CA certificate URL
const caUrl = 'https://docs.pingcap.com/tidbcloud/secure-connections-to-serverless-tier-clusters'

// Create certs directory if it doesn't exist
const certsDir = path.join(__dirname, '..', 'certs')
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true })
}

console.log('📝 Please download the CA certificate manually:')
console.log('1. Go to: https://docs.pingcap.com/tidbcloud/secure-connections-to-serverless-tier-clusters')
console.log('2. Download the CA certificate')
console.log('3. Save it as: certs/tidb-ca.pem')
console.log('')
console.log('📋 Alternative connection string format:')
console.log('DATABASE_URL=mysql://3C5Z7raHFNZYPVu.root:YOUR_PASSWORD@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/alkalyne_db?ssl=true&sslmode=require&sslca=certs/tidb-ca.pem')
console.log('')
console.log('⚠️  Note: Replace YOUR_PASSWORD with your actual TiDB password') 
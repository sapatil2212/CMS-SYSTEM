const fs = require('fs')
const path = require('path')

// Update the header route file with a new timestamp to force Vercel to redeploy
function updateHeaderRoute() {
  const routePath = path.join(__dirname, '../app/api/content/header/route.ts')
  
  if (fs.existsSync(routePath)) {
    let content = fs.readFileSync(routePath, 'utf8')
    
    // Update the timestamp comment
    const timestamp = new Date().toISOString()
    content = content.replace(
      /\/\/ Updated: .* - Fixed PUT method and added POST fallback/,
      `// Updated: ${timestamp} - Fixed PUT method and added POST fallback`
    )
    
    fs.writeFileSync(routePath, content)
    console.log('✅ Updated header route with new timestamp:', timestamp)
  } else {
    console.log('❌ Header route file not found')
  }
}

// Update package.json version to force deployment
function updatePackageVersion() {
  const packagePath = path.join(__dirname, '../package.json')
  
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    const currentVersion = packageJson.version
    const [major, minor, patch] = currentVersion.split('.').map(Number)
    
    // Increment patch version
    packageJson.version = `${major}.${minor}.${patch + 1}`
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
    console.log('✅ Updated package.json version from', currentVersion, 'to', packageJson.version)
  } else {
    console.log('❌ package.json not found')
  }
}

console.log('🚀 Force deploying header route fix...')
updateHeaderRoute()
updatePackageVersion()
console.log('✅ Ready to deploy! Run: git add . && git commit -m "Fix header route PUT method" && git push') 
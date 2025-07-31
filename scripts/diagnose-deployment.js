#!/usr/bin/env node

/**
 * Deployment Diagnostic Script
 * Run this script to check for common deployment issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 CMS Deployment Diagnostic Tool\n');

// Check environment variables
function checkEnvVars() {
  console.log('📋 Checking Environment Variables...');
  
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];

  const missingVars = [];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length === 0) {
    console.log('✅ All required environment variables are set\n');
  } else {
    console.log('❌ Missing environment variables:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\n');
  }

  return missingVars.length === 0;
}

// Check file structure
function checkFileStructure() {
  console.log('📁 Checking File Structure...');
  
  const requiredFiles = [
    'app/api/admin/upload/route.ts',
    'app/api/content/[process]/route.ts',
    'lib/cloudinary.ts',
    'components/admin/ImageUpload.tsx',
    'vercel.json',
    'next.config.js'
  ];

  const missingFiles = [];
  
  requiredFiles.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
      missingFiles.push(filePath);
    }
  });

  if (missingFiles.length === 0) {
    console.log('✅ All required files are present\n');
  } else {
    console.log('❌ Missing files:');
    missingFiles.forEach(filePath => {
      console.log(`   - ${filePath}`);
    });
    console.log('\n');
  }

  return missingFiles.length === 0;
}

// Check Cloudinary configuration
function checkCloudinaryConfig() {
  console.log('☁️ Checking Cloudinary Configuration...');
  
  try {
    const cloudinaryPath = path.join(process.cwd(), 'lib/cloudinary.ts');
    const cloudinaryContent = fs.readFileSync(cloudinaryPath, 'utf8');
    
    // Check if all required Cloudinary env vars are referenced
    const hasCloudName = cloudinaryContent.includes('CLOUDINARY_CLOUD_NAME');
    const hasApiKey = cloudinaryContent.includes('CLOUDINARY_API_KEY');
    const hasApiSecret = cloudinaryContent.includes('CLOUDINARY_API_SECRET');
    
    if (hasCloudName && hasApiKey && hasApiSecret) {
      console.log('✅ Cloudinary configuration looks correct\n');
      return true;
    } else {
      console.log('❌ Cloudinary configuration is incomplete\n');
      return false;
    }
  } catch (error) {
    console.log('❌ Could not read Cloudinary configuration file\n');
    return false;
  }
}

// Check Next.js configuration
function checkNextConfig() {
  console.log('⚙️ Checking Next.js Configuration...');
  
  try {
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
    
    const hasCloudinaryDomain = nextConfigContent.includes('res.cloudinary.com');
    const hasImageConfig = nextConfigContent.includes('images:');
    
    if (hasCloudinaryDomain && hasImageConfig) {
      console.log('✅ Next.js image configuration looks correct\n');
      return true;
    } else {
      console.log('❌ Next.js configuration needs updating\n');
      return false;
    }
  } catch (error) {
    console.log('❌ Could not read Next.js configuration file\n');
    return false;
  }
}

// Check Vercel configuration
function checkVercelConfig() {
  console.log('🚀 Checking Vercel Configuration...');
  
  try {
    const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
    const vercelConfigContent = fs.readFileSync(vercelConfigPath, 'utf8');
    const vercelConfig = JSON.parse(vercelConfigContent);
    
    const hasFunctionConfig = vercelConfig.functions && vercelConfig.functions['app/api/**/*.ts'];
    const hasMaxDuration = hasFunctionConfig && vercelConfig.functions['app/api/**/*.ts'].maxDuration;
    
    if (hasMaxDuration) {
      console.log('✅ Vercel function configuration looks correct\n');
      return true;
    } else {
      console.log('❌ Vercel function configuration needs updating\n');
      return false;
    }
  } catch (error) {
    console.log('❌ Could not read or parse Vercel configuration file\n');
    return false;
  }
}

// Database connection test
async function testDatabaseConnection() {
  console.log('🗄️ Testing Database Connection...');
  
  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL not found\n');
    return false;
  }

  try {
    // Simple database URL validation
    const dbUrl = new URL(process.env.DATABASE_URL);
    
    if (dbUrl.protocol === 'mysql:' && dbUrl.hostname) {
      console.log('✅ Database URL format looks correct\n');
      return true;
    } else {
      console.log('❌ Database URL format is invalid\n');
      return false;
    }
  } catch (error) {
    console.log('❌ Database URL is malformed\n');
    return false;
  }
}

// Main diagnostic function
async function runDiagnostics() {
  console.log('Starting deployment diagnostics...\n');
  
  const results = {
    envVars: checkEnvVars(),
    fileStructure: checkFileStructure(),
    cloudinary: checkCloudinaryConfig(),
    nextConfig: checkNextConfig(),
    vercelConfig: checkVercelConfig(),
    database: await testDatabaseConnection()
  };

  console.log('📊 Diagnostic Results Summary:');
  console.log('================================');
  
  Object.entries(results).forEach(([key, passed]) => {
    const status = passed ? '✅' : '❌';
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    console.log(`${status} ${label}: ${passed ? 'PASSED' : 'FAILED'}`);
  });

  const allPassed = Object.values(results).every(result => result);
  
  console.log('\n================================');
  if (allPassed) {
    console.log('🎉 All diagnostics passed! Your deployment should work correctly.');
  } else {
    console.log('⚠️ Some issues were found. Please fix the failed items above.');
    console.log('\n📋 Next Steps:');
    console.log('1. Fix the failed items listed above');
    console.log('2. Set environment variables in Vercel dashboard');
    console.log('3. Redeploy your application');
    console.log('4. Test the functionality');
  }
  console.log('================================\n');
}

// Run diagnostics
runDiagnostics().catch(console.error);
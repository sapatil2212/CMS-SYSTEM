#!/usr/bin/env node

/**
 * Vercel Environment Setup Script
 * Helps configure environment variables for Vercel deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Vercel Environment Setup Script');
console.log('=====================================\n');

// Check if Vercel CLI is installed
function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.log('❌ Vercel CLI not found. Please install it first:');
    console.log('   npm install -g vercel');
    return false;
  }
}

// Generate a secure JWT secret
function generateJWTSecret() {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
}

// Check current environment variables
function checkCurrentEnv() {
  try {
    console.log('📋 Checking current environment variables...');
    const result = execSync('vercel env ls', { stdio: 'pipe' }).toString();
    console.log(result);
    return true;
  } catch (error) {
    console.log('❌ Error checking environment variables. Make sure you\'re logged in to Vercel.');
    return false;
  }
}

// Add environment variable
function addEnvVar(key, value, environment = 'production') {
  try {
    console.log(`🔧 Adding ${key} to ${environment} environment...`);
    execSync(`echo "${value}" | vercel env add ${key} ${environment}`, { stdio: 'pipe' });
    console.log(`✅ ${key} added successfully`);
    return true;
  } catch (error) {
    console.log(`❌ Failed to add ${key}:`, error.message);
    return false;
  }
}

// Main setup function
async function setupEnvironment() {
  console.log('1. Checking Vercel CLI...');
  if (!checkVercelCLI()) {
    return;
  }

  console.log('\n2. Checking current environment variables...');
  checkCurrentEnv();

  console.log('\n3. Setting up required environment variables...\n');

  // Required environment variables
  const requiredVars = {
    'JWT_SECRET': generateJWTSecret(),
    'NODE_ENV': 'production'
  };

  let successCount = 0;
  for (const [key, value] of Object.entries(requiredVars)) {
    if (addEnvVar(key, value)) {
      successCount++;
    }
  }

  console.log(`\n📊 Setup Summary:`);
  console.log(`   - Successfully added: ${successCount}/${Object.keys(requiredVars).length} variables`);
  
  if (successCount === Object.keys(requiredVars).length) {
    console.log('\n✅ Environment setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Add your DATABASE_URL manually:');
    console.log('      vercel env add DATABASE_URL production');
    console.log('   2. Add Cloudinary credentials if using file uploads:');
    console.log('      vercel env add CLOUDINARY_CLOUD_NAME production');
    console.log('      vercel env add CLOUDINARY_API_KEY production');
    console.log('      vercel env add CLOUDINARY_API_SECRET production');
    console.log('   3. Redeploy your application:');
    console.log('      vercel --prod');
    console.log('\n🔍 Test your deployment:');
    console.log('   - Visit: https://your-domain.vercel.app/api/debug/env-check');
    console.log('   - Check Vercel function logs for any errors');
  } else {
    console.log('\n❌ Some variables failed to add. Please add them manually.');
  }
}

// Run the setup
setupEnvironment().catch(console.error);

#!/usr/bin/env node

/**
 * API Endpoint Testing Script
 * Tests the main API endpoints to identify deployment issues
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const ENDPOINTS_TO_TEST = [
  '/api/content/hero-slider',
  '/api/content/copper-plating',
  '/api/content/silver-plating',
  '/api/admin/upload'
];

console.log('🧪 API Endpoint Testing Tool');
console.log(`Testing against: ${BASE_URL}\n`);

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const req = protocol.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Test GET endpoints
async function testGetEndpoint(endpoint) {
  try {
    console.log(`Testing GET ${endpoint}...`);
    
    const response = await makeRequest(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.statusCode === 200) {
      console.log(`✅ GET ${endpoint}: SUCCESS (${response.statusCode})`);
      
      // Try to parse JSON
      try {
        const data = JSON.parse(response.body);
        console.log(`   📊 Response type: ${Array.isArray(data) ? 'Array' : 'Object'}`);
        if (Array.isArray(data)) {
          console.log(`   📊 Items count: ${data.length}`);
        }
      } catch (parseError) {
        console.log(`   ⚠️ Response is not valid JSON`);
      }
    } else {
      console.log(`❌ GET ${endpoint}: FAILED (${response.statusCode})`);
      console.log(`   Error: ${response.body}`);
    }
    
    return response.statusCode === 200;
  } catch (error) {
    console.log(`❌ GET ${endpoint}: ERROR`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Test POST endpoints (for content updates)
async function testPostEndpoint(endpoint) {
  try {
    console.log(`Testing POST ${endpoint}...`);
    
    // Sample data for testing
    const testData = {
      heroTitle: 'Test Title',
      heroSubtitle: 'Test Subtitle',
      heroDescription: 'Test Description',
      benefits: [],
      processSteps: [],
      applications: [],
      industries: [],
      qualityChecks: []
    };
    
    const response = await makeRequest(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log(`✅ POST ${endpoint}: SUCCESS (${response.statusCode})`);
      return true;
    } else {
      console.log(`❌ POST ${endpoint}: FAILED (${response.statusCode})`);
      console.log(`   Error: ${response.body}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ POST ${endpoint}: ERROR`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Test upload endpoint with a dummy request
async function testUploadEndpoint() {
  try {
    console.log(`Testing POST /api/admin/upload (without file)...`);
    
    const response = await makeRequest(`${BASE_URL}/api/admin/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    // We expect a 400 error because no file is provided
    if (response.statusCode === 400) {
      const errorData = JSON.parse(response.body);
      if (errorData.error && errorData.error.includes('No file provided')) {
        console.log(`✅ POST /api/admin/upload: Validation working correctly (400)`);
        return true;
      }
    }
    
    if (response.statusCode === 500) {
      console.log(`❌ POST /api/admin/upload: Server error (500)`);
      console.log(`   This might indicate missing Cloudinary credentials`);
      console.log(`   Error: ${response.body}`);
    } else {
      console.log(`⚠️ POST /api/admin/upload: Unexpected response (${response.statusCode})`);
      console.log(`   Response: ${response.body}`);
    }
    
    return false;
  } catch (error) {
    console.log(`❌ POST /api/admin/upload: ERROR`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Check environment variables
function checkEnvironmentInfo() {
  console.log('🔧 Environment Information:');
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || 'not set'}`);
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Not set'}`);
  console.log(`   CLOUDINARY_CLOUD_NAME: ${process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Not set'}`);
  console.log(`   CLOUDINARY_API_KEY: ${process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Not set'}`);
  console.log(`   CLOUDINARY_API_SECRET: ${process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Not set'}\n`);
}

// Main testing function
async function runTests() {
  console.log('Starting API endpoint tests...\n');
  
  // Check environment first
  checkEnvironmentInfo();
  
  const results = {
    getEndpoints: 0,
    postEndpoints: 0,
    uploadEndpoint: false
  };
  
  // Test GET endpoints
  console.log('📥 Testing GET Endpoints:');
  console.log('========================');
  for (const endpoint of ENDPOINTS_TO_TEST.filter(e => !e.includes('upload'))) {
    const success = await testGetEndpoint(endpoint);
    if (success) results.getEndpoints++;
    console.log('');
  }
  
  // Test POST endpoints (content update)
  console.log('📤 Testing POST Endpoints (Content Update):');
  console.log('==========================================');
  const contentEndpoints = ['/api/content/copper-plating', '/api/content/silver-plating'];
  for (const endpoint of contentEndpoints) {
    const success = await testPostEndpoint(endpoint);
    if (success) results.postEndpoints++;
    console.log('');
  }
  
  // Test Upload endpoint
  console.log('📸 Testing Upload Endpoint:');
  console.log('===========================');
  results.uploadEndpoint = await testUploadEndpoint();
  console.log('');
  
  // Summary
  console.log('📊 Test Results Summary:');
  console.log('========================');
  console.log(`✅ GET Endpoints: ${results.getEndpoints}/${ENDPOINTS_TO_TEST.filter(e => !e.includes('upload')).length} passed`);
  console.log(`✅ POST Endpoints: ${results.postEndpoints}/${contentEndpoints.length} passed`);
  console.log(`✅ Upload Endpoint: ${results.uploadEndpoint ? 'Working' : 'Issues found'}`);
  
  console.log('\n🔍 Diagnosis:');
  console.log('=============');
  
  if (results.getEndpoints === 0) {
    console.log('❌ GET endpoints are failing - Check database connection and API routes');
  } else if (results.getEndpoints < ENDPOINTS_TO_TEST.filter(e => !e.includes('upload')).length) {
    console.log('⚠️ Some GET endpoints are failing - Check specific process routes');
  } else {
    console.log('✅ All GET endpoints are working');
  }
  
  if (results.postEndpoints === 0) {
    console.log('❌ POST endpoints are failing - Check database connection and write permissions');
  } else if (results.postEndpoints < contentEndpoints.length) {
    console.log('⚠️ Some POST endpoints are failing - Check specific process update routes');
  } else {
    console.log('✅ All POST endpoints are working');
  }
  
  if (!results.uploadEndpoint) {
    console.log('❌ Upload endpoint has issues - Check Cloudinary configuration');
  } else {
    console.log('✅ Upload endpoint validation is working');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('==============');
  if (results.getEndpoints === 0 || results.postEndpoints === 0) {
    console.log('1. Check DATABASE_URL environment variable in Vercel');
    console.log('2. Verify database is accessible from Vercel');
    console.log('3. Check Vercel function logs for detailed errors');
  }
  if (!results.uploadEndpoint) {
    console.log('1. Check Cloudinary environment variables in Vercel');
    console.log('2. Verify Cloudinary credentials are correct');
    console.log('3. Test image upload in admin panel');
  }
  console.log('4. Check browser console for frontend errors');
  console.log('5. Test functionality in admin panel after fixes');
}

// Run tests
runTests().catch(console.error);
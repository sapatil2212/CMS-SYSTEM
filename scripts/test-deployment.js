#!/usr/bin/env node

/**
 * Deployment Test Script
 * Tests the deployed application for common issues
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.TEST_URL || 'https://alkalyne.in';
const TIMEOUT = 10000; // 10 seconds

console.log('🧪 Deployment Test Script');
console.log('==========================\n');
console.log(`Testing: ${BASE_URL}\n`);

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: TIMEOUT
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Test functions
async function testBasicConnectivity() {
  console.log('1. Testing basic connectivity...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/debug/env-check`);
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      console.log(`   📋 Environment check: ${data.success ? 'PASS' : 'FAIL'}`);
      if (!data.success) {
        console.log(`   ❌ Issues: ${data.error}`);
      }
    }
    return response.statusCode === 200;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function testSectorsAPI() {
  console.log('\n2. Testing sectors API...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/sectors`);
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      console.log(`   📋 Sectors found: ${Array.isArray(data) ? data.length : 'N/A'}`);
    }
    return response.statusCode === 200;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function testAuthEndpoint() {
  console.log('\n3. Testing authentication endpoint...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/debug/auth-test`);
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.statusCode === 401) {
      console.log(`   📋 Expected: No token provided (401)`);
    } else if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      console.log(`   📋 Auth test: ${data.success ? 'PASS' : 'FAIL'}`);
    }
    return true; // 401 is expected without token
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function testCORSHeaders() {
  console.log('\n4. Testing CORS headers...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/sectors`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://alkalyne.in',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    console.log(`   ✅ Status: ${response.statusCode}`);
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
      'Access-Control-Allow-Methods': response.headers['access-control-allow-methods'],
      'Access-Control-Allow-Headers': response.headers['access-control-allow-headers']
    };
    
    console.log(`   📋 CORS Headers:`, corsHeaders);
    return response.statusCode === 200;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function testDatabaseConnection() {
  console.log('\n5. Testing database connection...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/debug/db-test`);
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      console.log(`   📋 Database: ${data.success ? 'CONNECTED' : 'FAILED'}`);
      if (!data.success) {
        console.log(`   ❌ Database error: ${data.error}`);
      }
    }
    return response.statusCode === 200;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

// Main test function
async function runTests() {
  const tests = [
    { name: 'Basic Connectivity', fn: testBasicConnectivity },
    { name: 'Sectors API', fn: testSectorsAPI },
    { name: 'Authentication', fn: testAuthEndpoint },
    { name: 'CORS Headers', fn: testCORSHeaders },
    { name: 'Database Connection', fn: testDatabaseConnection }
  ];

  let passedTests = 0;
  const results = [];

  for (const test of tests) {
    try {
      const result = await test.fn();
      results.push({ name: test.name, passed: result });
      if (result) passedTests++;
    } catch (error) {
      console.log(`   ❌ Test failed: ${error.message}`);
      results.push({ name: test.name, passed: false });
    }
  }

  console.log('\n📊 Test Results:');
  console.log('================');
  results.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${result.name}`);
  });

  console.log(`\n🎯 Summary: ${passedTests}/${tests.length} tests passed`);
  
  if (passedTests === tests.length) {
    console.log('\n🎉 All tests passed! Your deployment looks good.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the issues above.');
    console.log('\n🔧 Recommended actions:');
    console.log('   1. Check Vercel environment variables');
    console.log('   2. Verify database connection');
    console.log('   3. Check JWT_SECRET configuration');
    console.log('   4. Review Vercel function logs');
  }
}

// Run tests
runTests().catch(console.error);

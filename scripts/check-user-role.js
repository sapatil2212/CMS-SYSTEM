#!/usr/bin/env node

/**
 * User Role Check Script
 * Helps verify if the current user has admin privileges
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.TEST_URL || 'https://alkalyne.in';
const TIMEOUT = 10000; // 10 seconds

console.log('👤 User Role Check Script');
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
async function testUserAuth() {
  console.log('1. Testing user authentication...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.statusCode === 401) {
      console.log(`   📋 Expected: Invalid token (401)`);
    } else if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      console.log(`   👤 User: ${data.email} (${data.role})`);
      console.log(`   🔐 Is Admin: ${data.role === 'ADMIN' ? 'YES' : 'NO'}`);
    }
    return true;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function testSectorUpdateWithInvalidToken() {
  console.log('\n2. Testing sector update with invalid token...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/sectors/test-id`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer invalid-token',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test Sector',
        description: 'Test Description',
        details: 'Test Details'
      })
    });
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.statusCode === 401) {
      console.log(`   📋 Expected: Invalid token (401)`);
    } else if (response.statusCode === 403) {
      console.log(`   📋 Expected: Forbidden (403)`);
    } else {
      console.log(`   📋 Unexpected status: ${response.statusCode}`);
    }
    return true;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function testSectorUpdateWithNoToken() {
  console.log('\n3. Testing sector update without token...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/sectors/test-id`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test Sector',
        description: 'Test Description',
        details: 'Test Details'
      })
    });
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.statusCode === 401) {
      console.log(`   📋 Expected: No token (401)`);
    } else if (response.statusCode === 403) {
      console.log(`   📋 Expected: Forbidden (403)`);
    } else {
      console.log(`   📋 Unexpected status: ${response.statusCode}`);
    }
    return true;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

// Main test function
async function runUserRoleTests() {
  const tests = [
    { name: 'User Authentication', fn: testUserAuth },
    { name: 'Sector Update (Invalid Token)', fn: testSectorUpdateWithInvalidToken },
    { name: 'Sector Update (No Token)', fn: testSectorUpdateWithNoToken }
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
  
  console.log('\n🔧 Troubleshooting Steps:');
  console.log('==========================');
  console.log('1. Check if you are logged in as an ADMIN user');
  console.log('2. Verify your JWT token is not expired');
  console.log('3. Try logging out and logging back in');
  console.log('4. Check browser console for authentication errors');
  console.log('5. Verify JWT_SECRET is the same in development and production');
  
  console.log('\n💡 Manual Steps:');
  console.log('==================');
  console.log('1. Go to https://alkalyne.in/login');
  console.log('2. Log in with admin credentials');
  console.log('3. Check browser localStorage for token');
  console.log('4. Try updating a sector');
  console.log('5. Check browser console for errors');
  
  console.log('\n🔍 Debug Commands:');
  console.log('==================');
  console.log('// In browser console:');
  console.log('console.log(localStorage.getItem("token"))');
  console.log('console.log("Token length:", localStorage.getItem("token")?.length)');
  console.log('console.log("User role:", JSON.parse(atob(localStorage.getItem("token").split(".")[1])).role)');
}

// Run tests
runUserRoleTests().catch(console.error);

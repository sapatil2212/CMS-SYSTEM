#!/usr/bin/env node

/**
 * Authentication Debug Script
 * Tests the complete authentication flow to identify issues
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.TEST_URL || 'https://alkalyne.in';
const TIMEOUT = 10000; // 10 seconds

console.log('🔍 Authentication Debug Script');
console.log('================================\n');
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
async function testEnvironmentVariables() {
  console.log('1. Testing environment variables...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/debug/env-check`);
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      console.log(`   📋 Environment check: ${data.success ? 'PASS' : 'FAIL'}`);
      if (data.environmentVariables) {
        console.log(`   🔑 JWT_SECRET: ${data.environmentVariables.JWT_SECRET?.exists ? 'SET' : 'MISSING'}`);
        console.log(`   🗄️  DATABASE_URL: ${data.environmentVariables.DATABASE_URL?.exists ? 'SET' : 'MISSING'}`);
      }
    }
    return response.statusCode === 200;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function testAuthEndpoint() {
  console.log('\n2. Testing authentication endpoint...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/debug/auth-test`);
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.statusCode === 401) {
      console.log(`   📋 Expected: No token provided (401)`);
    } else if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      console.log(`   📋 Auth test: ${data.success ? 'PASS' : 'FAIL'}`);
      if (data.user) {
        console.log(`   👤 User: ${data.user.email} (${data.user.role})`);
      }
    }
    return true; // 401 is expected without token
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function testSectorAuthEndpoint() {
  console.log('\n3. Testing sector-specific auth endpoint...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/debug/sector-auth-test`);
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.statusCode === 401) {
      console.log(`   📋 Expected: No token provided (401)`);
    } else if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      console.log(`   📋 Sector auth test: ${data.success ? 'PASS' : 'FAIL'}`);
      if (data.user) {
        console.log(`   👤 User: ${data.user.email} (${data.user.role})`);
        console.log(`   🔐 Is Admin: ${data.user.role === 'ADMIN' ? 'YES' : 'NO'}`);
      }
    } else if (response.statusCode === 403) {
      const data = JSON.parse(response.data);
      console.log(`   📋 403 Error: ${data.error}`);
      if (data.debug) {
        console.log(`   🔍 Debug: User role: ${data.debug.userRole}, Required: ADMIN`);
      }
    }
    return true; // 401 is expected without token
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function testSectorsAPI() {
  console.log('\n4. Testing sectors API (public access)...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/sectors`);
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      console.log(`   📋 Sectors found: ${Array.isArray(data) ? data.length : 'N/A'}`);
      if (Array.isArray(data) && data.length > 0) {
        console.log(`   📝 Sample sector: ${data[0].name}`);
      }
    }
    return response.statusCode === 200;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function testSectorUpdateWithToken() {
  console.log('\n5. Testing sector update with token...');
  
  // This would require a valid token, so we'll just test the endpoint structure
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

// Main test function
async function runDebugTests() {
  const tests = [
    { name: 'Environment Variables', fn: testEnvironmentVariables },
    { name: 'Auth Endpoint', fn: testAuthEndpoint },
    { name: 'Sector Auth Endpoint', fn: testSectorAuthEndpoint },
    { name: 'Sectors API (Public)', fn: testSectorsAPI },
    { name: 'Sector Update (Token)', fn: testSectorUpdateWithToken }
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

  console.log('\n📊 Debug Results:');
  console.log('==================');
  results.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${result.name}`);
  });

  console.log(`\n🎯 Summary: ${passedTests}/${tests.length} tests passed`);
  
  console.log('\n🔧 Analysis:');
  console.log('============');
  console.log('1. If environment variables test fails: Check JWT_SECRET and DATABASE_URL');
  console.log('2. If auth endpoints return 404: Debug routes not deployed yet');
  console.log('3. If sector update returns 403: User may not have ADMIN role');
  console.log('4. If sector update returns 401: Token validation is failing');
  console.log('5. If sectors API fails: Database connection issue');
  
  console.log('\n💡 Next Steps:');
  console.log('===============');
  console.log('1. Check if user is logged in as ADMIN');
  console.log('2. Verify JWT token is valid and not expired');
  console.log('3. Check Vercel function logs for specific errors');
  console.log('4. Test with a fresh login session');
}

// Run tests
runDebugTests().catch(console.error);

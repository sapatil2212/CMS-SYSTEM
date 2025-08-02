/**
 * Comprehensive Production API Testing Script
 * Tests all API endpoints and verifies production readiness
 */

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

class ProductionAPITester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      errors: []
    };
    this.authToken = null;
    this.adminUser = null;
  }

  async log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.authToken && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      return {
        status: response.status,
        statusText: response.statusText,
        data: response.headers.get('content-type')?.includes('application/json') 
          ? await response.json() 
          : await response.text(),
        ok: response.ok
      };
    } catch (error) {
      return {
        status: 0,
        statusText: 'Network Error',
        data: { error: error.message },
        ok: false
      };
    }
  }

  async testEndpoint(name, endpoint, method = 'GET', data = null, expectedStatus = 200) {
    try {
      const options = {
        method,
        ...(data && { body: JSON.stringify(data) })
      };

      const result = await this.makeRequest(endpoint, options);
      
      if (result.status === expectedStatus || (result.ok && expectedStatus >= 200 && expectedStatus < 300)) {
        this.results.passed++;
        await this.log(`${name}: PASSED (${result.status})`, 'success');
        return { success: true, result };
      } else {
        this.results.failed++;
        await this.log(`${name}: FAILED (${result.status}) - ${result.statusText}`, 'error');
        this.results.errors.push(`${name}: Expected ${expectedStatus}, got ${result.status}`);
        return { success: false, result };
      }
    } catch (error) {
      this.results.failed++;
      await this.log(`${name}: ERROR - ${error.message}`, 'error');
      this.results.errors.push(`${name}: ${error.message}`);
      return { success: false, error };
    }
  }

  async setupTestUser() {
    await this.log('Setting up test user for authentication tests...');
    
    // Try to create a test user
    const testUser = {
      name: 'Test User',
      email: 'test@production.com',
      password: 'TestPassword123!',
      otp: '123456' // This will fail without proper OTP, but we'll handle it
    };

    // Register test user
    const registerResult = await this.testEndpoint(
      'User Registration',
      '/api/auth/register',
      'POST',
      testUser,
      201
    );

    if (registerResult.success) {
      // Try to login
      const loginResult = await this.testEndpoint(
        'User Login',
        '/api/auth/login',
        'POST',
        {
          email: testUser.email,
          password: testUser.password
        },
        200
      );

      if (loginResult.success && loginResult.result.data.token) {
        this.authToken = loginResult.result.data.token;
        this.adminUser = loginResult.result.data.user;
        await this.log('Authentication setup successful', 'success');
      }
    }
  }

  async testAuthenticationAPIs() {
    await this.log('\n=== TESTING AUTHENTICATION APIs ===');
    
    // Test auth endpoints
    await this.testEndpoint('Auth Me (No Auth)', '/api/auth/me', 'GET', null, 401);
    
    if (this.authToken) {
      await this.testEndpoint('Auth Me (With Auth)', '/api/auth/me');
      await this.testEndpoint('Auth Profile', '/api/auth/profile');
    }

    // Test password reset flow
    await this.testEndpoint(
      'Forgot Password',
      '/api/auth/forgot-password',
      'POST',
      { email: 'test@production.com' }
    );
  }

  async testContentAPIs() {
    await this.log('\n=== TESTING CONTENT APIs ===');
    
    // Test public content endpoints
    await this.testEndpoint('Home About Content', '/api/content/about');
    await this.testEndpoint('Header Content', '/api/content/header');
    await this.testEndpoint('Footer Settings', '/api/content/footer-settings');
    await this.testEndpoint('Hero Slider', '/api/content/hero-slider');
    await this.testEndpoint('Services', '/api/content/services');
    await this.testEndpoint('Testimonials', '/api/content/testimonials');
    await this.testEndpoint('Why Choose Us Content', '/api/content/why-choose-us-content');
    await this.testEndpoint('Why Choose Us Features', '/api/content/why-choose-us-features');
    
    // Test base metal content
    await this.testEndpoint('Active Base Metals', '/api/content/active-base-metals');
    await this.testEndpoint('Aluminium Content', '/api/content/aluminium');
    await this.testEndpoint('Copper Content', '/api/content/copper');
    await this.testEndpoint('Brass Content', '/api/content/brass');
    await this.testEndpoint('Carbon Steel Content', '/api/content/carbon-steel');
    await this.testEndpoint('Stainless Steel Content', '/api/content/stainless-steel');
    
    // Test gallery content
    await this.testEndpoint('Gallery Content', '/api/content/gallery-content');
    await this.testEndpoint('Gallery Images', '/api/content/gallery-images');
  }

  async testAdminAPIs() {
    await this.log('\n=== TESTING ADMIN APIs ===');
    
    if (!this.authToken) {
      await this.log('Skipping admin tests - no auth token available', 'error');
      return;
    }

    // Test admin stats
    await this.testEndpoint('Dashboard Stats', '/api/dashboard/stats');
    await this.testEndpoint('Admin Stats', '/api/admin/stats');
    await this.testEndpoint('Base Metals Count', '/api/admin/stats/base-metals-count');
    await this.testEndpoint('Processes Count', '/api/admin/stats/processes-count');
    
    // Test admin content management
    await this.testEndpoint('Admin About Content', '/api/admin/content/about');
    await this.testEndpoint('Admin Contact Content', '/api/admin/content/contact');
    await this.testEndpoint('Admin Home Content', '/api/admin/content/home');
    
    // Test admin user management
    await this.testEndpoint('Admin Users List', '/api/admin/users');
    await this.testEndpoint('Admin Contact Submissions', '/api/admin/contact-submissions');
    await this.testEndpoint('Admin Recent Content', '/api/admin/recent-content');
  }

  async testContactAPIs() {
    await this.log('\n=== TESTING CONTACT APIs ===');
    
    // Test contact form submission
    const contactData = {
      fullName: 'Test Contact',
      email: 'test@example.com',
      mobile: '+1234567890',
      processType: 'Gold Plating',
      message: 'This is a test message for production API testing.'
    };

    await this.testEndpoint('Contact Info', '/api/contact');
    await this.testEndpoint('Contact Form Submit', '/api/contact/submit', 'POST', contactData);
  }

  async testDebugAPIs() {
    await this.log('\n=== TESTING DEBUG/HEALTH APIs ===');
    
    await this.testEndpoint('Database Test', '/api/debug/db-test');
    await this.testEndpoint('Debug API', '/api/debug');
    await this.testEndpoint('Visitor Track', '/api/visitors/track', 'POST', { 
      page: '/test',
      userAgent: 'Production Test Agent'
    });
  }

  async runAllTests() {
    await this.log('🚀 Starting Production API Testing...\n');
    
    try {
      // Setup
      await this.setupTestUser();
      
      // Run all test suites
      await this.testAuthenticationAPIs();
      await this.testContentAPIs();
      await this.testAdminAPIs();
      await this.testContactAPIs();
      await this.testDebugAPIs();
      
      // Summary
      await this.log('\n=== TEST SUMMARY ===');
      await this.log(`Total Tests: ${this.results.passed + this.results.failed}`);
      await this.log(`Passed: ${this.results.passed}`, 'success');
      await this.log(`Failed: ${this.results.failed}`, this.results.failed > 0 ? 'error' : 'success');
      
      if (this.results.errors.length > 0) {
        await this.log('\n=== ERRORS ===');
        this.results.errors.forEach(error => this.log(error, 'error'));
      }
      
      const isProductionReady = this.results.failed === 0;
      await this.log(`\n🎯 Production Ready: ${isProductionReady ? 'YES' : 'NO'}`, 
        isProductionReady ? 'success' : 'error');
      
      return isProductionReady;
      
    } catch (error) {
      await this.log(`Fatal error during testing: ${error.message}`, 'error');
      return false;
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new ProductionAPITester();
  tester.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = ProductionAPITester;
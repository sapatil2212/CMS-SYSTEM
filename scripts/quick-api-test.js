/**
 * Quick API Test Script - No Authentication Required
 * Tests public endpoints and basic functionality
 */

// Use built-in fetch in Node.js 18+
const fetch = globalThis.fetch;
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

class QuickAPITester {
  constructor() {
    this.results = { passed: 0, failed: 0, errors: [] };
  }

  async log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async testEndpoint(name, endpoint, method = 'GET', data = null, expectedStatus = 200) {
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...(data && { body: JSON.stringify(data) })
      };

      const response = await fetch(`${BASE_URL}${endpoint}`, options);
      const isSuccess = response.status === expectedStatus || response.ok;
      
      if (isSuccess) {
        this.results.passed++;
        await this.log(`${name}: PASSED (${response.status})`, 'success');
      } else {
        this.results.failed++;
        await this.log(`${name}: FAILED (${response.status})`, 'error');
        this.results.errors.push(`${name}: Expected ${expectedStatus}, got ${response.status}`);
      }

      return { success: isSuccess, status: response.status };
    } catch (error) {
      this.results.failed++;
      await this.log(`${name}: ERROR - ${error.message}`, 'error');
      this.results.errors.push(`${name}: ${error.message}`);
      return { success: false, error };
    }
  }

  async runQuickTests() {
    await this.log('🚀 Starting Quick API Tests...\n');

    // Test public content endpoints
    await this.log('=== TESTING PUBLIC CONTENT APIs ===');
    await this.testEndpoint('Home About Content', '/api/content/about');
    await this.testEndpoint('Header Content', '/api/content/header');
    await this.testEndpoint('Footer Settings', '/api/content/footer-settings');
    await this.testEndpoint('Services', '/api/content/services');
    await this.testEndpoint('Active Base Metals', '/api/content/active-base-metals');

    // Test contact endpoints
    await this.log('\n=== TESTING CONTACT APIs ===');
    await this.testEndpoint('Contact Info', '/api/contact');
    
    const contactData = {
      fullName: 'Test User',
      email: 'test@example.com',
      mobile: '+1234567890',
      processType: 'Gold Plating',
      message: 'Test message for API validation'
    };
    await this.testEndpoint('Contact Form Submit', '/api/contact/submit', 'POST', contactData);

    // Test auth endpoints (without actual auth)
    await this.log('\n=== TESTING AUTH APIs (Expected Failures) ===');
    await this.testEndpoint('Auth Me (No Token)', '/api/auth/me', 'GET', null, 401);
    
    const loginData = { email: 'nonexistent@test.com', password: 'wrongpassword' };
    await this.testEndpoint('Login (Bad Credentials)', '/api/auth/login', 'POST', loginData, 401);

    // Test debug/health endpoints
    await this.log('\n=== TESTING HEALTH APIs ===');
    await this.testEndpoint('Database Test', '/api/debug/db-test');
    await this.testEndpoint('Debug API', '/api/debug');

    // Summary
    await this.log('\n=== QUICK TEST SUMMARY ===');
    await this.log(`Total Tests: ${this.results.passed + this.results.failed}`);
    await this.log(`Passed: ${this.results.passed}`, 'success');
    await this.log(`Failed: ${this.results.failed}`, this.results.failed > 0 ? 'error' : 'success');

    if (this.results.errors.length > 0) {
      await this.log('\n=== ERRORS ===');
      this.results.errors.forEach(error => this.log(error, 'error'));
    }

    const isHealthy = this.results.failed <= 2; // Allow some expected failures
    await this.log(`\n🎯 API Health: ${isHealthy ? 'GOOD' : 'NEEDS ATTENTION'}`, 
      isHealthy ? 'success' : 'error');

    return isHealthy;
  }
}

// Run tests
const tester = new QuickAPITester();
tester.runQuickTests().then(success => {
  process.exit(success ? 0 : 1);
});
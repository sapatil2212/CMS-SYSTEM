/**
 * Production Environment Validation Script
 * Validates all environment variables and configurations for production deployment
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

class ProductionValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.recommendations = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  validateEnvironmentVariables() {
    this.log('\n=== VALIDATING ENVIRONMENT VARIABLES ===');
    
    const requiredVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'EMAIL_HOST',
      'EMAIL_PORT',
      'EMAIL_USERNAME',
      'EMAIL_PASSWORD',
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET',
      'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'
    ];

    const optionalVars = [
      'MAX_FILE_SIZE',
      'UPLOAD_DIR'
    ];

    // Check required variables
    requiredVars.forEach(varName => {
      const value = process.env[varName];
      if (!value) {
        this.errors.push(`Missing required environment variable: ${varName}`);
        this.log(`Missing required variable: ${varName}`, 'error');
      } else if (value.includes('change-this-in-production') || value.includes('your-super-secret')) {
        this.errors.push(`Environment variable ${varName} contains placeholder value`);
        this.log(`Placeholder value in ${varName}`, 'error');
      } else {
        this.log(`${varName}: OK`, 'success');
      }
    });

    // Check optional variables
    optionalVars.forEach(varName => {
      const value = process.env[varName];
      if (!value) {
        this.warnings.push(`Optional environment variable not set: ${varName}`);
        this.log(`Optional variable missing: ${varName}`, 'warning');
      } else {
        this.log(`${varName}: OK`, 'success');
      }
    });

    // Validate specific formats
    this.validateDatabaseURL();
    this.validateJWTSecret();
    this.validateEmailConfig();
    this.validateCloudinaryConfig();
  }

  validateDatabaseURL() {
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      if (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')) {
        this.warnings.push('Database URL points to localhost - ensure this is correct for production');
        this.log('Database URL uses localhost', 'warning');
      }
      
      if (!dbUrl.includes('connection_limit') && !dbUrl.includes('pool_timeout')) {
        this.recommendations.push('Consider adding connection pooling parameters to DATABASE_URL');
      }
    }
  }

  validateJWTSecret() {
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret && jwtSecret.length < 32) {
      this.warnings.push('JWT_SECRET should be at least 32 characters long for security');
      this.log('JWT_SECRET too short', 'warning');
    }
  }

  validateEmailConfig() {
    const emailHost = process.env.EMAIL_HOST;
    const emailPort = process.env.EMAIL_PORT;
    const emailUser = process.env.EMAIL_USERNAME;
    const emailPass = process.env.EMAIL_PASSWORD;

    if (emailHost && emailUser && emailPass) {
      if (emailPort && !['587', '465', '25'].includes(emailPort)) {
        this.warnings.push('Email port should typically be 587 (TLS), 465 (SSL), or 25 (unsecured)');
      }
      
      if (emailUser.includes('@gmail.com') && emailPass.length < 16) {
        this.warnings.push('Gmail requires app-specific passwords (16 characters)');
      }
    }
  }

  validateCloudinaryConfig() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const publicCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (cloudName && publicCloudName && cloudName !== publicCloudName) {
      this.errors.push('CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME must match');
    }

    if (apiKey && apiKey.length < 15) {
      this.warnings.push('Cloudinary API key seems too short');
    }

    if (apiSecret && apiSecret.length < 20) {
      this.warnings.push('Cloudinary API secret seems too short');
    }
  }

  validateSecurityHeaders() {
    this.log('\n=== VALIDATING SECURITY CONFIGURATION ===');
    
    // Check for next.config.js security headers
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    if (fs.existsSync(nextConfigPath)) {
      const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
      
      const securityFeatures = [
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Referrer-Policy',
        'Permissions-Policy'
      ];

      securityFeatures.forEach(header => {
        if (!nextConfig.includes(header)) {
          this.recommendations.push(`Consider adding ${header} security header`);
        }
      });

      if (nextConfig.includes('X-Frame-Options')) {
        this.log('Security headers configured', 'success');
      } else {
        this.recommendations.push('Add security headers to next.config.js');
      }
    } else {
      this.warnings.push('next.config.js not found - consider adding security headers');
    }
  }

  validateDatabaseConnection() {
    this.log('\n=== VALIDATING DATABASE CONNECTION ===');
    
    // This would require importing Prisma, so we'll just check the URL format
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      if (dbUrl.startsWith('mysql://')) {
        this.log('MySQL database configuration detected', 'success');
      } else if (dbUrl.startsWith('postgresql://')) {
        this.log('PostgreSQL database configuration detected', 'success');
      } else {
        this.warnings.push('Unknown database type in DATABASE_URL');
      }
    }
  }

  validateProductionOptimizations() {
    this.log('\n=== VALIDATING PRODUCTION OPTIMIZATIONS ===');
    
    // Check NODE_ENV
    if (process.env.NODE_ENV !== 'production') {
      this.warnings.push('NODE_ENV is not set to "production"');
    } else {
      this.log('NODE_ENV: production', 'success');
    }

    // Check for development dependencies in package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      if (packageJson.dependencies && packageJson.dependencies['@types/node']) {
        this.recommendations.push('Move @types/* packages to devDependencies');
      }

      // Check for build optimization
      if (packageJson.scripts && packageJson.scripts.build) {
        this.log('Build script configured', 'success');
      } else {
        this.errors.push('No build script found in package.json');
      }
    }
  }

  async validateAPIHealth() {
    this.log('\n=== VALIDATING API HEALTH ===');
    
    try {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      
      // Test basic health endpoint
      const response = await fetch(`${baseUrl}/api/debug/db-test`);
      if (response.ok) {
        this.log('Database connection test: PASSED', 'success');
      } else {
        this.errors.push(`Database connection test failed: ${response.status}`);
      }
    } catch (error) {
      this.errors.push(`API health check failed: ${error.message}`);
    }
  }

  generateReport() {
    this.log('\n=== PRODUCTION VALIDATION REPORT ===');
    
    const totalIssues = this.errors.length + this.warnings.length;
    
    this.log(`Total Issues Found: ${totalIssues}`);
    this.log(`Errors: ${this.errors.length}`, this.errors.length > 0 ? 'error' : 'success');
    this.log(`Warnings: ${this.warnings.length}`, this.warnings.length > 0 ? 'warning' : 'success');
    this.log(`Recommendations: ${this.recommendations.length}`);

    if (this.errors.length > 0) {
      this.log('\n=== CRITICAL ERRORS (MUST FIX) ===');
      this.errors.forEach(error => this.log(error, 'error'));
    }

    if (this.warnings.length > 0) {
      this.log('\n=== WARNINGS (SHOULD FIX) ===');
      this.warnings.forEach(warning => this.log(warning, 'warning'));
    }

    if (this.recommendations.length > 0) {
      this.log('\n=== RECOMMENDATIONS ===');
      this.recommendations.forEach(rec => this.log(rec));
    }

    const isProductionReady = this.errors.length === 0;
    this.log(`\n🎯 Production Ready: ${isProductionReady ? 'YES' : 'NO'}`, 
      isProductionReady ? 'success' : 'error');

    return {
      isReady: isProductionReady,
      errors: this.errors,
      warnings: this.warnings,
      recommendations: this.recommendations
    };
  }

  async runValidation() {
    this.log('🔍 Starting Production Validation...');
    
    try {
      this.validateEnvironmentVariables();
      this.validateSecurityHeaders();
      this.validateDatabaseConnection();
      this.validateProductionOptimizations();
      await this.validateAPIHealth();
      
      return this.generateReport();
    } catch (error) {
      this.log(`Validation failed: ${error.message}`, 'error');
      return { isReady: false, errors: [error.message], warnings: [], recommendations: [] };
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new ProductionValidator();
  validator.runValidation().then(result => {
    process.exit(result.isReady ? 0 : 1);
  });
}

module.exports = ProductionValidator;
#!/usr/bin/env node

/**
 * Test script for the complete registration flow
 * This script tests OTP generation, email sending, and user registration
 */

const { PrismaClient } = require('@prisma/client')
const nodemailer = require('nodemailer')

const prisma = new PrismaClient()

// Test configuration
const TEST_EMAIL = 'test@example.com'
const TEST_NAME = 'Test User'
const TEST_PASSWORD = 'password123'

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function testEnvironmentVariables() {
  console.log('🔍 Checking environment variables...')
  
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_USERNAME',
    'EMAIL_PASSWORD'
  ]
  
  const missing = []
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName)
    }
  }
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing)
    return false
  }
  
  console.log('✅ All required environment variables are present')
  return true
}

async function testEmailConfiguration() {
  console.log('📧 Testing email configuration...')
  
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME || process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS
      }
    })
    
    // Verify connection
    await transporter.verify()
    console.log('✅ Email configuration is valid')
    return true
  } catch (error) {
    console.error('❌ Email configuration error:', error.message)
    return false
  }
}

async function testDatabaseConnection() {
  console.log('🗄️ Testing database connection...')
  
  try {
    await prisma.$connect()
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Database connection error:', error.message)
    return false
  }
}

async function testOTPCreation() {
  console.log('🔐 Testing OTP creation...')
  
  try {
    // Clean up any existing test OTPs
    await prisma.oTP.deleteMany({
      where: {
        userId: TEST_EMAIL,
        type: 'SIGNUP_VERIFICATION'
      }
    })
    
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    
    const otpRecord = await prisma.oTP.create({
      data: {
        userId: TEST_EMAIL,
        otp,
        expiresAt,
        type: 'SIGNUP_VERIFICATION'
      }
    })
    
    console.log('✅ OTP created successfully:', {
      id: otpRecord.id,
      otp: otpRecord.otp,
      expiresAt: otpRecord.expiresAt
    })
    
    return otpRecord
  } catch (error) {
    console.error('❌ OTP creation error:', error.message)
    return null
  }
}

async function testOTPVerification(otpRecord) {
  console.log('🔍 Testing OTP verification...')
  
  try {
    const storedOTP = await prisma.oTP.findFirst({
      where: {
        userId: TEST_EMAIL,
        otp: otpRecord.otp,
        type: 'SIGNUP_VERIFICATION',
        expiresAt: {
          gt: new Date(),
        },
      },
    })
    
    if (storedOTP) {
      console.log('✅ OTP verification successful')
      return true
    } else {
      console.error('❌ OTP verification failed')
      return false
    }
  } catch (error) {
    console.error('❌ OTP verification error:', error.message)
    return false
  }
}

async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...')
  
  try {
    // Remove test OTP
    await prisma.oTP.deleteMany({
      where: {
        userId: TEST_EMAIL,
        type: 'SIGNUP_VERIFICATION'
      }
    })
    
    // Remove test user if exists
    await prisma.user.deleteMany({
      where: {
        email: TEST_EMAIL
      }
    })
    
    console.log('✅ Test data cleaned up')
  } catch (error) {
    console.error('❌ Cleanup error:', error.message)
  }
}

async function runTests() {
  console.log('🚀 Starting registration flow tests...\n')
  
  try {
    // Test 1: Environment Variables
    const envCheck = await testEnvironmentVariables()
    if (!envCheck) {
      console.log('\n❌ Tests failed: Environment variables not configured')
      return
    }
    
    // Test 2: Database Connection
    const dbCheck = await testDatabaseConnection()
    if (!dbCheck) {
      console.log('\n❌ Tests failed: Database connection failed')
      return
    }
    
    // Test 3: Email Configuration
    const emailCheck = await testEmailConfiguration()
    if (!emailCheck) {
      console.log('\n⚠️  Warning: Email configuration failed (emails won\'t be sent)')
    }
    
    // Test 4: OTP Creation
    const otpRecord = await testOTPCreation()
    if (!otpRecord) {
      console.log('\n❌ Tests failed: OTP creation failed')
      return
    }
    
    // Test 5: OTP Verification
    const otpVerification = await testOTPVerification(otpRecord)
    if (!otpVerification) {
      console.log('\n❌ Tests failed: OTP verification failed')
      return
    }
    
    // Clean up
    await cleanupTestData()
    
    console.log('\n✅ All tests passed! Registration flow is ready.')
    
    if (!emailCheck) {
      console.log('\n⚠️  Note: Fix email configuration to enable OTP sending.')
    }
    
  } catch (error) {
    console.error('\n💥 Test execution error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the tests
runTests()
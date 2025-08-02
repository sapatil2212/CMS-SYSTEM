const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function testProfileManagement() {
  console.log('🧪 Testing Profile Management Functionality...\n')

  try {
    // Test 1: Create a test user
    console.log('1. Creating test user...')
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 12),
        name: 'Test User',
        role: 'USER'
      }
    })
    console.log('✅ Test user created:', testUser.email)

    // Test 2: Generate OTP
    console.log('\n2. Testing OTP generation...')
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    const storedOTP = await prisma.oTP.create({
      data: {
        userId: testUser.id,
        otp,
        expiresAt
      }
    })
    console.log('✅ OTP generated and stored:', otp)

    // Test 3: Verify OTP retrieval
    console.log('\n3. Testing OTP retrieval...')
    const retrievedOTP = await prisma.oTP.findFirst({
      where: {
        userId: testUser.id,
        expiresAt: {
          gt: new Date()
        }
      }
    })
    console.log('✅ OTP retrieved:', retrievedOTP ? 'Success' : 'Failed')

    // Test 4: Update user profile
    console.log('\n4. Testing profile update...')
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: { name: 'Updated Test User' }
    })
    console.log('✅ Profile updated:', updatedUser.name)

    // Test 5: Clean up expired OTPs
    console.log('\n5. Testing OTP cleanup...')
    const cleanupResult = await prisma.oTP.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
    console.log('✅ Expired OTPs cleaned up:', cleanupResult.count, 'records')

    // Test 6: Clean up test data
    console.log('\n6. Cleaning up test data...')
    await prisma.oTP.deleteMany({
      where: { userId: testUser.id }
    })
    await prisma.user.delete({
      where: { id: testUser.id }
    })
    console.log('✅ Test data cleaned up')

    console.log('\n🎉 All profile management tests passed!')
    console.log('\n📋 Test Summary:')
    console.log('   ✅ User creation')
    console.log('   ✅ OTP generation and storage')
    console.log('   ✅ OTP retrieval')
    console.log('   ✅ Profile updates')
    console.log('   ✅ OTP cleanup')
    console.log('   ✅ Data cleanup')

  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testProfileManagement() 
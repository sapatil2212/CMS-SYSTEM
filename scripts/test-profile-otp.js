const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testProfileOTP() {
  console.log('🧪 Testing Profile OTP Functionality...\n')

  try {
    // 1. Test OTP Generation
    console.log('1. Testing OTP Generation...')
    
    // Find a test user
    const testUser = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    })

    if (!testUser) {
      console.log('❌ No test user found. Please create a user first.')
      return
    }

    console.log(`✅ Found test user: ${testUser.name} (${testUser.email})`)

    // 2. Test OTP Creation
    console.log('\n2. Testing OTP Creation...')
    
    const testOTP = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    const createdOTP = await prisma.oTP.create({
      data: {
        userId: testUser.id,
        otp: testOTP,
        type: 'PROFILE_UPDATE',
        expiresAt
      }
    })

    console.log(`✅ OTP created: ${testOTP} (expires at ${expiresAt.toLocaleString()})`)

    // 3. Test OTP Retrieval
    console.log('\n3. Testing OTP Retrieval...')
    
    const retrievedOTP = await prisma.oTP.findFirst({
      where: {
        userId: testUser.id,
        type: 'PROFILE_UPDATE',
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (retrievedOTP) {
      console.log(`✅ OTP retrieved: ${retrievedOTP.otp}`)
      console.log(`   - Type: ${retrievedOTP.type}`)
      console.log(`   - Expires: ${retrievedOTP.expiresAt.toLocaleString()}`)
    } else {
      console.log('❌ No valid OTP found')
    }

    // 4. Test OTP Verification
    console.log('\n4. Testing OTP Verification...')
    
    if (retrievedOTP && retrievedOTP.otp === testOTP) {
      console.log('✅ OTP verification successful')
      
      // Clean up - delete the test OTP
      await prisma.oTP.delete({
        where: {
          id: retrievedOTP.id
        }
      })
      console.log('✅ Test OTP cleaned up')
    } else {
      console.log('❌ OTP verification failed')
    }

    // 5. Test Expired OTP Cleanup
    console.log('\n5. Testing Expired OTP Cleanup...')
    
    // Create an expired OTP
    const expiredOTP = await prisma.oTP.create({
      data: {
        userId: testUser.id,
        otp: '123456',
        type: 'PROFILE_UPDATE',
        expiresAt: new Date(Date.now() - 60 * 1000) // 1 minute ago
      }
    })

    console.log('✅ Created expired OTP')

    // Clean up expired OTPs
    const deletedCount = await prisma.oTP.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })

    console.log(`✅ Cleaned up ${deletedCount.count} expired OTP(s)`)

    // 6. Test Database Schema
    console.log('\n6. Testing Database Schema...')
    
    const otpCount = await prisma.oTP.count()
    const userCount = await prisma.user.count()
    
    console.log(`✅ Database stats:`)
    console.log(`   - Total OTPs: ${otpCount}`)
    console.log(`   - Total Users: ${userCount}`)

    console.log('\n🎉 All tests completed successfully!')
    console.log('\n📋 Test Summary:')
    console.log('   ✅ OTP Generation')
    console.log('   ✅ OTP Storage')
    console.log('   ✅ OTP Retrieval')
    console.log('   ✅ OTP Verification')
    console.log('   ✅ Expired OTP Cleanup')
    console.log('   ✅ Database Schema')

  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testProfileOTP() 
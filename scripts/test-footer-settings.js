const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testFooterSettings() {
  console.log('🔍 Testing Footer Settings API...')
  
  try {
    // 1. Check database state
    console.log('\n📊 Database State:')
    const footerSettings = await prisma.footerSettings.findFirst()
    
    if (footerSettings) {
      console.log('✅ Found existing footer settings:')
      console.log(`   - Logo URL: ${footerSettings.logoUrl}`)
      console.log(`   - Description: ${footerSettings.description.substring(0, 50)}...`)
      console.log(`   - Phone: ${footerSettings.phoneNumber}`)
      console.log(`   - Email: ${footerSettings.email}`)
    } else {
      console.log('⚠️  No footer settings found in database')
    }
    
    // 2. Test GET endpoint
    console.log('\n🌐 Testing GET endpoint...')
    const getResponse = await fetch('http://localhost:3001/api/content/footer-settings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    console.log(`GET Response Status: ${getResponse.status}`)
    
    if (getResponse.ok) {
      const data = await getResponse.json()
      console.log('✅ GET returned footer settings:', data)
    } else {
      console.log('❌ GET Error:', await getResponse.text())
    }
    
    // 3. Test PUT endpoint
    console.log('\n🔄 Testing PUT endpoint...')
    const testData = {
      logoUrl: 'https://res.cloudinary.com/test/image/upload/test-logo.png',
      logoAlt: 'Test Logo',
      description: 'Test footer description for API testing',
      phoneNumber: '+91 12345 67890',
      email: 'test@example.com',
      address: 'Test Address\nTest City\n123456'
    }
    
    const putResponse = await fetch('http://localhost:3001/api/content/footer-settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })
    
    console.log(`PUT Response Status: ${putResponse.status}`)
    
    if (putResponse.ok) {
      const updatedData = await putResponse.json()
      console.log('✅ PUT updated footer settings successfully:', updatedData)
      
      // Verify in database
      const updatedSettings = await prisma.footerSettings.findFirst()
      console.log('✅ Database updated:', updatedSettings)
    } else {
      console.log('❌ PUT Error:', await putResponse.text())
      
      // Try POST as fallback
      console.log('\n🔄 Trying POST fallback...')
      const postResponse = await fetch('http://localhost:3001/api/content/footer-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      })
      
      console.log(`POST Response Status: ${postResponse.status}`)
      
      if (postResponse.ok) {
        const updatedData = await postResponse.json()
        console.log('✅ POST updated footer settings successfully:', updatedData)
      } else {
        console.log('❌ POST Error:', await postResponse.text())
      }
    }
    
    // 4. Test OPTIONS endpoint
    console.log('\n🔧 Testing OPTIONS endpoint...')
    const optionsResponse = await fetch('http://localhost:3001/api/content/footer-settings', {
      method: 'OPTIONS',
    })
    
    console.log(`OPTIONS Response Status: ${optionsResponse.status}`)
    console.log('OPTIONS Headers:', Object.fromEntries(optionsResponse.headers.entries()))
    
    console.log('\n✅ Footer settings API test completed!')
    
  } catch (error) {
    console.error('❌ Error testing footer settings:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Wait for server to start
setTimeout(testFooterSettings, 3000) 
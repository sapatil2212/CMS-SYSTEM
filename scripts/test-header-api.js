const fetch = require('node-fetch')

async function testHeaderAPI() {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-production-url.vercel.app' 
    : 'http://localhost:3000'
  
  console.log('🧪 Testing Header API endpoints...')
  console.log('📍 Base URL:', baseUrl)
  console.log('🌍 Environment:', process.env.NODE_ENV || 'development')
  console.log('')

  try {
    // Test GET endpoint
    console.log('1. Testing GET /api/content/header...')
    const getResponse = await fetch(`${baseUrl}/api/content/header`)
    const getData = await getResponse.json()
    
    if (getResponse.ok) {
      console.log('✅ GET request successful')
      console.log('📋 Header settings:', getData)
    } else {
      console.log('❌ GET request failed:', getData)
      console.log('Status:', getResponse.status)
      console.log('Status Text:', getResponse.statusText)
    }

    console.log('\n2. Testing PUT /api/content/header...')
    const updateData = {
      logoUrl: 'https://example.com/test-logo.png',
      logoAlt: 'Test Company Logo',
      phoneNumber: '+91 98765 43210',
      email: 'test@example.com'
    }

    console.log('📤 Sending data:', updateData)

    const putResponse = await fetch(`${baseUrl}/api/content/header`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    })
    const putData = await putResponse.json()

    if (putResponse.ok) {
      console.log('✅ PUT request successful')
      console.log('📋 Updated settings:', putData)
    } else {
      console.log('❌ PUT request failed:', putData)
      console.log('Status:', putResponse.status)
      console.log('Status Text:', putResponse.statusText)
    }

    // Test GET again to verify update
    console.log('\n3. Testing GET again to verify update...')
    const getResponse2 = await fetch(`${baseUrl}/api/content/header`)
    const getData2 = await getResponse2.json()
    
    if (getResponse2.ok) {
      console.log('✅ GET request successful after update')
      console.log('📋 Updated header settings:', getData2)
    } else {
      console.log('❌ GET request failed after update:', getData2)
      console.log('Status:', getResponse2.status)
      console.log('Status Text:', getResponse2.statusText)
    }

  } catch (error) {
    console.error('❌ Error testing header API:', error.message)
    console.error('Stack trace:', error.stack)
  }
}

// Run the test
testHeaderAPI() 
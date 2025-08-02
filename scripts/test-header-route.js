async function testHeaderRoute() {
  const fetch = (await import('node-fetch')).default
  
  const baseUrl = 'https://cms-system-v2.vercel.app'
  
  console.log('🧪 Testing Header Route...')
  console.log('📍 Base URL:', baseUrl)
  console.log('🌍 Environment: production')
  console.log('')

  try {
    // Test GET endpoint
    console.log('1. Testing GET /api/content/header...')
    const getResponse = await fetch(`${baseUrl}/api/content/header`)
    
    if (getResponse.ok) {
      const getData = await getResponse.json()
      console.log('✅ GET request successful')
      console.log('📋 Header settings:', getData)
    } else {
      console.log('❌ GET request failed')
      console.log('Status:', getResponse.status)
      console.log('Status Text:', getResponse.statusText)
      const errorText = await getResponse.text()
      console.log('Error body:', errorText)
    }

    console.log('\n2. Testing PUT /api/content/header...')
    const updateData = {
      logoUrl: 'https://res.cloudinary.com/ddk4z10vi/image/upload/v1754160871/cms-uploads/vegwcjslugq3tdi6icmm.png',
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

    if (putResponse.ok) {
      const putData = await putResponse.json()
      console.log('✅ PUT request successful')
      console.log('📋 Updated settings:', putData)
    } else {
      console.log('❌ PUT request failed')
      console.log('Status:', putResponse.status)
      console.log('Status Text:', putResponse.statusText)
      const errorText = await putResponse.text()
      console.log('Error body:', errorText)
    }

    // Test POST as fallback
    console.log('\n3. Testing POST /api/content/header (fallback)...')
    const postResponse = await fetch(`${baseUrl}/api/content/header`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    })

    if (postResponse.ok) {
      const postData = await postResponse.json()
      console.log('✅ POST request successful')
      console.log('📋 Updated settings:', postData)
    } else {
      console.log('❌ POST request failed')
      console.log('Status:', postResponse.status)
      console.log('Status Text:', postResponse.statusText)
      const errorText = await postResponse.text()
      console.log('Error body:', errorText)
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
  }
}

testHeaderRoute() 
import fetch from 'node-fetch';

async function testBaseMetalAPI() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('Testing Base Metal Activation API...\n');

  try {
    // Test GET endpoint
    console.log('1. Testing GET /api/content/base-metal-activation');
    const getResponse = await fetch(`${baseUrl}/api/content/base-metal-activation`);
    console.log('GET Status:', getResponse.status);
    
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log('GET Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('GET Error:', await getResponse.text());
    }

    console.log('\n2. Testing PUT /api/content/base-metal-activation');
    const putResponse = await fetch(`${baseUrl}/api/content/base-metal-activation`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        baseMetalSlug: 'aluminium',
        isMenuActive: false
      }),
    });
    console.log('PUT Status:', putResponse.status);
    
    if (putResponse.ok) {
      const data = await putResponse.json();
      console.log('PUT Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('PUT Error:', await putResponse.text());
    }

    console.log('\n3. Testing POST /api/content/base-metal-activation (fallback)');
    const postResponse = await fetch(`${baseUrl}/api/content/base-metal-activation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        baseMetalSlug: 'aluminium',
        isMenuActive: true
      }),
    });
    console.log('POST Status:', postResponse.status);
    
    if (postResponse.ok) {
      const data = await postResponse.json();
      console.log('POST Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('POST Error:', await postResponse.text());
    }

    console.log('\n4. Testing GET again to verify changes');
    const getResponse2 = await fetch(`${baseUrl}/api/content/base-metal-activation`);
    console.log('GET Status:', getResponse2.status);
    
    if (getResponse2.ok) {
      const data = await getResponse2.json();
      console.log('GET Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('GET Error:', await getResponse2.text());
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testBaseMetalAPI(); 
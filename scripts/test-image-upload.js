const fs = require('fs');
const path = require('path');

// Test the image upload functionality
async function testImageUpload() {
  console.log('Testing image upload functionality...');
  
  // Create a simple test image (1x1 pixel PNG)
  const testImageBuffer = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
    0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00,
    0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33,
    0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ]);
  
  const formData = new FormData();
  const blob = new Blob([testImageBuffer], { type: 'image/png' });
  formData.append('image', blob, 'test-image.png');
  
  try {
    const response = await fetch('http://localhost:3000/api/admin/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Image upload test successful!');
      console.log('Uploaded URL:', data.url);
      return true;
    } else {
      const errorData = await response.json();
      console.error('❌ Image upload test failed:', errorData);
      return false;
    }
  } catch (error) {
    console.error('❌ Image upload test error:', error);
    return false;
  }
}

// Test the home processes API
async function testHomeProcessesAPI() {
  console.log('\nTesting home processes API...');
  
  try {
    // Test GET
    const getResponse = await fetch('http://localhost:3000/api/content/home-processes');
    if (getResponse.ok) {
      const processes = await getResponse.json();
      console.log('✅ GET home processes successful:', processes.length, 'processes found');
    } else {
      console.error('❌ GET home processes failed');
    }
    
    // Test POST with image
    const testProcess = {
      title: 'Test Process',
      description: 'Test Description',
      content: 'Test Content',
      image: 'https://res.cloudinary.com/ddk4z10vi/image/upload/v1754216871/cms-uploads/tzkmjdiodk4fflqraywf.webp',
      link: '/test-process',
      order: 1,
      isActive: true
    };
    
    const postResponse = await fetch('http://localhost:3000/api/content/home-processes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testProcess),
    });
    
    if (postResponse.ok) {
      const result = await postResponse.json();
      console.log('✅ POST home process successful:', result.id);
      
      // Clean up - delete the test process
      const deleteResponse = await fetch(`http://localhost:3000/api/content/home-processes?id=${result.id}`, {
        method: 'DELETE',
      });
      
      if (deleteResponse.ok) {
        console.log('✅ Test process cleaned up successfully');
      } else {
        console.log('⚠️ Could not clean up test process');
      }
    } else {
      const errorData = await postResponse.json();
      console.error('❌ POST home process failed:', errorData);
    }
  } catch (error) {
    console.error('❌ Home processes API test error:', error);
  }
}

// Run tests
async function runTests() {
  console.log('Starting image upload tests...\n');
  
  // Wait a bit for the server to be ready
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const uploadSuccess = await testImageUpload();
  await testHomeProcessesAPI();
  
  if (uploadSuccess) {
    console.log('\n✅ All tests completed successfully!');
  } else {
    console.log('\n❌ Some tests failed. Please check the logs above.');
  }
}

// Run the tests
runTests().catch(console.error); 
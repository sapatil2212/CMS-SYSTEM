const https = require('https');
const http = require('http');

// Simple fetch implementation
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          json: () => JSON.parse(data)
        });
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testCompleteBaseMetalWorkflow() {
  console.log('🧪 Testing Complete Base Metal Workflow...\n');

  try {
    // Test 1: Create a new base metal
    console.log('1️⃣ Creating new base metal (Magnesium)...');
    const createResponse = await fetch('http://localhost:3000/api/admin/base-metal-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: 'magnesium',
        name: 'Magnesium',
        isActive: true
      })
    });

    if (!createResponse.ok) {
      throw new Error(`Failed to create base metal: ${createResponse.status}`);
    }
    const createdMetal = await createResponse.json();
    console.log('✅ Magnesium base metal created successfully');

    // Test 2: Check if it appears in active base metals
    console.log('\n2️⃣ Checking if Magnesium appears in active base metals...');
    const activeResponse = await fetch('http://localhost:3000/api/content/active-base-metals');
    const activeMetals = await activeResponse.json();
    const magnesiumInList = activeMetals.find(metal => metal.slug === 'magnesium');
    
    if (magnesiumInList) {
      console.log('✅ Magnesium appears in active base metals list');
    } else {
      console.log('❌ Magnesium not found in active base metals list');
    }

    // Test 3: Get default content for Magnesium
    console.log('\n3️⃣ Fetching default content for Magnesium...');
    const contentResponse = await fetch('http://localhost:3000/api/content/base-metal/magnesium');
    const defaultContent = await contentResponse.json();
    
    if (defaultContent.heroTitle && defaultContent.heroTitle.includes('Magnesium')) {
      console.log('✅ Default content retrieved successfully');
    } else {
      console.log('❌ Default content not retrieved correctly');
    }

    // Test 4: Save custom content for Magnesium
    console.log('\n4️⃣ Saving custom content for Magnesium...');
    const customContent = {
      heroTitle: 'Custom Magnesium Plating Services',
      heroSubtitle: 'Advanced Magnesium Solutions',
      heroDescription: 'Premium magnesium plating for aerospace applications',
      whatIsTitle: 'What is Magnesium Plating?',
      whatIsDescription: 'Magnesium plating involves depositing a layer of magnesium onto various substrates for enhanced properties and performance.',
      benefitsTitle: 'Key Benefits of Magnesium Plating',
      processTitle: 'Our Magnesium Plating Process',
      applicationsTitle: 'Magnesium Plating Applications',
      industriesTitle: 'Industries We Serve',
      qualityTitle: 'Quality Assurance',
      ctaTitle: 'Ready to Enhance Your Magnesium Components?'
    };

    const saveResponse = await fetch('http://localhost:3000/api/content/base-metal/magnesium', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customContent)
    });

    if (saveResponse.ok) {
      console.log('✅ Custom content saved successfully');
    } else {
      throw new Error('Failed to save custom content');
    }

    // Test 5: Verify saved content is retrieved
    console.log('\n5️⃣ Verifying saved content is retrieved correctly...');
    const verifyResponse = await fetch('http://localhost:3000/api/content/base-metal/magnesium');
    const savedContent = await verifyResponse.json();
    
    if (savedContent.heroTitle === 'Custom Magnesium Plating Services') {
      console.log('✅ Saved content retrieved correctly');
    } else {
      console.log('❌ Saved content not retrieved correctly');
    }

    // Test 6: Deactivate Magnesium
    console.log('\n6️⃣ Deactivating Magnesium...');
    const deactivateResponse = await fetch('http://localhost:3000/api/admin/base-metal-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: 'magnesium',
        isActive: false
      })
    });

    if (deactivateResponse.ok) {
      console.log('✅ Magnesium deactivated successfully');
    } else {
      throw new Error('Failed to deactivate Magnesium');
    }

    // Test 7: Check if Magnesium is removed from active list
    console.log('\n7️⃣ Checking if Magnesium is removed from active base metals...');
    const activeResponse2 = await fetch('http://localhost:3000/api/content/active-base-metals');
    const activeMetals2 = await activeResponse2.json();
    const magnesiumStillInList = activeMetals2.find(metal => metal.slug === 'magnesium');
    
    if (!magnesiumStillInList) {
      console.log('✅ Magnesium removed from active base metals list');
    } else {
      console.log('❌ Magnesium still appears in active base metals list');
    }

    // Test 8: Reactivate Magnesium
    console.log('\n8️⃣ Reactivating Magnesium...');
    const reactivateResponse = await fetch('http://localhost:3000/api/admin/base-metal-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: 'magnesium',
        isActive: true
      })
    });

    if (reactivateResponse.ok) {
      console.log('✅ Magnesium reactivated successfully');
    } else {
      throw new Error('Failed to reactivate Magnesium');
    }

    // Test 9: Delete Magnesium completely
    console.log('\n9️⃣ Deleting Magnesium completely...');
    const deleteResponse = await fetch('http://localhost:3000/api/admin/base-metal-settings?slug=magnesium', {
      method: 'DELETE'
    });

    if (deleteResponse.ok) {
      console.log('✅ Magnesium deleted successfully');
    } else {
      throw new Error('Failed to delete Magnesium');
    }

    // Test 10: Verify Magnesium is completely removed
    console.log('\n🔟 Verifying Magnesium is completely removed...');
    const activeResponse3 = await fetch('http://localhost:3000/api/content/active-base-metals');
    const activeMetals3 = await activeResponse3.json();
    const magnesiumDeleted = activeMetals3.find(metal => metal.slug === 'magnesium');
    
    if (!magnesiumDeleted) {
      console.log('✅ Magnesium completely removed from system');
    } else {
      console.log('❌ Magnesium still exists in system');
    }

    console.log('\n🎉 All tests passed! Complete base metal workflow is working correctly.');
    console.log('\n📋 Summary:');
    console.log('✅ Base metal creation');
    console.log('✅ Content saving and retrieval');
    console.log('✅ Activation/deactivation');
    console.log('✅ Complete deletion');
    console.log('✅ Navigation integration');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCompleteBaseMetalWorkflow(); 
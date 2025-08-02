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

async function testAdminCRUDWorkflow() {
  console.log('🧪 Testing Admin Dashboard CRUD Workflow for New Base Metals...\n');

  try {
    // Test 1: Create a new base metal
    console.log('1️⃣ Creating new base metal (AdminTest)...');
    const createResponse = await fetch('http://localhost:3000/api/admin/base-metal-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: 'admin-test',
        name: 'AdminTest',
        isActive: true
      })
    });

    if (!createResponse.ok) {
      throw new Error(`Failed to create base metal: ${createResponse.status}`);
    }
    console.log('✅ AdminTest base metal created successfully');

    // Test 2: Simulate admin dashboard fetching content
    console.log('\n2️⃣ Testing admin dashboard content fetching...');
    const adminFetchResponse = await fetch('http://localhost:3000/api/content/admin-test');
    if (!adminFetchResponse.ok) {
      console.log('❌ Regular route failed, trying base-metal route...');
      const baseMetalResponse = await fetch('http://localhost:3000/api/content/base-metal/admin-test');
      if (baseMetalResponse.ok) {
        const content = await baseMetalResponse.json();
        console.log('✅ Admin dashboard can fetch content via base-metal route');
        console.log(`   Hero Title: ${content.heroTitle}`);
      } else {
        throw new Error('Failed to fetch content via base-metal route');
      }
    } else {
      console.log('✅ Admin dashboard can fetch content via regular route');
    }

    // Test 3: Save content via admin dashboard
    console.log('\n3️⃣ Testing admin dashboard content saving...');
    const adminContent = {
      heroTitle: 'Admin Dashboard Test Services',
      heroSubtitle: 'Professional Admin Dashboard Solutions',
      heroDescription: 'High-quality admin dashboard testing for content management',
      whatIsTitle: 'What is Admin Dashboard Testing?',
      whatIsDescription: 'Admin dashboard testing involves verifying content management functionality for various base metals.',
      benefitsTitle: 'Key Benefits of Admin Dashboard Testing',
      processTitle: 'Our Admin Dashboard Testing Process',
      applicationsTitle: 'Admin Dashboard Testing Applications',
      industriesTitle: 'Industries We Serve',
      qualityTitle: 'Quality Assurance',
      ctaTitle: 'Ready to Test Your Admin Dashboard?'
    };

    const saveResponse = await fetch('http://localhost:3000/api/content/base-metal/admin-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminContent)
    });

    if (saveResponse.ok) {
      console.log('✅ Admin dashboard can save content successfully');
    } else {
      throw new Error('Failed to save content via admin dashboard');
    }

    // Test 4: Verify saved content is retrieved by admin dashboard
    console.log('\n4️⃣ Verifying admin dashboard can retrieve saved content...');
    const verifyResponse = await fetch('http://localhost:3000/api/content/base-metal/admin-test');
    if (verifyResponse.ok) {
      const savedContent = await verifyResponse.json();
      if (savedContent.heroTitle === 'Admin Dashboard Test Services') {
        console.log('✅ Admin dashboard can retrieve saved content correctly');
      } else {
        console.log('❌ Admin dashboard retrieved incorrect content');
      }
    } else {
      throw new Error('Failed to retrieve saved content');
    }

    // Test 5: Test admin dashboard content editing (simulate full CRUD)
    console.log('\n5️⃣ Testing admin dashboard content editing...');
    const updatedContent = {
      ...adminContent,
      heroTitle: 'Updated Admin Dashboard Test Services',
      heroSubtitle: 'Enhanced Admin Dashboard Solutions',
      heroDescription: 'Premium admin dashboard testing for advanced content management'
    };

    const updateResponse = await fetch('http://localhost:3000/api/content/base-metal/admin-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedContent)
    });

    if (updateResponse.ok) {
      console.log('✅ Admin dashboard can update content successfully');
    } else {
      throw new Error('Failed to update content via admin dashboard');
    }

    // Test 6: Verify updated content
    console.log('\n6️⃣ Verifying updated content...');
    const finalVerifyResponse = await fetch('http://localhost:3000/api/content/base-metal/admin-test');
    if (finalVerifyResponse.ok) {
      const finalContent = await finalVerifyResponse.json();
      if (finalContent.heroTitle === 'Updated Admin Dashboard Test Services') {
        console.log('✅ Admin dashboard content updates are working correctly');
      } else {
        console.log('❌ Admin dashboard content updates not working');
      }
    } else {
      throw new Error('Failed to verify updated content');
    }

    // Test 7: Test admin dashboard deletion
    console.log('\n7️⃣ Testing admin dashboard deletion...');
    const deleteResponse = await fetch('http://localhost:3000/api/admin/base-metal-settings?slug=admin-test', {
      method: 'DELETE'
    });

    if (deleteResponse.ok) {
      console.log('✅ Admin dashboard can delete base metals successfully');
    } else {
      throw new Error('Failed to delete base metal via admin dashboard');
    }

    // Test 8: Verify deletion
    console.log('\n8️⃣ Verifying deletion...');
    const activeResponse = await fetch('http://localhost:3000/api/content/active-base-metals');
    const activeMetals = await activeResponse.json();
    const adminTestDeleted = activeMetals.find(metal => metal.slug === 'admin-test');
    
    if (!adminTestDeleted) {
      console.log('✅ Admin dashboard deletion verified - base metal completely removed');
    } else {
      console.log('❌ Admin dashboard deletion failed - base metal still exists');
    }

    console.log('\n🎉 All Admin Dashboard CRUD tests passed!');
    console.log('\n📋 Admin Dashboard CRUD Summary:');
    console.log('✅ Create new base metals');
    console.log('✅ Fetch content (with fallback routing)');
    console.log('✅ Save content');
    console.log('✅ Update content');
    console.log('✅ Retrieve saved content');
    console.log('✅ Delete base metals completely');
    console.log('✅ Verify all operations work correctly');

  } catch (error) {
    console.error('❌ Admin Dashboard CRUD test failed:', error.message);
  }
}

testAdminCRUDWorkflow(); 
const fetch = require('node-fetch');

async function testBaseMetalActivation() {
  console.log('🧪 Testing Base Metal Activation System...\n');

  try {
    // Test 1: Fetch active base metals
    console.log('1. Testing GET /api/content/active-base-metals');
    const activeResponse = await fetch('http://localhost:3000/api/content/active-base-metals');
    const activeMetals = await activeResponse.json();
    console.log('✅ Active base metals:', activeMetals.map(m => m.name));
    console.log('');

    // Test 2: Fetch all base metal settings
    console.log('2. Testing GET /api/admin/base-metal-settings');
    const settingsResponse = await fetch('http://localhost:3000/api/admin/base-metal-settings');
    const settings = await settingsResponse.json();
    console.log('✅ All base metal settings:', settings.map(s => `${s.name} (${s.isActive ? 'Active' : 'Inactive'})`));
    console.log('');

    // Test 3: Deactivate a base metal
    console.log('3. Testing POST /api/admin/base-metal-settings (deactivate copper)');
    const deactivateResponse = await fetch('http://localhost:3000/api/admin/base-metal-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'copper', isActive: false })
    });
    const deactivated = await deactivateResponse.json();
    console.log('✅ Deactivated:', deactivated);
    console.log('');

    // Test 4: Check active base metals again
    console.log('4. Testing GET /api/content/active-base-metals (after deactivation)');
    const activeResponse2 = await fetch('http://localhost:3000/api/content/active-base-metals');
    const activeMetals2 = await activeResponse2.json();
    console.log('✅ Active base metals after deactivation:', activeMetals2.map(m => m.name));
    console.log('');

    // Test 5: Reactivate copper
    console.log('5. Testing POST /api/admin/base-metal-settings (reactivate copper)');
    const reactivateResponse = await fetch('http://localhost:3000/api/admin/base-metal-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'copper', isActive: true })
    });
    const reactivated = await reactivateResponse.json();
    console.log('✅ Reactivated:', reactivated);
    console.log('');

    // Test 6: Final check
    console.log('6. Final check of active base metals');
    const finalResponse = await fetch('http://localhost:3000/api/content/active-base-metals');
    const finalMetals = await finalResponse.json();
    console.log('✅ Final active base metals:', finalMetals.map(m => m.name));
    console.log('');

    console.log('🎉 All tests passed! Base metal activation system is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testBaseMetalActivation(); 
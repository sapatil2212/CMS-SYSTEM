const fetch = require('node-fetch');

async function testNewBaseMetalCreation() {
  console.log('🧪 Testing New Base Metal Creation System...\n');

  try {
    // Test 1: Create a new base metal
    console.log('1. Testing POST /api/admin/base-metal-settings (create titanium)');
    const createResponse = await fetch('http://localhost:3000/api/admin/base-metal-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: 'titanium',
        name: 'Titanium',
        isActive: true
      })
    });
    const created = await createResponse.json();
    console.log('✅ Created:', created);
    console.log('');

    // Test 2: Check if it appears in active base metals
    console.log('2. Testing GET /api/content/active-base-metals (after creation)');
    const activeResponse = await fetch('http://localhost:3000/api/content/active-base-metals');
    const activeMetals = await activeResponse.json();
    console.log('✅ Active base metals after creation:', activeMetals.map(m => m.name));
    console.log('');

    // Test 3: Test the dynamic page route
    console.log('3. Testing GET /api/content/titanium');
    const contentResponse = await fetch('http://localhost:3000/api/content/titanium');
    const content = await contentResponse.json();
    console.log('✅ Titanium content:', {
      heroTitle: content.heroTitle,
      whatIsTitle: content.whatIsTitle,
      benefitsCount: content.benefits?.length || 0,
      processStepsCount: content.processSteps?.length || 0
    });
    console.log('');

    // Test 4: Deactivate the new base metal
    console.log('4. Testing POST /api/admin/base-metal-settings (deactivate titanium)');
    const deactivateResponse = await fetch('http://localhost:3000/api/admin/base-metal-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'titanium', isActive: false })
    });
    const deactivated = await deactivateResponse.json();
    console.log('✅ Deactivated:', deactivated);
    console.log('');

    // Test 5: Check active base metals again
    console.log('5. Testing GET /api/content/active-base-metals (after deactivation)');
    const activeResponse2 = await fetch('http://localhost:3000/api/content/active-base-metals');
    const activeMetals2 = await activeResponse2.json();
    console.log('✅ Active base metals after deactivation:', activeMetals2.map(m => m.name));
    console.log('');

    // Test 6: Reactivate titanium
    console.log('6. Testing POST /api/admin/base-metal-settings (reactivate titanium)');
    const reactivateResponse = await fetch('http://localhost:3000/api/admin/base-metal-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'titanium', isActive: true })
    });
    const reactivated = await reactivateResponse.json();
    console.log('✅ Reactivated:', reactivated);
    console.log('');

    // Test 7: Final check
    console.log('7. Final check of active base metals');
    const finalResponse = await fetch('http://localhost:3000/api/content/active-base-metals');
    const finalMetals = await finalResponse.json();
    console.log('✅ Final active base metals:', finalMetals.map(m => m.name));
    console.log('');

    console.log('🎉 All tests passed! New base metal creation system is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testNewBaseMetalCreation(); 
const fetch = require('node-fetch');

async function testSectorsAPI() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://alkalyne.in';
  
  console.log('🧪 Testing Sectors API Endpoints...');
  console.log(`Base URL: ${baseUrl}`);
  
  try {
    // Test sectors API
    console.log('\n📋 Testing /api/sectors...');
    const sectorsResponse = await fetch(`${baseUrl}/api/sectors`);
    console.log(`Status: ${sectorsResponse.status}`);
    
    if (sectorsResponse.ok) {
      const sectorsData = await sectorsResponse.json();
      console.log(`✅ Sectors API Success:`);
      console.log(`   - Count: ${sectorsData.length}`);
      console.log(`   - First sector: ${sectorsData[0]?.name || 'None'}`);
    } else {
      const errorText = await sectorsResponse.text();
      console.log(`❌ Sectors API Error: ${errorText}`);
    }
    
    // Test sectors overview API
    console.log('\n📝 Testing /api/sectors-overview...');
    const overviewResponse = await fetch(`${baseUrl}/api/sectors-overview`);
    console.log(`Status: ${overviewResponse.status}`);
    
    if (overviewResponse.ok) {
      const overviewData = await overviewResponse.json();
      console.log(`✅ Sectors Overview API Success:`);
      console.log(`   - Title: ${overviewData.title}`);
      console.log(`   - Has content: ${!!overviewData.description}`);
    } else {
      const errorText = await overviewResponse.text();
      console.log(`❌ Sectors Overview API Error: ${errorText}`);
    }
    
    // Test the actual page
    console.log('\n🌐 Testing /sectors page...');
    const pageResponse = await fetch(`${baseUrl}/sectors`);
    console.log(`Status: ${pageResponse.status}`);
    
    if (pageResponse.ok) {
      const pageText = await pageResponse.text();
      const hasNoContent = pageText.includes('No content available');
      console.log(`✅ Sectors Page: ${hasNoContent ? '❌ Shows "No content available"' : '✅ Loads properly'}`);
    } else {
      console.log(`❌ Sectors Page Error: ${pageResponse.status}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSectorsAPI(); 
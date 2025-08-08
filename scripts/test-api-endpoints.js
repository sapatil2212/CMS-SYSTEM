#!/usr/bin/env node

/**
 * API Endpoint Testing Script
 * Tests the main API endpoints to identify deployment issues
 */

const fetch = require('node-fetch');

async function testAPIEndpoints() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing API Endpoints...');
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
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPIEndpoints();
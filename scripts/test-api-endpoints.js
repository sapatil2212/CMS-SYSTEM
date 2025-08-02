#!/usr/bin/env node

/**
 * API Endpoint Testing Script
 * Tests the main API endpoints to identify deployment issues
 */

const fetch = require('node-fetch');

const BASE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

async function testAPIEndpoints() {
  console.log('Testing API endpoints...');
  console.log('Base URL:', BASE_URL);

  // Test header menu GET
  try {
    console.log('\n1. Testing header menu GET...');
    const headerMenuResponse = await fetch(`${BASE_URL}/api/content/header-menu`);
    console.log('Status:', headerMenuResponse.status);
    if (headerMenuResponse.ok) {
      const data = await headerMenuResponse.json();
      console.log('Menu items count:', data.length);
    } else {
      console.log('Error:', await headerMenuResponse.text());
    }
  } catch (error) {
    console.error('Error testing header menu GET:', error.message);
  }

  // Test process activation GET
  try {
    console.log('\n2. Testing process activation GET...');
    const processResponse = await fetch(`${BASE_URL}/api/content/process-activation`);
    console.log('Status:', processResponse.status);
    if (processResponse.ok) {
      const data = await processResponse.json();
      console.log('Processes count:', data.length);
    } else {
      console.log('Error:', await processResponse.text());
    }
  } catch (error) {
    console.error('Error testing process activation GET:', error.message);
  }

  // Test header menu PUT (if we have menu items)
  try {
    console.log('\n3. Testing header menu PUT...');
    const headerMenuResponse = await fetch(`${BASE_URL}/api/content/header-menu`);
    if (headerMenuResponse.ok) {
      const menuItems = await headerMenuResponse.json();
      if (menuItems.length > 0) {
        const firstItem = menuItems[0];
        console.log('Testing with menu item:', firstItem.id);
        
        const putResponse = await fetch(`${BASE_URL}/api/content/header-menu`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            menuItemId: firstItem.id,
            isActive: !firstItem.isActive
          })
        });
        console.log('PUT Status:', putResponse.status);
        if (putResponse.ok) {
          const result = await putResponse.json();
          console.log('PUT successful:', result);
        } else {
          console.log('PUT Error:', await putResponse.text());
        }
      } else {
        console.log('No menu items to test PUT with');
      }
    }
  } catch (error) {
    console.error('Error testing header menu PUT:', error.message);
  }

  // Test process activation PUT
  try {
    console.log('\n4. Testing process activation PUT...');
    const putResponse = await fetch(`${BASE_URL}/api/content/process-activation`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        processSlug: 'copper-plating',
        isMenuActive: true
      })
    });
    console.log('PUT Status:', putResponse.status);
    if (putResponse.ok) {
      const result = await putResponse.json();
      console.log('PUT successful:', result);
    } else {
      console.log('PUT Error:', await putResponse.text());
    }
  } catch (error) {
    console.error('Error testing process activation PUT:', error.message);
  }

  console.log('\nAPI endpoint testing completed.');
}

testAPIEndpoints().catch(console.error);
// Test script to simulate admin dashboard API calls
async function testAdminMenuAPI() {
  console.log('🔍 Testing Admin Menu API...')
  
  try {
    // Test the exact API call that the admin dashboard makes
    const response = await fetch('http://localhost:3000/api/content/header-menu', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    console.log(`API Response Status: ${response.status}`)
    console.log(`API Response Headers:`, Object.fromEntries(response.headers.entries()))
    
    if (response.ok) {
      const data = await response.json()
      console.log(`✅ API returned ${data.length} menu items`)
      
      // Log the structure of the first item
      if (data.length > 0) {
        console.log('\n📋 First menu item structure:')
        console.log(JSON.stringify(data[0], null, 2))
      }
      
      // Check if all items have the expected structure
      const validItems = data.filter(item => 
        item.id && 
        item.name && 
        typeof item.isActive === 'boolean' &&
        typeof item.hasDropdown === 'boolean'
      )
      
      console.log(`\n✅ Valid menu items: ${validItems.length}/${data.length}`)
      
      if (validItems.length !== data.length) {
        console.log('⚠️  Some menu items have invalid structure!')
        data.forEach((item, index) => {
          if (!item.id || !item.name || typeof item.isActive !== 'boolean' || typeof item.hasDropdown !== 'boolean') {
            console.log(`   - Item ${index}:`, item)
          }
        })
      }
      
    } else {
      const errorText = await response.text()
      console.log('❌ API Error:', errorText)
    }
    
  } catch (error) {
    console.error('❌ Error testing admin menu API:', error)
  }
}

// Wait a bit for the server to start
setTimeout(testAdminMenuAPI, 3000) 
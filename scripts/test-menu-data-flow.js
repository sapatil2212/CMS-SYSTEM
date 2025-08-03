// Test the data flow from API to component
async function testMenuDataFlow() {
  console.log('🔍 Testing Menu Data Flow...')
  
  try {
    // Simulate the exact API call
    const response = await fetch('http://localhost:3000/api/content/header-menu', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log(`✅ API returned ${data.length} items`)
      
      // Check if the data matches the expected interface
      const expectedStructure = {
        id: 'string',
        name: 'string', 
        href: 'string',
        order: 'number',
        isActive: 'boolean',
        hasDropdown: 'boolean',
        dropdownItems: 'array'
      }
      
      console.log('\n📋 Checking data structure...')
      
      if (data.length > 0) {
        const firstItem = data[0]
        console.log('First item keys:', Object.keys(firstItem))
        
        // Check if all required fields exist
        const requiredFields = ['id', 'name', 'href', 'order', 'isActive', 'hasDropdown', 'dropdownItems']
        const missingFields = requiredFields.filter(field => !(field in firstItem))
        
        if (missingFields.length > 0) {
          console.log('❌ Missing fields:', missingFields)
        } else {
          console.log('✅ All required fields present')
        }
        
        // Check data types
        console.log('\n🔍 Data type validation:')
        console.log(`  - id: ${typeof firstItem.id} (${firstItem.id ? 'valid' : 'invalid'})`)
        console.log(`  - name: ${typeof firstItem.name} (${firstItem.name ? 'valid' : 'invalid'})`)
        console.log(`  - isActive: ${typeof firstItem.isActive} (${typeof firstItem.isActive === 'boolean' ? 'valid' : 'invalid'})`)
        console.log(`  - hasDropdown: ${typeof firstItem.hasDropdown} (${typeof firstItem.hasDropdown === 'boolean' ? 'valid' : 'invalid'})`)
        console.log(`  - dropdownItems: ${Array.isArray(firstItem.dropdownItems) ? 'valid array' : 'invalid'}`)
        
        // Check if any items have isActive: false
        const inactiveItems = data.filter(item => !item.isActive)
        console.log(`\n⚠️  Inactive items: ${inactiveItems.length}`)
        if (inactiveItems.length > 0) {
          inactiveItems.forEach(item => console.log(`   - ${item.name}`))
        }
        
        // Check if any items have hasDropdown: true but no dropdown items
        const itemsWithEmptyDropdowns = data.filter(item => item.hasDropdown && (!item.dropdownItems || item.dropdownItems.length === 0))
        console.log(`\n⚠️  Items with empty dropdowns: ${itemsWithEmptyDropdowns.length}`)
        if (itemsWithEmptyDropdowns.length > 0) {
          itemsWithEmptyDropdowns.forEach(item => console.log(`   - ${item.name}`))
        }
      }
      
    } else {
      console.log('❌ API Error:', await response.text())
    }
    
  } catch (error) {
    console.error('❌ Error testing data flow:', error)
  }
}

// Wait for server to start
setTimeout(testMenuDataFlow, 5000) 
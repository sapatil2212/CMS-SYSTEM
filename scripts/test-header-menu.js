const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testHeaderMenu() {
  console.log('🔍 Testing Header Menu Functionality...')
  
  try {
    // 1. Check if menu items exist in database
    console.log('\n📊 Checking database for header menu items...')
    const menuItems = await prisma.headerMenuItem.findMany({
      include: {
        dropdownItems: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })
    
    console.log(`Found ${menuItems.length} menu items in database:`)
    menuItems.forEach(item => {
      console.log(`  - ${item.name} (${item.isActive ? 'Active' : 'Inactive'}) - ${item.dropdownItems.length} dropdown items`)
    })
    
    // 2. Test API endpoint
    console.log('\n🌐 Testing API endpoint...')
    const response = await fetch('http://localhost:3000/api/content/header-menu')
    console.log(`API Status: ${response.status}`)
    
    if (response.ok) {
      const data = await response.json()
      console.log(`API returned ${data.length} menu items`)
      console.log('First menu item:', data[0])
    } else {
      console.log('API Error:', await response.text())
    }
    
    // 3. Check if any menu items are active
    const activeMenuItems = menuItems.filter(item => item.isActive)
    console.log(`\n✅ Active menu items: ${activeMenuItems.length}/${menuItems.length}`)
    
    if (activeMenuItems.length === 0) {
      console.log('⚠️  No active menu items found! This might be the issue.')
      console.log('💡 Try activating some menu items in the admin dashboard.')
    }
    
  } catch (error) {
    console.error('❌ Error testing header menu:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testHeaderMenu() 
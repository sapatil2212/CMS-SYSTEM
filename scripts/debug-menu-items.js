const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function debugMenuItems() {
  console.log('🔍 Detailed Menu Items Debug...')
  
  try {
    // Get all menu items with dropdown items
    const menuItems = await prisma.headerMenuItem.findMany({
      include: {
        dropdownItems: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })
    
    console.log(`\n📊 Found ${menuItems.length} menu items:`)
    
    menuItems.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.name}`)
      console.log(`   - ID: ${item.id}`)
      console.log(`   - Href: ${item.href}`)
      console.log(`   - Order: ${item.order}`)
      console.log(`   - Active: ${item.isActive}`)
      console.log(`   - Has Dropdown: ${item.hasDropdown}`)
      console.log(`   - Dropdown Items: ${item.dropdownItems.length}`)
      
      if (item.dropdownItems.length > 0) {
        console.log('   - Dropdown Items:')
        item.dropdownItems.forEach(dropdown => {
          console.log(`     * ${dropdown.name} (${dropdown.isActive ? 'Active' : 'Inactive'}) - ${dropdown.href}`)
        })
      }
    })
    
    // Check for any issues
    const inactiveItems = menuItems.filter(item => !item.isActive)
    const itemsWithoutDropdown = menuItems.filter(item => item.hasDropdown && item.dropdownItems.length === 0)
    
    if (inactiveItems.length > 0) {
      console.log(`\n⚠️  Found ${inactiveItems.length} inactive menu items:`)
      inactiveItems.forEach(item => console.log(`   - ${item.name}`))
    }
    
    if (itemsWithoutDropdown.length > 0) {
      console.log(`\n⚠️  Found ${itemsWithoutDropdown.length} items with hasDropdown=true but no dropdown items:`)
      itemsWithoutDropdown.forEach(item => console.log(`   - ${item.name}`))
    }
    
    console.log('\n✅ Database looks healthy!')
    
  } catch (error) {
    console.error('❌ Error debugging menu items:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugMenuItems() 
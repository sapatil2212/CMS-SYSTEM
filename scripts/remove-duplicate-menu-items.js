const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function removeDuplicateMenuItems() {
  console.log('🔍 Checking for duplicate menu items...')

  try {
    // Get all menu items
    const allMenuItems = await prisma.headerMenuItem.findMany({
      include: {
        dropdownItems: true
      },
      orderBy: { order: 'asc' }
    })

    console.log(`📊 Found ${allMenuItems.length} total menu items`)

    // Group by name to find duplicates
    const menuItemsByName = {}
    const duplicates = []

    allMenuItems.forEach(item => {
      if (!menuItemsByName[item.name]) {
        menuItemsByName[item.name] = []
      }
      menuItemsByName[item.name].push(item)
    })

    // Find duplicates
    Object.keys(menuItemsByName).forEach(name => {
      const items = menuItemsByName[name]
      if (items.length > 1) {
        console.log(`⚠️ Found ${items.length} duplicate items for "${name}":`)
        items.forEach((item, index) => {
          console.log(`   ${index + 1}. ID: ${item.id}, Order: ${item.order}, Active: ${item.isActive}`)
        })
        duplicates.push(...items.slice(1)) // Keep the first one, mark others as duplicates
      }
    })

    if (duplicates.length === 0) {
      console.log('✅ No duplicate menu items found')
      return
    }

    console.log(`\n🗑️ Found ${duplicates.length} duplicate menu items to remove:`)
    duplicates.forEach(item => {
      console.log(`   - ${item.name} (ID: ${item.id})`)
    })

    // Remove duplicates
    console.log('\n🗑️ Removing duplicate menu items...')
    for (const duplicate of duplicates) {
      // Delete dropdown items first (due to foreign key constraint)
      await prisma.headerMenuDropdownItem.deleteMany({
        where: { menuItemId: duplicate.id }
      })

      // Delete the menu item
      await prisma.headerMenuItem.delete({
        where: { id: duplicate.id }
      })

      console.log(`   ✅ Removed duplicate: ${duplicate.name} (ID: ${duplicate.id})`)
    }

    // Verify the cleanup
    const remainingMenuItems = await prisma.headerMenuItem.findMany({
      include: {
        dropdownItems: true
      },
      orderBy: { order: 'asc' }
    })

    console.log(`\n📊 After cleanup:`)
    console.log(`   - Total menu items: ${remainingMenuItems.length}`)
    console.log(`   - Active menu items: ${remainingMenuItems.filter(item => item.isActive).length}`)

    console.log('\n📋 Remaining menu items:')
    remainingMenuItems.forEach(item => {
      console.log(`   - ${item.name} (Order: ${item.order}, Active: ${item.isActive}, Dropdown items: ${item.dropdownItems.length})`)
    })

    console.log('\n✅ Duplicate menu items removed successfully!')
  } catch (error) {
    console.error('❌ Error removing duplicate menu items:', error)
    throw error
  }
}

removeDuplicateMenuItems()
  .catch((e) => {
    console.error('❌ Error removing duplicates:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
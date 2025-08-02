const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixHeaderMenu() {
  console.log('🔧 Fixing header menu items in production...')

  try {
    // Check if menu items already exist
    const existingMenuItems = await prisma.headerMenuItem.findFirst()

    if (!existingMenuItems) {
      console.log('📝 Creating header menu items...')
      
      // Create default menu items
      const menuItems = [
        {
          name: 'Home',
          href: '/',
          order: 1,
          isActive: true,
          hasDropdown: false
        },
        {
          name: 'About',
          href: '/about',
          order: 2,
          isActive: true,
          hasDropdown: false
        },
        {
          name: 'Processes',
          href: '#',
          order: 3,
          isActive: true,
          hasDropdown: true
        },
        {
          name: 'Base Metals',
          href: '#',
          order: 4,
          isActive: true,
          hasDropdown: true
        },
        {
          name: 'Sectors',
          href: '#',
          order: 5,
          isActive: true,
          hasDropdown: true
        },
        {
          name: 'Quality Testing',
          href: '/quality-testing',
          order: 6,
          isActive: true,
          hasDropdown: false
        },
        {
          name: 'Contact',
          href: '/contact',
          order: 7,
          isActive: true,
          hasDropdown: false
        }
      ]

      for (const menuItem of menuItems) {
        const createdMenuItem = await prisma.headerMenuItem.create({
          data: menuItem
        })

        // Add dropdown items for specific menu items
        if (menuItem.name === 'Processes') {
          const processDropdownItems = [
            { name: 'Silver Plating', href: '/processes/silver-plating', order: 1 },
            { name: 'Busbar Plating', href: '/processes/busbar-plating', order: 2 },
            { name: 'Zinc Plating & Colour Passivates', href: '/processes/zinc-plating', order: 3 },
            { name: 'Gold Plating', href: '/processes/gold-plating', order: 4 },
            { name: 'Copper Plating', href: '/processes/copper-plating', order: 5 },
            { name: 'Nickel Plating', href: '/processes/nickel-plating', order: 6 },
            { name: 'Electroless Nickel Plating', href: '/processes/electroless-nickel-plating', order: 7 },
            { name: 'Bright Tin Plating', href: '/processes/bright-tin-plating', order: 8 },
            { name: 'Dull Tin Plating', href: '/processes/dull-tin-plating', order: 9 },
            { name: 'Rack & Barrel Plating', href: '/processes/rack-barrel-plating', order: 10 },
            { name: 'Zinc Flake Coating', href: '/processes/zinc-flake-coating', order: 11 },
            { name: 'Molykote', href: '/processes/molykote', order: 12 }
          ]

          for (const dropdownItem of processDropdownItems) {
            await prisma.headerMenuDropdownItem.create({
              data: {
                ...dropdownItem,
                menuItemId: createdMenuItem.id
              }
            })
          }
        }

        if (menuItem.name === 'Base Metals') {
          const baseMetalsDropdownItems = [
            { name: 'Aluminium', href: '/basemetals/aluminium', order: 1 },
            { name: 'Copper', href: '/basemetals/copper', order: 2 },
            { name: 'Stainless Steel', href: '/basemetals/stainless-steel', order: 3 },
            { name: 'Carbon Steel', href: '/basemetals/carbon-steel', order: 4 },
            { name: 'Brass', href: '/basemetals/brass', order: 5 }
          ]

          for (const dropdownItem of baseMetalsDropdownItems) {
            await prisma.headerMenuDropdownItem.create({
              data: {
                ...dropdownItem,
                menuItemId: createdMenuItem.id
              }
            })
          }
        }

        if (menuItem.name === 'Sectors') {
          const sectorsDropdownItems = [
            { name: 'Sectors Overview', href: '/sectors', order: 1 }
          ]

          for (const dropdownItem of sectorsDropdownItems) {
            await prisma.headerMenuDropdownItem.create({
              data: {
                ...dropdownItem,
                menuItemId: createdMenuItem.id
              }
            })
          }
        }
      }

      console.log('✅ Header menu items created successfully')
    } else {
      console.log('ℹ️ Header menu items already exist')
      
      // Check if all menu items are active
      const allMenuItems = await prisma.headerMenuItem.findMany()
      const inactiveItems = allMenuItems.filter(item => !item.isActive)
      
      if (inactiveItems.length > 0) {
        console.log('🔧 Activating inactive menu items...')
        for (const item of inactiveItems) {
          await prisma.headerMenuItem.update({
            where: { id: item.id },
            data: { isActive: true }
          })
        }
        console.log(`✅ Activated ${inactiveItems.length} menu items`)
      }
    }

    // Verify the fix
    const menuItemsCount = await prisma.headerMenuItem.count()
    const activeMenuItemsCount = await prisma.headerMenuItem.count({
      where: { isActive: true }
    })
    
    console.log(`📊 Menu items summary:`)
    console.log(`   - Total menu items: ${menuItemsCount}`)
    console.log(`   - Active menu items: ${activeMenuItemsCount}`)

    console.log('✅ Header menu fix completed!')
  } catch (error) {
    console.error('❌ Error fixing header menu items:', error)
    throw error
  }
}

fixHeaderMenu()
  .catch((e) => {
    console.error('❌ Error fixing header menu:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
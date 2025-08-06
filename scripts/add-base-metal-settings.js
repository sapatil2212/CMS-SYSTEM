const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addBaseMetalSettings() {
  try {
    console.log('🔍 Adding base metals to settings...')
    
    const baseMetals = [
      { name: 'Aluminium', slug: 'aluminium', isActive: true },
      { name: 'Copper', slug: 'copper', isActive: true },
      { name: 'Brass', slug: 'brass', isActive: true },
      { name: 'Stainless Steel', slug: 'stainless-steel', isActive: true },
      { name: 'Carbon Steel', slug: 'carbon-steel', isActive: true }
    ]
    
    for (const baseMetal of baseMetals) {
      console.log(`🔍 Adding ${baseMetal.name}...`)
      
      // Check if it already exists
      const existing = await prisma.baseMetalSettings.findUnique({
        where: { slug: baseMetal.slug }
      })
      
      if (existing) {
        console.log(`✅ ${baseMetal.name} already exists`)
      } else {
        // Create new base metal setting
        const created = await prisma.baseMetalSettings.create({
          data: baseMetal
        })
        console.log(`✅ Created ${baseMetal.name}:`, created)
      }
    }
    
    console.log('\n✅ Base metal settings added successfully!')
    
    // Verify all base metals are now in settings
    const allSettings = await prisma.baseMetalSettings.findMany()
    console.log('📊 All base metal settings:', allSettings)
    
  } catch (error) {
    console.error('❌ Error adding base metal settings:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addBaseMetalSettings() 
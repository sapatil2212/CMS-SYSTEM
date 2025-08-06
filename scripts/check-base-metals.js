const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkAndFixBaseMetals() {
  try {
    console.log('🔍 Checking base metals status...')
    
    // Check base metal settings
    const baseMetalSettings = await prisma.baseMetalSettings.findMany()
    console.log('📊 Base metal settings:', baseMetalSettings)
    
    // Check if base metals have content with isMenuActive
    const baseMetals = ['aluminium', 'copper', 'brass', 'stainless-steel', 'carbon-steel']
    
    for (const slug of baseMetals) {
      console.log(`\n🔍 Checking ${slug}...`)
      
      // Check BaseMetalContent
      const baseMetalContent = await prisma.baseMetalContent.findUnique({
        where: { slug }
      })
      
      if (baseMetalContent) {
        console.log(`✅ ${slug} has BaseMetalContent`)
        const content = baseMetalContent.content
        console.log(`Content keys:`, Object.keys(content))
        console.log(`isMenuActive:`, content.isMenuActive)
        
        // Update isMenuActive to true if not set
        if (content.isMenuActive === undefined || content.isMenuActive === null) {
          console.log(`🔄 Updating ${slug} isMenuActive to true`)
          await prisma.baseMetalContent.update({
            where: { slug },
            data: {
              content: {
                ...content,
                isMenuActive: true
              }
            }
          })
          console.log(`✅ Updated ${slug} isMenuActive`)
        }
      } else {
        console.log(`❌ ${slug} has no BaseMetalContent`)
      }
      
      // Check individual content tables
      const contentModels = {
        'aluminium': prisma.aluminiumContent,
        'copper': prisma.copperContent,
        'brass': prisma.brassContent,
        'stainless-steel': prisma.stainlessSteelContent,
        'carbon-steel': prisma.carbonSteelContent
      }
      
      const model = contentModels[slug]
      if (model) {
        const individualContent = await model.findFirst()
        if (individualContent) {
          console.log(`✅ ${slug} has individual content`)
          console.log(`isMenuActive:`, individualContent.isMenuActive)
          
          // Update isMenuActive to true if not set
          if (individualContent.isMenuActive === undefined || individualContent.isMenuActive === null) {
            console.log(`🔄 Updating ${slug} individual content isMenuActive to true`)
            await model.updateMany({
              where: {},
              data: { isMenuActive: true }
            })
            console.log(`✅ Updated ${slug} individual content isMenuActive`)
          }
        } else {
          console.log(`❌ ${slug} has no individual content`)
        }
      }
    }
    
    console.log('\n✅ Base metals check completed!')
  } catch (error) {
    console.error('❌ Error checking base metals:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAndFixBaseMetals() 
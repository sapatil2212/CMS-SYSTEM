import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing hero slider data
  await prisma.heroSlider.deleteMany({})

  // Create hero slider slides
  const heroSlides = [
    {
      title: 'Precision Plating, Engineered to Last',
      subtitle: 'Boost durability and corrosion resistance with our advanced metal finishing solutions.',
      description: 'Advanced metal finishing solutions for industrial applications that meet the highest industry standards.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop',
      mobileImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=800&fit=crop',
      ctaText: 'Contact us',
      ctaLink: '/contact',
      order: 1,
      isActive: true,
    },
    {
      title: 'Innovation in Every Layer',
      subtitle: 'Cutting-edge plating and finishing that enhance product quality and value.',
      description: 'Cutting-edge plating and finishing solutions that enhance product quality and value.',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&h=800&fit=crop',
      mobileImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=800&fit=crop',
      ctaText: 'Contact us',
      ctaLink: '/contact',
      order: 2,
      isActive: true,
    },
    {
      title: 'Surface Perfection for Every Application',
      subtitle: 'Tailored treatments that meet the toughest industry standards.',
      description: 'Tailored treatments that meet the toughest industry standards for various applications.',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&h=800&fit=crop',
      mobileImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=800&fit=crop',
      ctaText: 'Contact us',
      ctaLink: '/contact',
      order: 3,
      isActive: true,
    },
  ]

  for (const slide of heroSlides) {
    await prisma.heroSlider.create({
      data: slide,
    })
  }

  console.log('✅ Hero slider data seeded successfully!')
  console.log(`📊 Created ${heroSlides.length} hero slides`)

  // Seed copper plating content
  console.log('🌱 Seeding copper plating content...')
  
  // Check if copper plating content already exists
  const existingCopperContent = await prisma.copperPlatingContent.findFirst()
  if (!existingCopperContent) {
    // Import and run copper plating seed
    const { default: seedCopperPlating } = await import('./seed-copper-plating')
    await seedCopperPlating()
  } else {
    console.log('✅ Copper plating content already exists, skipping...')
  }

  // Seed silver plating content
  console.log('🌱 Seeding silver plating content...')
  
  // Check if silver plating content already exists
  const existingSilverContent = await prisma.silverPlatingContent.findFirst()
  if (!existingSilverContent) {
    // Import and run silver plating seed
    const { default: seedSilverPlating } = await import('./seed-silver-plating')
    await seedSilverPlating()
  } else {
    console.log('✅ Silver plating content already exists, skipping...')
  }

  // Seed gold plating content
  console.log('🌱 Seeding gold plating content...')
  
  // Check if gold plating content already exists
  const existingGoldContent = await prisma.goldPlatingContent.findFirst()
  if (!existingGoldContent) {
    // Import and run gold plating seed
    const { default: seedGoldPlating } = await import('./seed-gold-plating')
    await seedGoldPlating()
  } else {
    console.log('✅ Gold plating content already exists, skipping...')
  }

  // Seed zinc plating content
  console.log('🌱 Seeding zinc plating content...')
  const existingZincContent = await prisma.zincPlatingContent.findFirst()
  if (!existingZincContent) {
    const { default: seedZincPlating } = await import('./seed-zinc-plating')
    await seedZincPlating()
  } else {
    console.log('✅ Zinc plating content already exists, skipping...')
  }

  // Seed nickel plating content
  console.log('🌱 Seeding nickel plating content...')
  const existingNickelContent = await prisma.nickelPlatingContent.findFirst()
  if (!existingNickelContent) {
    const { default: seedNickelPlating } = await import('./seed-nickel-plating')
    await seedNickelPlating()
  } else {
    console.log('✅ Nickel plating content already exists, skipping...')
  }

  // Seed busbar plating content
  console.log('🌱 Seeding busbar plating content...')
  const existingBusbarContent = await prisma.busbarPlatingContent.findFirst()
  if (!existingBusbarContent) {
    const { default: seedBusbarPlating } = await import('./seed-busbar-plating')
    await seedBusbarPlating()
  } else {
    console.log('✅ Busbar plating content already exists, skipping...')
  }

  // Seed electroless nickel plating content
  console.log('🌱 Seeding electroless nickel plating content...')
  const existingElectrolessNickelContent = await prisma.electrolessNickelPlatingContent.findFirst()
  if (!existingElectrolessNickelContent) {
    const { default: seedElectrolessNickelPlating } = await import('./seed-electroless-nickel-plating')
    await seedElectrolessNickelPlating()
  } else {
    console.log('✅ Electroless nickel plating content already exists, skipping...')
  }

  // Seed bright tin plating content
  console.log('🌱 Seeding bright tin plating content...')
  const existingBrightTinContent = await prisma.brightTinPlatingContent.findFirst()
  if (!existingBrightTinContent) {
    const { default: seedBrightTinPlating } = await import('./seed-bright-tin-plating')
    await seedBrightTinPlating()
  } else {
    console.log('✅ Bright tin plating content already exists, skipping...')
  }

  // Seed dull tin plating content
  console.log('🌱 Seeding dull tin plating content...')
  const existingDullTinContent = await prisma.dullTinPlatingContent.findFirst()
  if (!existingDullTinContent) {
    const { default: seedDullTinPlating } = await import('./seed-dull-tin-plating')
    await seedDullTinPlating()
  } else {
    console.log('✅ Dull tin plating content already exists, skipping...')
  }

  // Seed rack barrel plating content
  console.log('🌱 Seeding rack barrel plating content...')
  const existingRackBarrelContent = await prisma.rackBarrelPlatingContent.findFirst()
  if (!existingRackBarrelContent) {
    const { default: seedRackBarrelPlating } = await import('./seed-rack-barrel-plating')
    await seedRackBarrelPlating()
  } else {
    console.log('✅ Rack barrel plating content already exists, skipping...')
  }

  // Seed zinc flake coating content
  console.log('🌱 Seeding zinc flake coating content...')
  const existingZincFlakeContent = await prisma.zincFlakeCoatingContent.findFirst()
  if (!existingZincFlakeContent) {
    const { default: seedZincFlakeCoating } = await import('./seed-zinc-flake-coating')
    await seedZincFlakeCoating()
  } else {
    console.log('✅ Zinc flake coating content already exists, skipping...')
  }

  // Seed molykote content
  console.log('🌱 Seeding molykote content...')
  const existingMolykoteContent = await prisma.molykoteContent.findFirst()
  if (!existingMolykoteContent) {
    const { default: seedMolykote } = await import('./seed-molykote')
    await seedMolykote()
  } else {
    console.log('✅ Molykote content already exists, skipping...')
  }

  // Seed base metals content
  console.log('🌱 Seeding base metals content...')
  
  // Import all base metal seeding functions
  const { seedAluminiumContent } = await import('./seed-aluminium-content')
  const { seedCopperContent } = await import('./seed-copper-content')
  const { seedBrassContent } = await import('./seed-brass-content')
  const { seedStainlessSteelContent } = await import('./seed-stainless-steel-content')
  const { seedCarbonSteelContent } = await import('./seed-carbon-steel-content')

  // Seed all base metal content
  await seedAluminiumContent()
  await seedCopperContent()
  await seedBrassContent()
  await seedStainlessSteelContent()
  await seedCarbonSteelContent()

  console.log('✅ All base metal content seeded successfully')

  // Seed header menu items
  console.log('🌱 Seeding header menu items...')
  
  // Check if header menu items already exist
  const existingMenuItems = await prisma.headerMenuItem.findFirst()
  if (!existingMenuItems) {
    // Import and run header menu items seed
    const { default: seedHeaderMenuItems } = await import('./seed-header-menu-items')
    await seedHeaderMenuItems()
  } else {
    console.log('✅ Header menu items already exist, skipping...')
  }

  console.log('✅ Header menu items seeded successfully')

  // Seed gallery content and images
  console.log('🌱 Seeding gallery content and images...')
  
  // Check if gallery content already exists
  const existingGalleryContent = await prisma.galleryContent.findFirst()
  if (!existingGalleryContent) {
    // Import and run gallery seed
    const { default: seedGallery } = await import('./seed-gallery')
    await seedGallery()
  } else {
    console.log('✅ Gallery content already exists, skipping...')
  }

  console.log('✅ Gallery content and images seeded successfully')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
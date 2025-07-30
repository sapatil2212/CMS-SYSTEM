import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding gallery content and images...')

  // Seed content
  const content = {
    title: 'Our Advanced Plating & Surface Finishing Facilities',
    subtitle: 'Precision Unleashed',
    description: 'Explore our state-of-the-art facilities and advanced plating technologies that deliver exceptional quality and precision for every project.'
  }

  // Clear existing content
  await prisma.galleryContent.deleteMany()

  // Create content
  await prisma.galleryContent.create({
    data: content
  })
  console.log('✅ Created gallery content')

  // Seed images
  const images = [
    {
      title: 'Barrel Plating Facility',
      description: 'Advanced barrel plating equipment for high-volume production with consistent quality and precision.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      order: 1,
      isActive: true
    },
    {
      title: 'Bright Tin Plating',
      description: 'Specialized bright tin plating process for electronic components and precision parts.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      order: 2,
      isActive: true
    },
    {
      title: 'Dull Tin Plating',
      description: 'Professional dull tin plating for industrial applications requiring specific surface finishes.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      order: 3,
      isActive: true
    },
    {
      title: 'OSP Coating',
      description: 'Organic Solderability Preservative coating for PCB manufacturing and electronic assembly.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      order: 4,
      isActive: true
    },
    {
      title: 'Copper Plating',
      description: 'High-quality copper plating for electrical conductivity and corrosion resistance.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      order: 5,
      isActive: true
    }
  ]

  // Clear existing images
  await prisma.galleryImage.deleteMany()

  // Create images
  for (const image of images) {
    await prisma.galleryImage.create({
      data: image
    })
    console.log(`✅ Created gallery image: ${image.title}`)
  }

  console.log('🎉 All gallery content and images seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding gallery data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
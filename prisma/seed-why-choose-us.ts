import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding why choose us content and features...')

  // Seed content
  const content = {
    title: 'Why Choose Alkalyne Surface Technologies?',
    description: 'We understand the challenges of finding a reliable, technically sound plating partner. At Alkalyne, we are committed to delivering precision, performance, and peace of mind — every time.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 5,
    ratingText: 'Decades of Experience',
    technologyText: 'Advanced Tech'
  }

  // Clear existing content
  await prisma.whyChooseUsContent.deleteMany()

  // Create content
  await prisma.whyChooseUsContent.create({
    data: content
  })
  console.log('✅ Created why choose us content')

  // Seed features
  const features = [
    {
      icon: 'Brain',
      title: 'Expert Guidance, Every Step',
      description: 'Our specialists work closely with you to define the right plating solution',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      order: 1,
      isActive: true
    },
    {
      icon: 'FlaskConical',
      title: 'Prototype to Production',
      description: 'Support from trial runs to full-scale production with qualification standards',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      order: 2,
      isActive: true
    },
    {
      icon: 'RotateCcw',
      title: 'Flexible & Scalable Solutions',
      description: 'Tailored plating lines for low-volume bespoke to high-volume batch processing',
      color: 'text-green-600',
      bg: 'bg-green-50',
      order: 3,
      isActive: true
    },
    {
      icon: 'Settings',
      title: 'Lean, Efficient & Reliable',
      description: 'Fast turnaround, consistent quality, and optimized costs',
      color: 'text-pink-600',
      bg: 'bg-pink-50',
      order: 4,
      isActive: true
    },
    {
      icon: 'Zap',
      title: 'Cutting-Edge Equipment',
      description: 'Latest cleaning, plating, and inspection technologies',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      order: 5,
      isActive: true
    },
    {
      icon: 'Truck',
      title: 'Logistics & Storage',
      description: 'In-house transport across India with secure on-site storage',
      color: 'text-red-600',
      bg: 'bg-red-50',
      order: 6,
      isActive: true
    },
    {
      icon: 'UserCheck',
      title: 'People Who Care',
      description: 'Dedicated team with decades of combined experience',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      order: 7,
      isActive: true
    },
    {
      icon: 'Crown',
      title: 'Precision & Performance',
      description: 'Treating every part with the utmost care and precision',
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      order: 8,
      isActive: true
    }
  ]

  // Clear existing features
  await prisma.whyChooseUsFeature.deleteMany()

  // Create features
  for (const feature of features) {
    await prisma.whyChooseUsFeature.create({
      data: feature
    })
    console.log(`✅ Created feature: ${feature.title}`)
  }

  console.log('🎉 All why choose us content and features seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding why choose us data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
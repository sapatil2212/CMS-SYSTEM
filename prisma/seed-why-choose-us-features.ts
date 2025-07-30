import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

async function seedWhyChooseUsFeatures() {
  try {
    console.log('🌱 Seeding WhyChooseUs features...')

    // Clear existing features
    await prisma.whyChooseUsFeature.deleteMany({})

    // Create new features
    for (const feature of features) {
      await prisma.whyChooseUsFeature.create({
        data: feature
      })
    }

    console.log('✅ WhyChooseUs features seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding WhyChooseUs features:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedWhyChooseUsFeatures() 
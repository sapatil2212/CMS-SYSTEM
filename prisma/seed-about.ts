import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding about content...')

  // Seed main content
  const content = {
    title: 'About Alkalyne',
    subtitle: 'Precision in Every Layer. Commitment in Every Process.',
    description: 'Alkalyne is a trusted name in the field of metal finishing and surface treatment, known for delivering high-performance plating solutions that meet the rigorous demands of modern industries. With a focus on quality, reliability, and innovation, we provide a wide range of services — from electroplating and electroless nickel plating to phosphating, tin plating, and surface preparation. Our processes are engineered to improve durability, corrosion resistance, conductivity, and appearance across various components.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  }
  await prisma.aboutContent.deleteMany()
  await prisma.aboutContent.create({ data: content })
  console.log('✅ Created about content')

  // Seed values
  const values = [
    {
      icon: 'Crown',
      title: 'Quality',
      description: 'We deliver high-performance plating solutions that meet the rigorous demands of modern industries with uncompromising quality standards.',
      order: 1,
      isActive: true
    },
    {
      icon: 'Shield',
      title: 'Reliability',
      description: 'Our consistent, dependable processes ensure exceptional finishes and reliable results for every project, every time.',
      order: 2,
      isActive: true
    },
    {
      icon: 'Zap',
      title: 'Innovation',
      description: 'We combine advanced technology with cutting-edge plating and inspection systems to stay ahead in surface treatment solutions.',
      order: 3,
      isActive: true
    },
    {
      icon: 'Cog',
      title: 'Precision',
      description: 'Precision in every layer and commitment in every process - from prototypes to high-volume production runs.',
      order: 4,
      isActive: true
    }
  ]
  await prisma.aboutValue.deleteMany()
  for (const value of values) {
    await prisma.aboutValue.create({ data: value })
    console.log(`✅ Created value: ${value.title}`)
  }

  // Seed capabilities
  const capabilities = [
    {
      icon: 'CheckCircle',
      title: 'Advanced Plating Systems',
      description: 'Equipped with state-of-the-art plating and inspection systems for superior results.',
      order: 1,
      isActive: true
    },
    {
      icon: 'Users',
      title: 'Expert Team',
      description: 'Staffed by highly skilled professionals with years of industry experience.',
      order: 2,
      isActive: true
    },
    {
      icon: 'Award',
      title: 'Scalable Solutions',
      description: 'Capable of handling both prototypes and high-volume production requirements.',
      order: 3,
      isActive: true
    },
    {
      icon: 'Clock',
      title: 'On-Time Delivery',
      description: 'Committed to precision results with reliable, on-time delivery every time.',
      order: 4,
      isActive: true
    },
    {
      icon: 'Shield',
      title: 'Safety & Compliance',
      description: 'Focused on safety, compliance, and environmentally conscious practices.',
      order: 5,
      isActive: true
    },
    {
      icon: 'Clock',
      title: 'Timely Delivery',
      description: 'On-time project delivery powered by streamlined processes and smart scheduling systems.',
      order: 6,
      isActive: true
    }
  ]
  await prisma.aboutCapability.deleteMany()
  for (const capability of capabilities) {
    await prisma.aboutCapability.create({ data: capability })
    console.log(`✅ Created capability: ${capability.title}`)
  }

  // Seed mission and vision
  const missionVision = [
    {
      type: 'mission',
      title: 'Our Mission',
      description: 'To deliver consistent, customized, and cost-effective metal finishing services that exceed customer expectations and elevate product performance. We are committed to providing solutions that combine technical excellence with reliable results.',
      icon: 'Target'
    },
    {
      type: 'vision',
      title: 'Our Vision',
      description: 'To be a leading force in the surface finishing industry by offering solutions that combine technology, trust, and technical excellence. We aspire to set new standards in metal finishing while maintaining our commitment to quality and innovation.',
      icon: 'Eye'
    }
  ]
  await prisma.aboutMissionVision.deleteMany()
  for (const mv of missionVision) {
    await prisma.aboutMissionVision.create({ data: mv })
    console.log(`✅ Created ${mv.type}: ${mv.title}`)
  }

  console.log('🎉 All about content seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
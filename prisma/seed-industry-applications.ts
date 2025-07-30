import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding industry applications for copper plating...')

  // First, get or create the copper plating content
  let content = await prisma.copperPlatingContent.findFirst()
  
  if (!content) {
    content = await prisma.copperPlatingContent.create({
      data: {
        heroTitle: 'Copper Plating Services',
        heroSubtitle: 'Excellence in Metal Finishing',
        heroDescription: 'Professional copper plating services for superior conductivity and corrosion resistance.',
        heroImage: '/uploads/processes/copper-plating-hero.jpg',
        whatIsTitle: 'What is Copper Plating?',
        whatIsDescription: 'Copper plating is an electrochemical process that deposits a layer of copper onto a metal surface.',
        whatIsImage: '/uploads/processes/copper-plating-process.jpg',
        whatIsBestFor: 'Electronics\nPCBs\nConnectors\nAutomotive parts',
        whatIsMaterials: 'Steel\nAluminum\nBrass\nNickel',
        whatIsAlkalineOffers: 'Alkalyne offers both acid copper (for bright finishes) and cyanide copper (for steel/zinc adhesion) plating processes.',
        benefitsTitle: 'Key Benefits',
        benefitsSubtitle: 'Why choose our copper plating services',
        processTitle: 'Our Process',
        processSubtitle: 'Step-by-step copper plating procedure',
        applicationsTitle: 'Industry Applications of Copper Plating',
        applicationsSubtitle: 'Critical for industries requiring optimal electrical performance and reliable plating foundations',
        industriesTitle: 'Industries We Serve',
        industriesSubtitle: 'Specialized solutions for various sectors',
        qualityTitle: 'Quality Assurance',
        qualityDescription: 'We maintain the highest standards in copper plating through rigorous quality control measures.',
        qualityImage: '/uploads/processes/quality-control.jpg',
        ctaTitle: 'Ready to Get Started?',
        ctaDescription: 'Contact us today to discuss your copper plating requirements.'
      }
    })
  }

  // Clear existing applications
  await prisma.copperPlatingApplication.deleteMany({
    where: { contentId: content.id }
  })

  // Create industry applications with the provided structure
  const applications = [
    {
      title: "Electronics & PCBs",
      image: "/uploads/applications/electronics-pcbs.jpg",
      items: ["Circuit boards", "Connectors", "RF shields", "Busbars"],
      order: 0
    },
    {
      title: "Automotive Components", 
      image: "/uploads/applications/automotive-components.jpg",
      items: ["Battery terminals", "Sensors", "Switchgear", "Ground straps"],
      order: 1
    },
    {
      title: "Industrial Equipment",
      image: "/uploads/applications/industrial-equipment.jpg", 
      items: ["Heat exchangers", "Waveguides", "Tooling", "Decorative trim"],
      order: 2
    }
  ]

  // Create all applications
  for (const app of applications) {
    await prisma.copperPlatingApplication.create({
      data: {
        contentId: content.id,
        title: app.title,
        image: app.image,
        items: JSON.stringify(app.items),
        order: app.order
      }
    })
    console.log(`✅ Created application: ${app.title}`)
  }

  console.log('🎉 Industry applications seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding industry applications:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
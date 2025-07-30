import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding silver plating content...')

  // Check if content already exists
  const existingContent = await prisma.silverPlatingContent.findFirst()
  if (existingContent) {
    console.log('Silver plating content already exists, skipping...')
    return
  }

  // Create silver plating content
  const silverPlatingContent = await prisma.silverPlatingContent.create({
    data: {
      heroTitle: "High-Performance Silver Plating Solutions",
      heroSubtitle: "Industrial-Grade Silver Plating Services",
      heroDescription: "At Alkalyne, we offer industrial-grade silver plating services tailored to meet the most demanding technical requirements. Using 99.9% pure silver anodes and advanced electrolytic processes, we deliver finishes that combine functionality with durability.",
      heroImage: "/uploads/silver-plating/hero.jpg",
      whatIsTitle: "What is Silver Plating?",
      whatIsDescription: "At Alkalyne, we offer industrial-grade silver plating services tailored to meet the most demanding technical requirements. Using 99.9% pure silver anodes and advanced electrolytic processes, we deliver finishes that combine functionality with durability.\n\nWe can apply everything from thin flash coatings (0.5μm) to heavy plating (8μm+) based on your application needs.",
      whatIsImage: "/uploads/silver-plating/what-is.jpg",
      whatIsBestFor: "High-frequency electronics\nMedical devices\nAerospace components\nElectrical contacts\nPrecision instruments",
      whatIsMaterials: "Copper and copper alloys\nBrass and bronze\nSteel (with barrier layer)\nAluminum (special process)\nNickel (base layer)",
      whatIsAlkalineOffers: "Alkalyne offers both cyanide and non-cyanide silver plating processes, with specialized solutions for different substrate materials and application requirements.",
      benefitsTitle: "Benefits of Silver Plating",
      benefitsSubtitle: "Why leading manufacturers choose silver plating for critical applications",
      processTitle: "Our Silver Plating Process",
      processSubtitle: "Alkalyne's systematic approach ensures consistent, high-quality silver plating for both prototype and production volumes",
      applicationsTitle: "Silver Plating Applications",
      applicationsSubtitle: "Critical for industries requiring optimal electrical performance and reliable plating foundations",
      industriesTitle: "Industries We Serve",
      industriesSubtitle: "Trusted by leading manufacturers across diverse sectors",
      qualityTitle: "Quality Assurance",
      qualityDescription: "Alkalyne maintains rigorous quality standards for every silver-plated component with certified excellence in all processes.",
      qualityImage: "/uploads/silver-plating/quality-inspection.jpg",
      ctaTitle: "Ready to Enhance Your Performance?",
      ctaDescription: "Whether you need prototype plating or high-volume production, our team is ready to deliver exceptional results.",
      benefits: {
        create: [
          {
            icon: "Zap",
            title: "Highest Electrical Conductivity",
            description: "Highest electrical conductivity of all metals (63 x 10^6 S/m)",
            order: 0
          },
          {
            icon: "Thermometer",
            title: "Excellent Thermal Resistance",
            description: "Superior thermal resistance and oxidation resistance",
            order: 1
          },
          {
            icon: "Shield",
            title: "Anti-Galling Properties",
            description: "Anti-galling & anti-fretting properties for moving parts",
            order: 2
          },
          {
            icon: "Activity",
            title: "High-Temperature Performance",
            description: "Stable performance in high-temperature environments",
            order: 3
          },
          {
            icon: "TestTube2",
            title: "Corrosion Resistance",
            description: "Corrosion resistance against industrial chemicals",
            order: 4
          },
          {
            icon: "Microscope",
            title: "Antibacterial Surface",
            description: "Antibacterial surface ideal for medical applications",
            order: 5
          }
        ]
      },
      processSteps: {
        create: [
          {
            step: "1",
            title: "Surface Prep",
            description: "Degreasing, acid cleaning & activation",
            icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
            order: 0
          },
          {
            step: "2",
            title: "Electrolytic Bath",
            description: "Immersion in silver solution",
            icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z",
            order: 1
          },
          {
            step: "3",
            title: "Plating",
            description: "Current-controlled deposition",
            icon: "M13 10V3L4 14h7v7l9-11h-7z",
            order: 2
          },
          {
            step: "4",
            title: "Finishing",
            description: "Rinsing, drying & inspection",
            icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
            order: 3
          }
        ]
      },
      applications: {
        create: [
          {
            title: "Electrical & Electronics",
            image: "/uploads/silver-plating/electronics.jpg",
            items: JSON.stringify(["Terminals", "Contacts", "Circuit boards", "Connectors"]),
            order: 0
          },
          {
            title: "Aerospace & Defense",
            image: "/uploads/silver-plating/aerospace.jpg",
            items: JSON.stringify(["High-temperature components", "Corrosion-prone environments", "Mission-critical parts", "Electrical systems"]),
            order: 1
          },
          {
            title: "Medical Devices",
            image: "/uploads/silver-plating/medical.jpg",
            items: JSON.stringify(["Surgical instruments", "Medical fittings", "Antibacterial surfaces", "Precision components"]),
            order: 2
          }
        ]
      },
      industries: {
        create: [
          {
            name: "Electronics Manufacturing",
            icon: "Cpu",
            examples: JSON.stringify(["Circuit boards", "Connectors", "RF components", "High-frequency circuits"]),
            image: "/uploads/silver-plating/electronics-industry.jpg",
            order: 0
          },
          {
            name: "Automotive OEMs",
            icon: "Wrench",
            examples: JSON.stringify(["Electrical systems", "Sensors", "Switchgear", "Battery terminals"]),
            image: "/uploads/silver-plating/automotive-industry.jpg",
            order: 1
          },
          {
            name: "Aerospace Components",
            icon: "Plane",
            examples: JSON.stringify(["High-temperature parts", "Electrical systems", "Mission-critical components", "Corrosion protection"]),
            image: "/uploads/silver-plating/aerospace-industry.jpg",
            order: 2
          },
          {
            name: "Power & Energy Sector",
            icon: "Zap",
            examples: JSON.stringify(["Busbars", "Switchgear", "Power distribution", "Electrical contacts"]),
            image: "/uploads/silver-plating/power-industry.jpg",
            order: 3
          },
          {
            name: "Railways & Infrastructure",
            icon: "HardHat",
            examples: JSON.stringify(["Electrical systems", "Signal equipment", "Power distribution", "Safety components"]),
            image: "/uploads/silver-plating/railway-industry.jpg",
            order: 4
          },
          {
            name: "Medical Technology",
            icon: "Microscope",
            examples: JSON.stringify(["Surgical instruments", "Medical devices", "Antibacterial surfaces", "Precision components"]),
            image: "/uploads/silver-plating/medical-industry.jpg",
            order: 5
          }
        ]
      },
      qualityChecks: {
        create: [
          {
            title: "ISO 9001:2015 Certified",
            description: "Certified excellence in all processes",
            order: 0
          },
          {
            title: "ISO 14001 Environmental",
            description: "Environmental standards compliance",
            order: 1
          },
          {
            title: "Automated Thickness Measurement",
            description: "Precise thickness verification",
            order: 2
          },
          {
            title: "Destructive & Non-Destructive Testing",
            description: "Comprehensive testing methods",
            order: 3
          },
          {
            title: "Material Certifications",
            description: "Available material certifications",
            order: 4
          }
        ]
      }
    }
  })

  console.log('Silver plating content seeded successfully!')
  console.log('Created content with ID:', silverPlatingContent.id)
}

export default async function seedSilverPlating() {
  try {
    await main()
  } catch (e) {
    console.error(e)
    throw e
  } finally {
    await prisma.$disconnect()
  }
}

// Run directly if this file is executed
if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
} 
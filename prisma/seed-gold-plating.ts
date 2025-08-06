import { logger } from '@/lib/logger';
import {  PrismaClient  } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {
  logger.log('Seeding gold plating content...')

  // Check if content already exists
  const existingContent = await prisma.goldPlatingContent.findFirst()
  if (existingContent) {
    logger.log('Gold plating content already exists, skipping...')
    return
  }

  // Create gold plating content
  const goldPlatingContent = await prisma.goldPlatingContent.create({
    data: {
      heroTitle: "Premium Gold Plating Services in India",
      heroSubtitle: "Resistant to Corrosion, Conductive by Nature",
      heroDescription: "Gold's unmatched corrosion and oxidation resistance make it an essential finish for critical electrical, aerospace, and telecom components.",
      heroImage: "/uploads/gold-plating/hero.jpg",
      whatIsTitle: "What is Gold Plating?",
      whatIsDescription: "Gold electroplating deposits a thin layer of gold onto substrates through electrochemical deposition. Valued for its exceptional corrosion resistance, electrical conductivity, and aesthetic appeal, gold plating is essential for critical applications where reliability and performance are paramount.",
      whatIsImage: "/uploads/gold-plating/what-is.jpg",
      whatIsBestFor: "High-frequency electronics\nAerospace components\nTelecommunications\nMedical devices\nJewelry and decorative items",
      whatIsMaterials: "Copper and copper alloys\nNickel (base layer)\nBrass and bronze\nSteel (with barrier layer)\nAluminum (special process)",
      whatIsAlkalineOffers: "Alkalyne offers both hard gold (for wear resistance) and soft gold (for conductivity) plating processes with specialized solutions for different application requirements.",
      benefitsTitle: "Key Advantages",
      benefitsSubtitle: "Why leading manufacturers choose gold plating for critical applications",
      processTitle: "Our Gold Plating Process",
      processSubtitle: "Precision-controlled deposition for consistent quality",
      applicationsTitle: "Gold Plating Applications",
      applicationsSubtitle: "Critical for industries requiring optimal electrical performance and reliable plating foundations",
      industriesTitle: "Industries We Serve",
      industriesSubtitle: "Trusted by leading manufacturers across diverse sectors",
      qualityTitle: "Quality Commitment",
      qualityDescription: "Alkalyne maintains rigorous quality standards for every gold-plated component",
      qualityImage: "/uploads/gold-plating/quality-inspection.jpg",
      ctaTitle: "Need Precision Gold Plating?",
      ctaDescription: "From prototype batches to high-volume production, we deliver gold plating that meets exacting standards",
      benefits: {
        create: [
          {
            icon: "Crown",
            title: "Corrosion Resistance",
            description: "Unmatched resistance to oxidation and tarnishing",
            order: 0
          },
          {
            icon: "Zap",
            title: "Electrical Conductivity",
            description: "Excellent conductivity for high-frequency applications",
            order: 1
          },
          {
            icon: "Shield",
            title: "Chemical Stability",
            description: "Resistant to most acids and alkalis",
            order: 2
          },
          {
            icon: "Award",
            title: "Aesthetic Appeal",
            description: "Beautiful finish for decorative applications",
            order: 3
          },
          {
            icon: "CircuitBoard",
            title: "Contact Reliability",
            description: "Maintains low contact resistance over time",
            order: 4
          },
          {
            icon: "TestTube2",
            title: "Biocompatibility",
            description: "Safe for medical and dental applications",
            order: 5
          }
        ]
      },
      processSteps: {
        create: [
          {
            step: "1",
            title: "Surface Preparation",
            description: "Degreasing, acid pickling, and activation",
            icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
            order: 0
          },
          {
            step: "2",
            title: "Nickel Undercoat",
            description: "Deposition of nickel barrier layer",
            icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z",
            order: 1
          },
          {
            step: "3",
            title: "Gold Deposition",
            description: "Precise DC current deposits gold layer",
            icon: "M13 10V3L4 14h7v7l9-11h-7z",
            order: 2
          },
          {
            step: "4",
            title: "Post-Treatment",
            description: "Rinsing, passivation, and inspection",
            icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
            order: 3
          }
        ]
      },
      applications: {
        create: [
          {
            title: "Electronics & PCBs",
            image: "/uploads/gold-plating/electronics.jpg",
            items: JSON.stringify(["Circuit boards", "Connectors", "RF components", "Contact points"]),
            order: 0
          },
          {
            title: "Aerospace & Defense",
            image: "/uploads/gold-plating/aerospace.jpg",
            items: JSON.stringify(["Critical components", "Electrical systems", "Corrosion protection", "High-reliability parts"]),
            order: 1
          },
          {
            title: "Medical Devices",
            image: "/uploads/gold-plating/medical.jpg",
            items: JSON.stringify(["Surgical instruments", "Dental equipment", "Implantable devices", "Diagnostic tools"]),
            order: 2
          }
        ]
      },
      industries: {
        create: [
          {
            name: "Electronics",
            icon: "Cpu",
            examples: JSON.stringify(["PCBs", "Connectors", "RF components"]),
            image: "/uploads/gold-plating/electronics-industry.jpg",
            order: 0
          },
          {
            name: "Aerospace",
            icon: "Plane",
            examples: JSON.stringify(["Critical components", "Electrical systems", "Corrosion protection"]),
            image: "/uploads/gold-plating/aerospace-industry.jpg",
            order: 1
          },
          {
            name: "Medical",
            icon: "Shield",
            examples: JSON.stringify(["Surgical instruments", "Dental equipment", "Implantable devices"]),
            image: "/uploads/gold-plating/medical-industry.jpg",
            order: 2
          }
        ]
      },
      qualityChecks: {
        create: [
          {
            title: "Thickness Verification",
            description: "X-ray fluorescence (XRF) and micrometer testing",
            order: 0
          },
          {
            title: "Adhesion Testing",
            description: "ASTM B571 bend and tape tests",
            order: 1
          },
          {
            title: "Corrosion Testing",
            description: "Salt spray and humidity testing",
            order: 2
          },
          {
            title: "Contact Resistance",
            description: "Electrical conductivity measurements",
            order: 3
          }
        ]
      }
    }
  })

  logger.log('Gold plating content seeded successfully!')
  logger.log('Created content with ID:', goldPlatingContent.id)
}

export default async function seedGoldPlating() {
  try {
    await main()
  } catch (e) {
    logger.error(e)
    throw e
  } finally {
    await prisma.$disconnect()
  }
}

// Run directly if this file is executed
if (require.main === module) {
  main()
    .catch((e) => {
      logger.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
} 
import { logger } from '@/lib/logger';
import {  PrismaClient  } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {
  logger.log('Seeding copper plating content...')

  // Check if content already exists
  const existingContent = await prisma.copperPlatingContent.findFirst()
  if (existingContent) {
    logger.log('Copper plating content already exists, skipping...')
    return
  }

  // Create copper plating content
  const copperPlatingContent = await prisma.copperPlatingContent.create({
    data: {
      heroTitle: "Premium Copper Plating Services in India",
      heroSubtitle: "Precision Electroplating Solutions",
      heroDescription: "Superior Conductivity • Mirror-Smooth Finish • Ideal for Multilayer Plating",
      heroImage: "/uploads/copper-plating/hero.jpg",
      whatIsTitle: "What is Copper Plating?",
      whatIsDescription: "Copper electroplating deposits a uniform metallic copper layer onto substrates through electrochemical deposition. Valued for its exceptional electrical/thermal conductivity and as an ideal base for subsequent platings, copper enhances both functionality and longevity.",
      whatIsImage: "/uploads/copper-plating/what-is.jpg",
      whatIsBestFor: "High-frequency electronics\nMultilayer plating base\nEMI/RFI shielding",
      whatIsMaterials: "Steel (with barrier layer)\nBrass & copper alloys\nAluminum (special process)",
      whatIsAlkalineOffers: "Alkalyne offers both acid copper (for bright finishes) and cyanide copper (for steel/zinc adhesion) plating processes.",
      benefitsTitle: "Key Advantages",
      benefitsSubtitle: "Why leading manufacturers choose copper plating for critical applications",
      processTitle: "Our Copper Plating Process",
      processSubtitle: "Precision-controlled deposition for consistent quality",
      applicationsTitle: "Copper Plating Applications",
      applicationsSubtitle: "Critical for industries requiring optimal electrical performance and reliable plating foundations",
      industriesTitle: "Industries We Serve",
      industriesSubtitle: "Our copper plating expertise supports diverse manufacturing sectors",
      qualityTitle: "Quality Commitment",
      qualityDescription: "Alkalyne maintains rigorous quality standards for every copper-plated component",
      qualityImage: "/uploads/copper-plating/quality-inspection.jpg",
      ctaTitle: "Need Precision Copper Plating?",
      ctaDescription: "From prototype batches to high-volume production, we deliver copper plating that meets exacting standards",
      benefits: {
        create: [
          {
            icon: "Zap",
            title: "Superior Conductivity",
            description: "Second only to silver in electrical conductivity",
            order: 0
          },
          {
            icon: "Layers",
            title: "Perfect Base Layer",
            description: "Ideal for multilayer plating (nickel, gold, tin)",
            order: 1
          },
          {
            icon: "Activity",
            title: "Thermal Management",
            description: "Excellent heat dissipation properties",
            order: 2
          },
          {
            icon: "Check",
            title: "Smooth Finish",
            description: "Uniform deposition for precision components",
            order: 3
          },
          {
            icon: "CircuitBoard",
            title: "PCB Performance",
            description: "Essential for high-frequency circuits",
            order: 4
          },
          {
            icon: "TestTube2",
            title: "Corrosion Resistance",
            description: "When paired with protective top layers",
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
            title: "Electrolyte Bath",
            description: "Immersion in copper sulfate or cyanide solution",
            icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z",
            order: 1
          },
          {
            step: "3",
            title: "Current Application",
            description: "Precise DC current deposits copper layer",
            icon: "M13 10V3L4 14h7v7l9-11h-7z",
            order: 2
          },
          {
            step: "4",
            title: "Post-Treatment",
            description: "Rinsing, passivation, or additional plating",
            icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
            order: 3
          }
        ]
      },
      applications: {
        create: [
          {
            title: "Electronics & PCBs",
            image: "/uploads/copper-plating/electronics.jpg",
            items: JSON.stringify(["Circuit boards", "Connectors", "RF shields", "Busbars"]),
            order: 0
          },
          {
            title: "Automotive Components",
            image: "/uploads/copper-plating/automotive.jpg",
            items: JSON.stringify(["Battery terminals", "Sensors", "Switchgear", "Ground straps"]),
            order: 1
          },
          {
            title: "Industrial Equipment",
            image: "/uploads/copper-plating/industrial.jpg",
            items: JSON.stringify(["Heat exchangers", "Waveguides", "Tooling", "Decorative trim"]),
            order: 2
          }
        ]
      },
      industries: {
        create: [
          {
            name: "Electronics",
            icon: "Cpu",
            examples: JSON.stringify(["PCBs", "Connectors", "Busbars"]),
            image: "/uploads/copper-plating/electronics.jpg",
            order: 0
          },
          {
            name: "Automotive",
            icon: "Wrench",
            examples: JSON.stringify(["Terminals", "Sensors", "Battery components"]),
            image: "/uploads/copper-plating/automotive.jpg",
            order: 1
          },
          {
            name: "Aerospace",
            icon: "Plane",
            examples: JSON.stringify(["Waveguides", "RF components", "Grounding systems"]),
            image: "/uploads/copper-plating/aerospace.jpg",
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
            title: "Conductivity Testing",
            description: "Four-point probe resistivity measurements",
            order: 1
          },
          {
            title: "Adhesion Testing",
            description: "ASTM B571 bend and tape tests",
            order: 2
          },
          {
            title: "Surface Inspection",
            description: "Microscopic examination for pits/nodules",
            order: 3
          }
        ]
      }
    }
  })

  logger.log('Copper plating content seeded successfully!')
}

export default async function seedCopperPlating() {
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
import { logger } from '@/lib/logger';
import {  PrismaClient  } from '@prisma/client';

const prisma = new PrismaClient()

export default async function seedRackBarrelPlating() {
  try {
    const rackBarrelPlatingContent = await prisma.rackBarrelPlatingContent.create({
      data: {
        heroTitle: "Premium Rack & Barrel Plating Services",
        heroSubtitle: "High-Volume Production Solutions",
        heroDescription: "Advanced rack and barrel plating services providing efficient, high-volume production capabilities for various metal finishing applications.",
        heroImage: "/uploads/rack-barrel-plating/hero.jpg",
        whatIsTitle: "What is Rack & Barrel Plating?",
        whatIsDescription: "Rack and barrel plating are two distinct methods for electroplating metal parts. Rack plating involves mounting parts on fixtures for precise control, while barrel plating tumbles parts in rotating barrels for high-volume production.",
        whatIsImage: "/uploads/rack-barrel-plating/what-is.jpg",
        whatIsBestFor: "High-volume production\nPrecision components\nCost efficiency\nQuality control\nDiverse part sizes",
        whatIsMaterials: "Steel alloys\nAluminum\nCopper alloys\nBrass\nBronze",
        whatIsAlkalineOffers: "Alkalyne offers comprehensive rack and barrel plating services for various production volumes and requirements.",
        benefitsTitle: "Key Advantages",
        benefitsSubtitle: "Why leading manufacturers choose rack and barrel plating",
        processTitle: "Our Rack & Barrel Process",
        processSubtitle: "Efficient production methods for quality results",
        applicationsTitle: "Rack & Barrel Applications",
        applicationsSubtitle: "Critical for industries requiring high-volume production",
        industriesTitle: "Industries We Serve",
        industriesSubtitle: "Trusted by leading manufacturers across diverse sectors",
        qualityTitle: "Quality Commitment",
        qualityDescription: "Alkalyne maintains rigorous quality standards for every rack and barrel plated component",
        qualityImage: "/uploads/rack-barrel-plating/quality.jpg",
        ctaTitle: "Need Rack & Barrel Plating?",
        ctaDescription: "From prototype batches to high-volume production, we deliver rack and barrel plating that meets exacting standards",
      }
    })

    const benefits = [
      { icon: "Activity", title: "High Volume", description: "Efficient production for large quantities", order: 0 },
      { icon: "Check", title: "Cost Effective", description: "Economical plating for mass production", order: 1 },
      { icon: "Layers", title: "Quality Control", description: "Consistent quality across production runs", order: 2 },
      { icon: "Settings", title: "Flexible Processing", description: "Handles various part sizes and shapes", order: 3 },
      { icon: "TestTube2", title: "Multiple Finishes", description: "Wide range of plating options available", order: 4 },
      { icon: "Clock", title: "Fast Turnaround", description: "Quick processing for urgent orders", order: 5 }
    ]

    for (const benefit of benefits) {
      await prisma.rackBarrelPlatingBenefit.create({
        data: {
          ...benefit,
          contentId: rackBarrelPlatingContent.id
        }
      })
    }

    const processSteps = [
      { step: "1", title: "Part Preparation", description: "Cleaning, degreasing, and sorting", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", order: 0 },
      { step: "2", title: "Loading Process", description: "Rack mounting or barrel loading", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z", order: 1 },
      { step: "3", title: "Plating Process", description: "Electrochemical plating treatment", icon: "M13 10V3L4 14h7v7l9-11h-7z", order: 2 },
      { step: "4", title: "Final Inspection", description: "Quality control and finishing", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z", order: 3 }
    ]

    for (const step of processSteps) {
      await prisma.rackBarrelPlatingProcessStep.create({
        data: {
          ...step,
          contentId: rackBarrelPlatingContent.id
        }
      })
    }

    const applications = [
      { title: "Automotive Hardware", image: "/uploads/rack-barrel-plating/automotive.jpg", items: JSON.stringify(["Fasteners", "Brackets", "Hardware", "Body components"]), order: 0 },
      { title: "Industrial Equipment", image: "/uploads/rack-barrel-plating/industrial.jpg", items: JSON.stringify(["Machine parts", "Enclosures", "Tooling", "Bearings"]), order: 1 },
      { title: "Electronics", image: "/uploads/rack-barrel-plating/electronics.jpg", items: JSON.stringify(["Connectors", "Terminals", "Housings", "Mounting hardware"]), order: 2 }
    ]

    for (const app of applications) {
      await prisma.rackBarrelPlatingApplication.create({
        data: {
          ...app,
          contentId: rackBarrelPlatingContent.id
        }
      })
    }

    const industries = [
      { name: "Automotive", icon: "Car", examples: JSON.stringify(["Fasteners", "Brackets", "Hardware"]), image: "/uploads/rack-barrel-plating/automotive-industry.jpg", order: 0 },
      { name: "Industrial", icon: "Cpu", examples: JSON.stringify(["Machine parts", "Enclosures", "Tooling"]), image: "/uploads/rack-barrel-plating/industrial-industry.jpg", order: 1 },
      { name: "Electronics", icon: "Zap", examples: JSON.stringify(["Connectors", "Terminals", "Housings"]), image: "/uploads/rack-barrel-plating/electronics-industry.jpg", order: 2 }
    ]

    for (const industry of industries) {
      await prisma.rackBarrelPlatingIndustry.create({
        data: {
          ...industry,
          contentId: rackBarrelPlatingContent.id
        }
      })
    }

    const qualityChecks = [
      { title: "Thickness Testing", description: "Magnetic and X-ray fluorescence testing", order: 0 },
      { title: "Adhesion Testing", description: "ASTM B571 bend and impact tests", order: 1 },
      { title: "Corrosion Testing", description: "Salt spray testing per ASTM B117", order: 2 },
      { title: "Appearance Inspection", description: "Visual and finish verification", order: 3 }
    ]

    for (const check of qualityChecks) {
      await prisma.rackBarrelPlatingQualityCheck.create({
        data: {
          ...check,
          contentId: rackBarrelPlatingContent.id
        }
      })
    }

    logger.log('✅ Rack and barrel plating content seeded successfully')
  } catch (error) {
    logger.error('❌ Error seeding rack and barrel plating content:', error)
    throw error
  }
} 
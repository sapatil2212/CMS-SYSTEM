import { logger } from '@/lib/logger';
import {  PrismaClient  } from '@prisma/client';

const prisma = new PrismaClient()

export default async function seedZincPlating() {
  try {
    // Create Zinc Plating Content
    const zincPlatingContent = await prisma.zincPlatingContent.create({
      data: {
        heroTitle: "Premium Zinc Plating & Colour Passivates Services",
        heroSubtitle: "Corrosion Protection with Aesthetic Appeal",
        heroDescription: "Advanced zinc plating with colour passivation treatments providing superior corrosion resistance and attractive finishes for steel components.",
        heroImage: "/uploads/zinc-plating/hero.jpg",
        whatIsTitle: "What is Zinc Plating & Colour Passivates?",
        whatIsDescription: "Zinc plating deposits a protective zinc layer on steel and iron components through electrochemical processes. Combined with colour passivation treatments, it provides enhanced corrosion resistance while offering attractive color finishes including yellow, black, blue, and clear chromate conversions.",
        whatIsImage: "/uploads/zinc-plating/what-is.jpg",
        whatIsBestFor: "Steel fasteners\nAutomotive components\nHardware items\nIndustrial equipment\nDecorative applications",
        whatIsMaterials: "Carbon steel\nLow alloy steel\nCast iron\nMalleable iron\nPowdered metal parts",
        whatIsAlkalineOffers: "Alkalyne offers comprehensive zinc plating services including alkaline, acid, and chloride zinc systems with full range of colour passivation treatments.",
        benefitsTitle: "Key Advantages",
        benefitsSubtitle: "Why leading manufacturers choose zinc plating for critical applications",
        processTitle: "Our Zinc Plating Process",
        processSubtitle: "Precision-controlled deposition for consistent quality",
        applicationsTitle: "Zinc Plating Applications",
        applicationsSubtitle: "Critical for industries requiring optimal corrosion protection and aesthetic appeal",
        industriesTitle: "Industries We Serve",
        industriesSubtitle: "Trusted by leading manufacturers across diverse sectors",
        qualityTitle: "Quality Commitment",
        qualityDescription: "Alkalyne maintains rigorous quality standards for every zinc-plated component",
        qualityImage: "/uploads/zinc-plating/quality.jpg",
        ctaTitle: "Need Precision Zinc Plating?",
        ctaDescription: "From prototype batches to high-volume production, we deliver zinc plating that meets exacting standards",
      }
    })

    // Create Benefits
    const benefits = [
      { icon: "Shield", title: "Corrosion Protection", description: "Excellent barrier protection against rust and corrosion", order: 0 },
      { icon: "Award", title: "Aesthetic Finishes", description: "Wide range of attractive colour passivation options", order: 1 },
      { icon: "Layers", title: "Sacrificial Protection", description: "Zinc acts as sacrificial anode protecting base metal", order: 2 },
      { icon: "Activity", title: "Cost Effective", description: "Economical protection for high-volume applications", order: 3 },
      { icon: "TestTube2", title: "Chemical Resistance", description: "Resistance to various environmental conditions", order: 4 },
      { icon: "Check", title: "Easy Processing", description: "Suitable for complex geometries and mass production", order: 5 }
    ]

    for (const benefit of benefits) {
      await prisma.zincPlatingBenefit.create({
        data: {
          ...benefit,
          contentId: zincPlatingContent.id
        }
      })
    }

    // Create Process Steps
    const processSteps = [
      { step: "1", title: "Surface Preparation", description: "Degreasing, pickling, and activation", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", order: 0 },
      { step: "2", title: "Zinc Deposition", description: "Electrochemical zinc plating process", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z", order: 1 },
      { step: "3", title: "Colour Passivation", description: "Chromate conversion coating application", icon: "M13 10V3L4 14h7v7l9-11h-7z", order: 2 },
      { step: "4", title: "Final Inspection", description: "Quality control and finishing", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z", order: 3 }
    ]

    for (const step of processSteps) {
      await prisma.zincPlatingProcessStep.create({
        data: {
          ...step,
          contentId: zincPlatingContent.id
        }
      })
    }

    // Create Applications
    const applications = [
      { title: "Automotive Components", image: "/uploads/zinc-plating/automotive.jpg", items: JSON.stringify(["Fasteners", "Brackets", "Hardware", "Body components"]), order: 0 },
      { title: "Construction Hardware", image: "/uploads/zinc-plating/construction.jpg", items: JSON.stringify(["Bolts and screws", "Brackets", "Structural components", "Roofing hardware"]), order: 1 },
      { title: "Industrial Equipment", image: "/uploads/zinc-plating/industrial.jpg", items: JSON.stringify(["Machine parts", "Enclosures", "Tooling", "Agricultural equipment"]), order: 2 }
    ]

    for (const app of applications) {
      await prisma.zincPlatingApplication.create({
        data: {
          ...app,
          contentId: zincPlatingContent.id
        }
      })
    }

    // Create Industries
    const industries = [
      { name: "Automotive", icon: "Wrench", examples: JSON.stringify(["Fasteners", "Brackets", "Hardware"]), image: "/uploads/zinc-plating/automotive-industry.jpg", order: 0 },
      { name: "Construction", icon: "HardHat", examples: JSON.stringify(["Bolts and screws", "Brackets", "Structural components"]), image: "/uploads/zinc-plating/construction-industry.jpg", order: 1 },
      { name: "Industrial", icon: "Cpu", examples: JSON.stringify(["Machine parts", "Enclosures", "Tooling"]), image: "/uploads/zinc-plating/industrial-industry.jpg", order: 2 }
    ]

    for (const industry of industries) {
      await prisma.zincPlatingIndustry.create({
        data: {
          ...industry,
          contentId: zincPlatingContent.id
        }
      })
    }

    // Create Quality Checks
    const qualityChecks = [
      { title: "Thickness Testing", description: "Magnetic and X-ray fluorescence testing", order: 0 },
      { title: "Adhesion Testing", description: "ASTM B571 bend and impact tests", order: 1 },
      { title: "Corrosion Testing", description: "Salt spray testing per ASTM B117", order: 2 },
      { title: "Appearance Inspection", description: "Visual and color matching verification", order: 3 }
    ]

    for (const check of qualityChecks) {
      await prisma.zincPlatingQualityCheck.create({
        data: {
          ...check,
          contentId: zincPlatingContent.id
        }
      })
    }

    logger.log('✅ Zinc plating content seeded successfully')
  } catch (error) {
    logger.error('❌ Error seeding zinc plating content:', error)
    throw error
  }
} 
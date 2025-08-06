import { logger } from '@/lib/logger';
import {  PrismaClient  } from '@prisma/client';

const prisma = new PrismaClient()

export default async function seedElectrolessNickelPlating() {
  try {
    const electrolessNickelPlatingContent = await prisma.electrolessNickelPlatingContent.create({
      data: {
        heroTitle: "Premium Electroless Nickel Plating Services",
        heroSubtitle: "Uniform Coating Without Electricity",
        heroDescription: "Advanced electroless nickel plating providing uniform, corrosion-resistant coatings without electrical current for complex geometries.",
        heroImage: "/uploads/electroless-nickel-plating/hero.jpg",
        whatIsTitle: "What is Electroless Nickel Plating?",
        whatIsDescription: "Electroless nickel plating is a chemical process that deposits a uniform nickel-phosphorus alloy coating without using electrical current. This autocatalytic process provides excellent corrosion resistance, wear resistance, and uniform thickness even on complex shapes.",
        whatIsImage: "/uploads/electroless-nickel-plating/what-is.jpg",
        whatIsBestFor: "Complex geometries\nPrecision components\nCorrosion resistance\nWear resistance\nUniform thickness",
        whatIsMaterials: "Steel alloys\nAluminum\nCopper alloys\nPlastics\nCeramics",
        whatIsAlkalineOffers: "Alkalyne offers comprehensive electroless nickel plating with various phosphorus content options for different applications.",
        benefitsTitle: "Key Advantages",
        benefitsSubtitle: "Why leading manufacturers choose electroless nickel plating",
        processTitle: "Our Electroless Nickel Process",
        processSubtitle: "Chemical deposition for uniform coverage",
        applicationsTitle: "Electroless Nickel Applications",
        applicationsSubtitle: "Critical for industries requiring uniform, corrosion-resistant coatings",
        industriesTitle: "Industries We Serve",
        industriesSubtitle: "Trusted by leading manufacturers across diverse sectors",
        qualityTitle: "Quality Commitment",
        qualityDescription: "Alkalyne maintains rigorous quality standards for every electroless nickel-plated component",
        qualityImage: "/uploads/electroless-nickel-plating/quality.jpg",
        ctaTitle: "Need Electroless Nickel Plating?",
        ctaDescription: "From prototype batches to high-volume production, we deliver electroless nickel plating that meets exacting standards",
      }
    })

    const benefits = [
      { icon: "Shield", title: "Uniform Coverage", description: "Even coating thickness on complex geometries", order: 0 },
      { icon: "Zap", title: "No Electricity", description: "Chemical process without electrical current", order: 1 },
      { icon: "Layers", title: "Corrosion Resistance", description: "Excellent protection against rust and chemicals", order: 2 },
      { icon: "Activity", title: "Wear Resistance", description: "Hard, durable surface for high-wear applications", order: 3 },
      { icon: "TestTube2", title: "Chemical Stability", description: "Resistance to various chemical environments", order: 4 },
      { icon: "Check", title: "Precision Control", description: "Accurate thickness control for critical applications", order: 5 }
    ]

    for (const benefit of benefits) {
      await prisma.electrolessNickelPlatingBenefit.create({
        data: {
          ...benefit,
          contentId: electrolessNickelPlatingContent.id
        }
      })
    }

    const processSteps = [
      { step: "1", title: "Surface Preparation", description: "Cleaning, degreasing, and activation", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", order: 0 },
      { step: "2", title: "Chemical Activation", description: "Catalyst preparation for nickel deposition", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z", order: 1 },
      { step: "3", title: "Nickel Deposition", description: "Chemical nickel-phosphorus plating", icon: "M13 10V3L4 14h7v7l9-11h-7z", order: 2 },
      { step: "4", title: "Final Inspection", description: "Quality control and finishing", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z", order: 3 }
    ]

    for (const step of processSteps) {
      await prisma.electrolessNickelPlatingProcessStep.create({
        data: {
          ...step,
          contentId: electrolessNickelPlatingContent.id
        }
      })
    }

    const applications = [
      { title: "Precision Components", image: "/uploads/electroless-nickel-plating/precision.jpg", items: JSON.stringify(["Valves", "Pumps", "Bearings", "Gears"]), order: 0 },
      { title: "Electronics", image: "/uploads/electroless-nickel-plating/electronics.jpg", items: JSON.stringify(["Connectors", "Switches", "Circuit boards", "Housings"]), order: 1 },
      { title: "Aerospace", image: "/uploads/electroless-nickel-plating/aerospace.jpg", items: JSON.stringify(["Engine parts", "Landing gear", "Hydraulic systems", "Fasteners"]), order: 2 }
    ]

    for (const app of applications) {
      await prisma.electrolessNickelPlatingApplication.create({
        data: {
          ...app,
          contentId: electrolessNickelPlatingContent.id
        }
      })
    }

    const industries = [
      { name: "Aerospace", icon: "Plane", examples: JSON.stringify(["Engine components", "Landing gear", "Hydraulic systems"]), image: "/uploads/electroless-nickel-plating/aerospace-industry.jpg", order: 0 },
      { name: "Electronics", icon: "Cpu", examples: JSON.stringify(["Connectors", "Switches", "Circuit boards"]), image: "/uploads/electroless-nickel-plating/electronics-industry.jpg", order: 1 },
      { name: "Automotive", icon: "Car", examples: JSON.stringify(["Fuel systems", "Brake components", "Transmission parts"]), image: "/uploads/electroless-nickel-plating/automotive-industry.jpg", order: 2 }
    ]

    for (const industry of industries) {
      await prisma.electrolessNickelPlatingIndustry.create({
        data: {
          ...industry,
          contentId: electrolessNickelPlatingContent.id
        }
      })
    }

    const qualityChecks = [
      { title: "Thickness Testing", description: "Magnetic and X-ray fluorescence testing", order: 0 },
      { title: "Adhesion Testing", description: "ASTM B571 bend and impact tests", order: 1 },
      { title: "Corrosion Testing", description: "Salt spray testing per ASTM B117", order: 2 },
      { title: "Hardness Testing", description: "Microhardness testing for wear resistance", order: 3 }
    ]

    for (const check of qualityChecks) {
      await prisma.electrolessNickelPlatingQualityCheck.create({
        data: {
          ...check,
          contentId: electrolessNickelPlatingContent.id
        }
      })
    }

    logger.log('✅ Electroless nickel plating content seeded successfully')
  } catch (error) {
    logger.error('❌ Error seeding electroless nickel plating content:', error)
    throw error
  }
} 
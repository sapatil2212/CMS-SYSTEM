import { logger } from '@/lib/logger';
import {  PrismaClient  } from '@prisma/client';

const prisma = new PrismaClient()

export default async function seedMolykote() {
  try {
    const molykoteContent = await prisma.molykoteContent.create({
      data: {
        heroTitle: "Premium Molykote Lubrication Services",
        heroSubtitle: "Advanced Lubrication Solutions",
        heroDescription: "High-performance Molykote lubrication services providing superior friction reduction and wear protection for demanding industrial applications.",
        heroImage: "/uploads/molykote/hero.jpg",
        whatIsTitle: "What is Molykote?",
        whatIsDescription: "Molykote is a family of high-performance lubricants and coatings that provide exceptional friction reduction, wear protection, and corrosion resistance. These advanced formulations are designed for extreme conditions and long-lasting performance.",
        whatIsImage: "/uploads/molykote/what-is.jpg",
        whatIsBestFor: "Friction reduction\nWear protection\nCorrosion resistance\nHigh temperature\nExtreme conditions",
        whatIsMaterials: "Steel alloys\nAluminum\nCopper alloys\nPlastics\nCeramics",
        whatIsAlkalineOffers: "Alkalyne offers comprehensive Molykote lubrication services with various formulations for different applications.",
        benefitsTitle: "Key Advantages",
        benefitsSubtitle: "Why leading manufacturers choose Molykote",
        processTitle: "Our Molykote Process",
        processSubtitle: "Advanced lubrication technology for superior performance",
        applicationsTitle: "Molykote Applications",
        applicationsSubtitle: "Critical for industries requiring advanced lubrication solutions",
        industriesTitle: "Industries We Serve",
        industriesSubtitle: "Trusted by leading manufacturers across diverse sectors",
        qualityTitle: "Quality Commitment",
        qualityDescription: "Alkalyne maintains rigorous quality standards for every Molykote treated component",
        qualityImage: "/uploads/molykote/quality.jpg",
        ctaTitle: "Need Molykote Lubrication?",
        ctaDescription: "From prototype batches to high-volume production, we deliver Molykote lubrication that meets exacting standards",
      }
    })

    const benefits = [
      { icon: "Zap", title: "Friction Reduction", description: "Superior friction reduction for smooth operation", order: 0 },
      { icon: "Shield", title: "Wear Protection", description: "Excellent protection against wear and damage", order: 1 },
      { icon: "Activity", title: "Corrosion Resistance", description: "Protection against rust and corrosion", order: 2 },
      { icon: "Thermometer", title: "High Temperature", description: "Performance in extreme temperature conditions", order: 3 },
      { icon: "Clock", title: "Long Lasting", description: "Extended service life and durability", order: 4 },
      { icon: "Check", title: "Versatile", description: "Suitable for various applications and materials", order: 5 }
    ]

    for (const benefit of benefits) {
      await prisma.molykoteBenefit.create({
        data: {
          ...benefit,
          contentId: molykoteContent.id
        }
      })
    }

    const processSteps = [
      { step: "1", title: "Surface Preparation", description: "Cleaning, degreasing, and activation", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", order: 0 },
      { step: "2", title: "Application", description: "Molykote lubrication application", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z", order: 1 },
      { step: "3", title: "Curing Process", description: "Thermal curing and bonding", icon: "M13 10V3L4 14h7v7l9-11h-7z", order: 2 },
      { step: "4", title: "Final Inspection", description: "Quality control and finishing", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z", order: 3 }
    ]

    for (const step of processSteps) {
      await prisma.molykoteProcessStep.create({
        data: {
          ...step,
          contentId: molykoteContent.id
        }
      })
    }

    const applications = [
      { title: "Automotive Components", image: "/uploads/molykote/automotive.jpg", items: JSON.stringify(["Bearings", "Gears", "Suspension parts", "Engine components"]), order: 0 },
      { title: "Industrial Machinery", image: "/uploads/molykote/industrial.jpg", items: JSON.stringify(["Pumps", "Motors", "Conveyors", "Hydraulic systems"]), order: 1 },
      { title: "Aerospace", image: "/uploads/molykote/aerospace.jpg", items: JSON.stringify(["Landing gear", "Control systems", "Engine parts", "Actuators"]), order: 2 }
    ]

    for (const app of applications) {
      await prisma.molykoteApplication.create({
        data: {
          ...app,
          contentId: molykoteContent.id
        }
      })
    }

    const industries = [
      { name: "Automotive", icon: "Car", examples: JSON.stringify(["Bearings", "Gears", "Suspension parts"]), image: "/uploads/molykote/automotive-industry.jpg", order: 0 },
      { name: "Industrial", icon: "Cpu", examples: JSON.stringify(["Pumps", "Motors", "Conveyors"]), image: "/uploads/molykote/industrial-industry.jpg", order: 1 },
      { name: "Aerospace", icon: "Plane", examples: JSON.stringify(["Landing gear", "Control systems", "Engine parts"]), image: "/uploads/molykote/aerospace-industry.jpg", order: 2 }
    ]

    for (const industry of industries) {
      await prisma.molykoteIndustry.create({
        data: {
          ...industry,
          contentId: molykoteContent.id
        }
      })
    }

    const qualityChecks = [
      { title: "Friction Testing", description: "Coefficient of friction measurement", order: 0 },
      { title: "Wear Testing", description: "ASTM wear resistance testing", order: 1 },
      { title: "Corrosion Testing", description: "Salt spray testing per ASTM B117", order: 2 },
      { title: "Appearance Inspection", description: "Visual and finish verification", order: 3 }
    ]

    for (const check of qualityChecks) {
      await prisma.molykoteQualityCheck.create({
        data: {
          ...check,
          contentId: molykoteContent.id
        }
      })
    }

    logger.log('✅ Molykote content seeded successfully')
  } catch (error) {
    logger.error('❌ Error seeding Molykote content:', error)
    throw error
  }
} 
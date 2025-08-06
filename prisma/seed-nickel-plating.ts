import { logger } from '@/lib/logger';
import {  PrismaClient  } from '@prisma/client';

const prisma = new PrismaClient()

export default async function seedNickelPlating() {
  try {
    // Create Nickel Plating Content
    const nickelPlatingContent = await prisma.nickelPlatingContent.create({
      data: {
        heroTitle: "Premium Nickel Plating Services in India",
        heroSubtitle: "Durability Meets Performance",
        heroDescription: "Professional nickel electroplating services providing superior corrosion resistance, wear protection, and attractive finishes for industrial and decorative applications.",
        heroImage: "/uploads/nickel-plating/hero.jpg",
        whatIsTitle: "What is Nickel Plating?",
        whatIsDescription: "Nickel electroplating deposits a uniform layer of nickel onto metal substrates through electrochemical processes. Known for its excellent corrosion resistance, hardness, and attractive appearance, nickel plating serves both functional and decorative purposes across various industries.",
        whatIsImage: "/uploads/nickel-plating/what-is.jpg",
        whatIsBestFor: "Automotive components\nIndustrial equipment\nDecorative applications\nWear-resistant parts\nCorrosion protection",
        whatIsMaterials: "Steel and iron\nCopper and brass\nZinc die castings\nAluminum (with proper preparation)\nPlastic substrates",
        whatIsAlkalineOffers: "Alkalyne offers both decorative and engineering nickel plating with various finish options including bright, semi-bright, and satin nickel.",
        benefitsTitle: "Key Advantages",
        benefitsSubtitle: "Why leading manufacturers choose nickel plating for critical applications",
        processTitle: "Our Nickel Plating Process",
        processSubtitle: "Precision-controlled deposition for consistent quality",
        applicationsTitle: "Nickel Plating Applications",
        applicationsSubtitle: "Essential for industries requiring durability and aesthetic appeal",
        industriesTitle: "Industries We Serve",
        industriesSubtitle: "Trusted by leading manufacturers across diverse sectors",
        qualityTitle: "Quality Commitment",
        qualityDescription: "Alkalyne maintains rigorous quality standards for every nickel-plated component",
        qualityImage: "/uploads/nickel-plating/quality.jpg",
        ctaTitle: "Need Precision Nickel Plating?",
        ctaDescription: "From prototype batches to high-volume production, we deliver nickel plating that meets exacting standards",
      }
    })

    // Create Benefits
    const benefits = [
      { icon: "Shield", title: "Corrosion Resistance", description: "Excellent protection against rust and environmental damage", order: 0 },
      { icon: "Award", title: "Attractive Finish", description: "Beautiful lustrous appearance for decorative applications", order: 1 },
      { icon: "Activity", title: "Wear Resistance", description: "Hard surface provides excellent wear and abrasion resistance", order: 2 },
      { icon: "Layers", title: "Uniform Coverage", description: "Even coating thickness on complex geometries", order: 3 },
      { icon: "TestTube2", title: "Chemical Stability", description: "Resistant to various chemicals and environments", order: 4 },
      { icon: "Check", title: "Versatile Process", description: "Suitable for wide range of substrates and applications", order: 5 }
    ]

    for (const benefit of benefits) {
      await prisma.nickelPlatingBenefit.create({
        data: {
          ...benefit,
          contentId: nickelPlatingContent.id
        }
      })
    }

    // Create Process Steps
    const processSteps = [
      { step: "1", title: "Surface Preparation", description: "Cleaning, degreasing, and activation", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", order: 0 },
      { step: "2", title: "Nickel Deposition", description: "Electrochemical nickel plating process", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z", order: 1 },
      { step: "3", title: "Quality Control", description: "Thickness and appearance verification", icon: "M13 10V3L4 14h7v7l9-11h-7z", order: 2 },
      { step: "4", title: "Final Processing", description: "Rinsing, drying, and finishing", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z", order: 3 }
    ]

    for (const step of processSteps) {
      await prisma.nickelPlatingProcessStep.create({
        data: {
          ...step,
          contentId: nickelPlatingContent.id
        }
      })
    }

    // Create Applications
    const applications = [
      { title: "Automotive Components", image: "/uploads/nickel-plating/automotive.jpg", items: JSON.stringify(["Trim pieces", "Bumpers", "Grilles", "Hardware"]), order: 0 },
      { title: "Industrial Equipment", image: "/uploads/nickel-plating/industrial.jpg", items: JSON.stringify(["Machine parts", "Tools", "Valves", "Fittings"]), order: 1 },
      { title: "Decorative Items", image: "/uploads/nickel-plating/decorative.jpg", items: JSON.stringify(["Bathroom fixtures", "Lighting", "Furniture hardware", "Appliances"]), order: 2 }
    ]

    for (const app of applications) {
      await prisma.nickelPlatingApplication.create({
        data: {
          ...app,
          contentId: nickelPlatingContent.id
        }
      })
    }

    // Create Industries
    const industries = [
      { name: "Automotive", icon: "Wrench", examples: JSON.stringify(["Trim pieces", "Bumpers", "Hardware"]), image: "/uploads/nickel-plating/automotive-industry.jpg", order: 0 },
      { name: "Industrial", icon: "Cpu", examples: JSON.stringify(["Machine parts", "Tools", "Valves"]), image: "/uploads/nickel-plating/industrial-industry.jpg", order: 1 },
      { name: "Decorative", icon: "Award", examples: JSON.stringify(["Fixtures", "Lighting", "Hardware"]), image: "/uploads/nickel-plating/decorative-industry.jpg", order: 2 }
    ]

    for (const industry of industries) {
      await prisma.nickelPlatingIndustry.create({
        data: {
          ...industry,
          contentId: nickelPlatingContent.id
        }
      })
    }

    // Create Quality Checks
    const qualityChecks = [
      { title: "Thickness Testing", description: "X-ray fluorescence and magnetic testing", order: 0 },
      { title: "Adhesion Testing", description: "ASTM B571 bend and impact tests", order: 1 },
      { title: "Corrosion Testing", description: "Salt spray testing per ASTM B117", order: 2 },
      { title: "Appearance Inspection", description: "Visual quality and finish verification", order: 3 }
    ]

    for (const check of qualityChecks) {
      await prisma.nickelPlatingQualityCheck.create({
        data: {
          ...check,
          contentId: nickelPlatingContent.id
        }
      })
    }

    logger.log('✅ Nickel plating content seeded successfully')
  } catch (error) {
    logger.error('❌ Error seeding nickel plating content:', error)
    throw error
  }
} 
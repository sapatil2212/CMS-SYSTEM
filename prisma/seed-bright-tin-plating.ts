import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function seedBrightTinPlating() {
  try {
    const brightTinPlatingContent = await prisma.brightTinPlatingContent.create({
      data: {
        heroTitle: "Premium Bright Tin Plating Services",
        heroSubtitle: "Lustrous Finish for Electronics",
        heroDescription: "High-quality bright tin plating providing excellent solderability and conductivity for electronic components and precision applications.",
        heroImage: "/uploads/bright-tin-plating/hero.jpg",
        whatIsTitle: "What is Bright Tin Plating?",
        whatIsDescription: "Bright tin plating is an electrochemical process that deposits a bright, reflective tin coating on metal surfaces. This process provides excellent solderability, conductivity, and corrosion resistance, making it ideal for electronic components and electrical applications.",
        whatIsImage: "/uploads/bright-tin-plating/what-is.jpg",
        whatIsBestFor: "Electronic components\nSolderability\nConductivity\nCorrosion resistance\nBright finish",
        whatIsMaterials: "Copper alloys\nSteel\nAluminum\nBrass\nBronze",
        whatIsAlkalineOffers: "Alkalyne offers comprehensive bright tin plating with various thickness options for different applications.",
        benefitsTitle: "Key Advantages",
        benefitsSubtitle: "Why leading manufacturers choose bright tin plating",
        processTitle: "Our Bright Tin Process",
        processSubtitle: "Electrochemical deposition for superior finish",
        applicationsTitle: "Bright Tin Applications",
        applicationsSubtitle: "Critical for industries requiring excellent solderability and conductivity",
        industriesTitle: "Industries We Serve",
        industriesSubtitle: "Trusted by leading manufacturers across diverse sectors",
        qualityTitle: "Quality Commitment",
        qualityDescription: "Alkalyne maintains rigorous quality standards for every bright tin-plated component",
        qualityImage: "/uploads/bright-tin-plating/quality.jpg",
        ctaTitle: "Need Bright Tin Plating?",
        ctaDescription: "From prototype batches to high-volume production, we deliver bright tin plating that meets exacting standards",
      }
    })

    const benefits = [
      { icon: "Zap", title: "Excellent Solderability", description: "Superior soldering performance for electronics", order: 0 },
      { icon: "Activity", title: "High Conductivity", description: "Excellent electrical conductivity properties", order: 1 },
      { icon: "Shield", title: "Corrosion Resistance", description: "Protection against oxidation and tarnishing", order: 2 },
      { icon: "Star", title: "Bright Finish", description: "Lustrous, reflective surface appearance", order: 3 },
      { icon: "TestTube2", title: "Chemical Stability", description: "Resistance to various chemical environments", order: 4 },
      { icon: "Check", title: "Cost Effective", description: "Economical plating solution for electronics", order: 5 }
    ]

    for (const benefit of benefits) {
      await prisma.brightTinPlatingBenefit.create({
        data: {
          ...benefit,
          contentId: brightTinPlatingContent.id
        }
      })
    }

    const processSteps = [
      { step: "1", title: "Surface Preparation", description: "Cleaning, degreasing, and activation", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", order: 0 },
      { step: "2", title: "Tin Deposition", description: "Electrochemical tin plating process", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z", order: 1 },
      { step: "3", title: "Brightening", description: "Chemical brightening treatment", icon: "M13 10V3L4 14h7v7l9-11h-7z", order: 2 },
      { step: "4", title: "Final Inspection", description: "Quality control and finishing", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z", order: 3 }
    ]

    for (const step of processSteps) {
      await prisma.brightTinPlatingProcessStep.create({
        data: {
          ...step,
          contentId: brightTinPlatingContent.id
        }
      })
    }

    const applications = [
      { title: "Electronic Components", image: "/uploads/bright-tin-plating/electronics.jpg", items: JSON.stringify(["Connectors", "Terminals", "Circuit boards", "Switches"]), order: 0 },
      { title: "Electrical Hardware", image: "/uploads/bright-tin-plating/hardware.jpg", items: JSON.stringify(["Fasteners", "Brackets", "Mounting hardware", "Cable assemblies"]), order: 1 },
      { title: "Automotive Electronics", image: "/uploads/bright-tin-plating/automotive.jpg", items: JSON.stringify(["Sensors", "Control modules", "Wiring harnesses", "Relays"]), order: 2 }
    ]

    for (const app of applications) {
      await prisma.brightTinPlatingApplication.create({
        data: {
          ...app,
          contentId: brightTinPlatingContent.id
        }
      })
    }

    const industries = [
      { name: "Electronics", icon: "Cpu", examples: JSON.stringify(["Connectors", "Terminals", "Circuit boards"]), image: "/uploads/bright-tin-plating/electronics-industry.jpg", order: 0 },
      { name: "Automotive", icon: "Car", examples: JSON.stringify(["Sensors", "Control modules", "Wiring harnesses"]), image: "/uploads/bright-tin-plating/automotive-industry.jpg", order: 1 },
      { name: "Aerospace", icon: "Plane", examples: JSON.stringify(["Avionics", "Control systems", "Electrical components"]), image: "/uploads/bright-tin-plating/aerospace-industry.jpg", order: 2 }
    ]

    for (const industry of industries) {
      await prisma.brightTinPlatingIndustry.create({
        data: {
          ...industry,
          contentId: brightTinPlatingContent.id
        }
      })
    }

    const qualityChecks = [
      { title: "Thickness Testing", description: "X-ray fluorescence and magnetic testing", order: 0 },
      { title: "Solderability Testing", description: "Wetting balance and solder flow tests", order: 1 },
      { title: "Adhesion Testing", description: "ASTM B571 bend and impact tests", order: 2 },
      { title: "Appearance Inspection", description: "Visual and brightness verification", order: 3 }
    ]

    for (const check of qualityChecks) {
      await prisma.brightTinPlatingQualityCheck.create({
        data: {
          ...check,
          contentId: brightTinPlatingContent.id
        }
      })
    }

    console.log('✅ Bright tin plating content seeded successfully')
  } catch (error) {
    console.error('❌ Error seeding bright tin plating content:', error)
    throw error
  }
} 
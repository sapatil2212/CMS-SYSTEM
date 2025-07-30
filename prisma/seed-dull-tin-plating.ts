import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function seedDullTinPlating() {
  try {
    const dullTinPlatingContent = await prisma.dullTinPlatingContent.create({
      data: {
        heroTitle: "Premium Dull Tin Plating Services",
        heroSubtitle: "Matte Finish for Precision Applications",
        heroDescription: "High-quality dull tin plating providing excellent solderability with a matte finish for precision electronic and mechanical applications.",
        heroImage: "/uploads/dull-tin-plating/hero.jpg",
        whatIsTitle: "What is Dull Tin Plating?",
        whatIsDescription: "Dull tin plating is an electrochemical process that deposits a matte, non-reflective tin coating on metal surfaces. This process provides excellent solderability and conductivity while offering a subdued appearance ideal for precision applications.",
        whatIsImage: "/uploads/dull-tin-plating/what-is.jpg",
        whatIsBestFor: "Precision components\nSolderability\nConductivity\nMatte finish\nReduced glare",
        whatIsMaterials: "Copper alloys\nSteel\nAluminum\nBrass\nBronze",
        whatIsAlkalineOffers: "Alkalyne offers comprehensive dull tin plating with various thickness options for different applications.",
        benefitsTitle: "Key Advantages",
        benefitsSubtitle: "Why leading manufacturers choose dull tin plating",
        processTitle: "Our Dull Tin Process",
        processSubtitle: "Electrochemical deposition for matte finish",
        applicationsTitle: "Dull Tin Applications",
        applicationsSubtitle: "Critical for industries requiring excellent solderability with matte finish",
        industriesTitle: "Industries We Serve",
        industriesSubtitle: "Trusted by leading manufacturers across diverse sectors",
        qualityTitle: "Quality Commitment",
        qualityDescription: "Alkalyne maintains rigorous quality standards for every dull tin-plated component",
        qualityImage: "/uploads/dull-tin-plating/quality.jpg",
        ctaTitle: "Need Dull Tin Plating?",
        ctaDescription: "From prototype batches to high-volume production, we deliver dull tin plating that meets exacting standards",
      }
    })

    const benefits = [
      { icon: "Zap", title: "Excellent Solderability", description: "Superior soldering performance for electronics", order: 0 },
      { icon: "Activity", title: "High Conductivity", description: "Excellent electrical conductivity properties", order: 1 },
      { icon: "Shield", title: "Corrosion Resistance", description: "Protection against oxidation and tarnishing", order: 2 },
      { icon: "Eye", title: "Matte Finish", description: "Non-reflective, subdued surface appearance", order: 3 },
      { icon: "TestTube2", title: "Chemical Stability", description: "Resistance to various chemical environments", order: 4 },
      { icon: "Check", title: "Cost Effective", description: "Economical plating solution for precision applications", order: 5 }
    ]

    for (const benefit of benefits) {
      await prisma.dullTinPlatingBenefit.create({
        data: {
          ...benefit,
          contentId: dullTinPlatingContent.id
        }
      })
    }

    const processSteps = [
      { step: "1", title: "Surface Preparation", description: "Cleaning, degreasing, and activation", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", order: 0 },
      { step: "2", title: "Tin Deposition", description: "Electrochemical tin plating process", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z", order: 1 },
      { step: "3", title: "Matte Treatment", description: "Chemical matte finishing process", icon: "M13 10V3L4 14h7v7l9-11h-7z", order: 2 },
      { step: "4", title: "Final Inspection", description: "Quality control and finishing", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z", order: 3 }
    ]

    for (const step of processSteps) {
      await prisma.dullTinPlatingProcessStep.create({
        data: {
          ...step,
          contentId: dullTinPlatingContent.id
        }
      })
    }

    const applications = [
      { title: "Precision Electronics", image: "/uploads/dull-tin-plating/electronics.jpg", items: JSON.stringify(["Connectors", "Terminals", "Circuit boards", "Switches"]), order: 0 },
      { title: "Mechanical Components", image: "/uploads/dull-tin-plating/mechanical.jpg", items: JSON.stringify(["Fasteners", "Brackets", "Mounting hardware", "Bearings"]), order: 1 },
      { title: "Automotive Systems", image: "/uploads/dull-tin-plating/automotive.jpg", items: JSON.stringify(["Sensors", "Control modules", "Wiring harnesses", "Relays"]), order: 2 }
    ]

    for (const app of applications) {
      await prisma.dullTinPlatingApplication.create({
        data: {
          ...app,
          contentId: dullTinPlatingContent.id
        }
      })
    }

    const industries = [
      { name: "Electronics", icon: "Cpu", examples: JSON.stringify(["Connectors", "Terminals", "Circuit boards"]), image: "/uploads/dull-tin-plating/electronics-industry.jpg", order: 0 },
      { name: "Automotive", icon: "Car", examples: JSON.stringify(["Sensors", "Control modules", "Wiring harnesses"]), image: "/uploads/dull-tin-plating/automotive-industry.jpg", order: 1 },
      { name: "Aerospace", icon: "Plane", examples: JSON.stringify(["Avionics", "Control systems", "Electrical components"]), image: "/uploads/dull-tin-plating/aerospace-industry.jpg", order: 2 }
    ]

    for (const industry of industries) {
      await prisma.dullTinPlatingIndustry.create({
        data: {
          ...industry,
          contentId: dullTinPlatingContent.id
        }
      })
    }

    const qualityChecks = [
      { title: "Thickness Testing", description: "X-ray fluorescence and magnetic testing", order: 0 },
      { title: "Solderability Testing", description: "Wetting balance and solder flow tests", order: 1 },
      { title: "Adhesion Testing", description: "ASTM B571 bend and impact tests", order: 2 },
      { title: "Appearance Inspection", description: "Visual and matte finish verification", order: 3 }
    ]

    for (const check of qualityChecks) {
      await prisma.dullTinPlatingQualityCheck.create({
        data: {
          ...check,
          contentId: dullTinPlatingContent.id
        }
      })
    }

    console.log('✅ Dull tin plating content seeded successfully')
  } catch (error) {
    console.error('❌ Error seeding dull tin plating content:', error)
    throw error
  }
} 
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function seedBusbarPlating() {
  try {
    // Create Busbar Plating Content
    const busbarPlatingContent = await prisma.busbarPlatingContent.create({
      data: {
        heroTitle: "Professional Busbar Plating Services",
        heroSubtitle: "Electrical Conductivity & Protection",
        heroDescription: "Specialized busbar plating services providing superior electrical conductivity, corrosion resistance, and thermal management for electrical distribution systems.",
        heroImage: "/uploads/busbar-plating/hero.jpg",
        whatIsTitle: "What is Busbar Plating?",
        whatIsDescription: "Busbar plating involves applying conductive metal coatings to copper or aluminum busbars to enhance electrical conductivity, prevent oxidation, and improve thermal performance in electrical distribution systems.",
        whatIsImage: "/uploads/busbar-plating/what-is.jpg",
        whatIsBestFor: "Electrical distribution\nPower systems\nData centers\nIndustrial applications\nRenewable energy",
        whatIsMaterials: "Copper busbars\nAluminum busbars\nElectrical conductors\nPower distribution components\nSwitchgear parts",
        whatIsAlkalineOffers: "Alkalyne offers specialized busbar plating with silver, tin, and nickel coatings for optimal electrical performance and longevity.",
        benefitsTitle: "Key Advantages",
        benefitsSubtitle: "Why electrical engineers choose busbar plating for critical power systems",
        processTitle: "Our Busbar Plating Process",
        processSubtitle: "Precision coating for electrical excellence",
        applicationsTitle: "Busbar Plating Applications",
        applicationsSubtitle: "Critical for electrical distribution and power management systems",
        industriesTitle: "Industries We Serve",
        industriesSubtitle: "Powering diverse sectors with reliable electrical solutions",
        qualityTitle: "Quality Commitment",
        qualityDescription: "Alkalyne ensures every busbar meets stringent electrical and safety standards",
        qualityImage: "/uploads/busbar-plating/quality.jpg",
        ctaTitle: "Need Reliable Busbar Plating?",
        ctaDescription: "From single prototypes to large installations, we deliver busbar plating that powers performance",
      }
    })

    // Create Benefits
    const benefits = [
      { icon: "Zap", title: "Enhanced Conductivity", description: "Superior electrical conductivity for efficient power transmission", order: 0 },
      { icon: "Shield", title: "Corrosion Protection", description: "Prevents oxidation and maintains electrical integrity", order: 1 },
      { icon: "Activity", title: "Thermal Management", description: "Improved heat dissipation and thermal performance", order: 2 },
      { icon: "Award", title: "Long Service Life", description: "Extended operational life in demanding environments", order: 3 },
      { icon: "Check", title: "Safety Compliance", description: "Meets electrical safety and industry standards", order: 4 },
      { icon: "Layers", title: "Uniform Coverage", description: "Consistent coating on complex busbar geometries", order: 5 }
    ]

    for (const benefit of benefits) {
      await prisma.busbarPlatingBenefit.create({
        data: {
          ...benefit,
          contentId: busbarPlatingContent.id
        }
      })
    }

    // Create Process Steps
    const processSteps = [
      { step: "1", title: "Surface Preparation", description: "Cleaning and degreasing of busbars", icon: "preparation", order: 0 },
      { step: "2", title: "Coating Application", description: "Precision plating with conductive metals", icon: "coating", order: 1 },
      { step: "3", title: "Quality Testing", description: "Electrical and conductivity testing", icon: "testing", order: 2 },
      { step: "4", title: "Final Inspection", description: "Visual and dimensional verification", icon: "inspection", order: 3 }
    ]

    for (const step of processSteps) {
      await prisma.busbarPlatingProcessStep.create({
        data: {
          ...step,
          contentId: busbarPlatingContent.id
        }
      })
    }

    // Create Applications
    const applications = [
      { title: "Power Distribution", image: "/uploads/busbar-plating/power.jpg", items: JSON.stringify(["Switchgear", "Panel boards", "Distribution centers", "Transformers"]), order: 0 },
      { title: "Data Centers", image: "/uploads/busbar-plating/datacenter.jpg", items: JSON.stringify(["Server racks", "UPS systems", "Power distribution units", "Cooling systems"]), order: 1 },
      { title: "Renewable Energy", image: "/uploads/busbar-plating/renewable.jpg", items: JSON.stringify(["Solar inverters", "Wind turbines", "Battery systems", "Grid connections"]), order: 2 }
    ]

    for (const app of applications) {
      await prisma.busbarPlatingApplication.create({
        data: {
          ...app,
          contentId: busbarPlatingContent.id
        }
      })
    }

    // Create Industries
    const industries = [
      { name: "Electrical", icon: "Zap", examples: JSON.stringify(["Power distribution", "Switchgear", "Transformers"]), image: "/uploads/busbar-plating/electrical-industry.jpg", order: 0 },
      { name: "Data Centers", icon: "Cpu", examples: JSON.stringify(["Server infrastructure", "UPS systems", "Cooling"]), image: "/uploads/busbar-plating/datacenter-industry.jpg", order: 1 },
      { name: "Renewable Energy", icon: "Activity", examples: JSON.stringify(["Solar systems", "Wind power", "Energy storage"]), image: "/uploads/busbar-plating/renewable-industry.jpg", order: 2 }
    ]

    for (const industry of industries) {
      await prisma.busbarPlatingIndustry.create({
        data: {
          ...industry,
          contentId: busbarPlatingContent.id
        }
      })
    }

    // Create Quality Checks
    const qualityChecks = [
      { title: "Conductivity Testing", description: "Electrical resistance and conductivity measurement", order: 0 },
      { title: "Coating Thickness", description: "Precise thickness measurement and uniformity", order: 1 },
      { title: "Adhesion Testing", description: "Coating adhesion and durability evaluation", order: 2 },
      { title: "Safety Compliance", description: "Electrical safety and industry standard verification", order: 3 }
    ]

    for (const check of qualityChecks) {
      await prisma.busbarPlatingQualityCheck.create({
        data: {
          ...check,
          contentId: busbarPlatingContent.id
        }
      })
    }

    console.log('✅ Busbar plating content seeded successfully')
  } catch (error) {
    console.error('❌ Error seeding busbar plating content:', error)
    throw error
  }
} 
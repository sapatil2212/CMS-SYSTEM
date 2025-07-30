import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function seedAluminium() {
  try {
    const aluminiumContent = await prisma.aluminiumContent.create({
      data: {
        heroTitle: "Specialised Aluminium Plating Services Across India",
        heroSubtitle: "Advanced Metal Finishing Solutions",
        heroDescription: "Reliable Protection, Enhanced Functionality, and Precision Finishing for Modern Industries",
        heroImage: "/uploads/aluminium/hero.jpg",
        whatIsTitle: "What is Aluminium Plating?",
        whatIsDescription: "Aluminium is a lightweight metal known for its strength-to-weight ratio and natural corrosion resistance. Plating enhances these properties for demanding applications, providing improved durability, conductivity, wear resistance, and decorative finishes.",
        whatIsImage: "/uploads/aluminium/what-is.jpg",
        whatIsBestFor: "Complex geometries\nPrecision components\nCorrosion resistance\nWear resistance\nUniform thickness",
        whatIsMaterials: "Steel alloys\nAluminum\nCopper alloys\nPlastics\nCeramics",
        whatIsAlkalineOffers: "Our specialised plating processes overcome aluminium's natural oxide layer challenges to ensure perfect adhesion and long-lasting performance.",
        benefitsTitle: "Key Benefits of Aluminium Plating",
        benefitsSubtitle: "Enhance your components with our specialised plating solutions",
        processTitle: "Our Plating Process",
        processSubtitle: "Precision steps to ensure optimal results for your aluminium components",
        applicationsTitle: "Aluminium Applications",
        applicationsSubtitle: "Critical for industries requiring enhanced functionality",
        industriesTitle: "Industries We Serve",
        industriesSubtitle: "Our aluminium plating solutions support critical applications across sectors",
        qualityTitle: "Quality Commitment",
        qualityDescription: "Alkalyne maintains rigorous quality standards for every aluminium-plated component",
        qualityImage: "/uploads/aluminium/quality.jpg",
        ctaTitle: "Ready to Enhance Your Aluminium Components?",
        ctaDescription: "Our team is ready to discuss your specific plating requirements and provide a tailored solution",
      }
    })

    const benefits = [
      { icon: "Shield", title: "Corrosion Resistance", description: "Protection against rust, oxidation, and chemicals", order: 0 },
      { icon: "Zap", title: "Enhanced Conductivity", description: "Improved electrical performance with silver/gold plating", order: 1 },
      { icon: "Layers", title: "Wear Resistance", description: "Increased durability for high-friction applications", order: 2 },
      { icon: "Thermometer", title: "Thermal Management", description: "Better heat dissipation for electronics", order: 3 },
      { icon: "Award", title: "Aesthetic Finishes", description: "Decorative and functional surface treatments", order: 4 },
      { icon: "Factory", title: "Chemical Resistance", description: "Withstands harsh industrial environments", order: 5 }
    ]

    for (const benefit of benefits) {
      await prisma.aluminiumBenefit.create({
        data: {
          ...benefit,
          contentId: aluminiumContent.id
        }
      })
    }

    const processSteps = [
      { step: "1", title: "Surface Preparation", description: "Thorough cleaning and degreasing to remove contaminants", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", order: 0 },
      { step: "2", title: "Zincating", description: "Specialized zinc immersion for optimal adhesion", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z", order: 1 },
      { step: "3", title: "Plating Bath", description: "Precision deposition in controlled solutions", icon: "M13 10V3L4 14h7v7l9-11h-7z", order: 2 },
      { step: "4", title: "Quality Control", description: "Rigorous testing for thickness and performance", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z", order: 3 },
      { step: "5", title: "Packaging", description: "Secure packaging for transportation", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", order: 4 }
    ]

    for (const step of processSteps) {
      await prisma.aluminiumProcessStep.create({
        data: {
          ...step,
          contentId: aluminiumContent.id
        }
      })
    }

    const applications = [
      { title: "Precision Components", image: "/uploads/aluminium/precision.jpg", items: JSON.stringify(["Valves", "Pumps", "Bearings", "Gears"]), order: 0 },
      { title: "Electronics", image: "/uploads/aluminium/electronics.jpg", items: JSON.stringify(["Connectors", "Switches", "Circuit boards", "Housings"]), order: 1 },
      { title: "Aerospace", image: "/uploads/aluminium/aerospace.jpg", items: JSON.stringify(["Engine parts", "Landing gear", "Hydraulic systems", "Fasteners"]), order: 2 }
    ]

    for (const app of applications) {
      await prisma.aluminiumApplication.create({
        data: {
          ...app,
          contentId: aluminiumContent.id
        }
      })
    }

    const industries = [
      { name: "Aerospace & Aviation", icon: "Rocket", examples: JSON.stringify(["Fuselage parts", "Landing gear", "Avionics housings"]), image: "/uploads/aluminium/aerospace-industry.jpg", order: 0 },
      { name: "Automotive & EV", icon: "Car", examples: JSON.stringify(["Battery enclosures", "Motor components", "Structural parts"]), image: "/uploads/aluminium/automotive-industry.jpg", order: 1 },
      { name: "Defence & Security", icon: "Shield", examples: JSON.stringify(["Armor components", "Marine hardware", "Aircraft parts"]), image: "/uploads/aluminium/defence-industry.jpg", order: 2 },
      { name: "Electronics", icon: "CircuitBoard", examples: JSON.stringify(["Heat sinks", "Connectors", "RF shielding"]), image: "/uploads/aluminium/electronics-industry.jpg", order: 3 }
    ]

    for (const industry of industries) {
      await prisma.aluminiumIndustry.create({
        data: {
          ...industry,
          contentId: aluminiumContent.id
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
      await prisma.aluminiumQualityCheck.create({
        data: {
          ...check,
          contentId: aluminiumContent.id
        }
      })
    }

    console.log('✅ Aluminium content seeded successfully')
  } catch (error) {
    console.error('❌ Error seeding aluminium content:', error)
    throw error
  }
} 
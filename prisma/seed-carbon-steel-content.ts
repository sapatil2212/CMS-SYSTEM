import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedCarbonSteelContent() {
  console.log('🔶 Seeding Carbon Steel content...')

  try {
    // Clear existing content
    await prisma.carbonSteelContent.deleteMany()
    
    // Create new carbon steel content
    const carbonSteelContent = await prisma.carbonSteelContent.create({
      data: {
        heroTitle: "High-Performance Carbon Steel Plating Solutions",
        heroSubtitle: "Strength, Durability & Cost-Effectiveness",
        heroDescription: "Enhanced protection and performance for industrial applications requiring superior mechanical properties",
        heroImage: "/uploads/carbon-steel/hero-carbon-steel.jpg",
        whatIsTitle: "What is Carbon Steel Plating?",
        whatIsDescription: "Carbon steel plating involves applying protective coatings to carbon steel substrates to enhance corrosion resistance, wear resistance, and aesthetic appeal. This process extends the life of carbon steel components while maintaining their exceptional strength and cost-effectiveness.",
        whatIsImage: "/uploads/carbon-steel/carbon-process.jpg",
        whatIsBestFor: "Structural applications\nMachinery components\nAutomotive parts\nConstruction materials\nIndustrial equipment",
        whatIsMaterials: "Low carbon steel\nMedium carbon steel\nHigh carbon steel\nCast steel components\nForged steel parts",
        whatIsAlkalineOffers: "Our specialized carbon steel plating processes provide enhanced corrosion protection while preserving the inherent strength and workability of carbon steel substrates.",
        benefitsTitle: "Carbon Steel Plating Advantages",
        benefitsSubtitle: "Maximize performance and longevity of your carbon steel components",
        processTitle: "Our Carbon Steel Process",
        processSubtitle: "Advanced coating techniques for optimal protection and performance",
        applicationsTitle: "Carbon Steel Applications",
        applicationsSubtitle: "Versatile solutions for demanding industrial and structural applications",
        industriesTitle: "Industries We Serve",
        industriesSubtitle: "Carbon steel plating solutions for heavy-duty applications across key industries",
        qualityTitle: "Quality Standards",
        qualityDescription: "Each carbon steel component is tested for coating integrity, adhesion strength, and corrosion resistance to ensure long-term performance",
        qualityImage: "/uploads/carbon-steel/quality-testing.jpg",
        ctaTitle: "Enhance Your Carbon Steel Components?",
        ctaDescription: "Discover how our carbon steel plating can improve the performance and longevity of your applications",
        benefits: {
          create: [
            {
              icon: "Shield",
              title: "Enhanced Corrosion Protection",
              description: "Superior protection against rust and environmental degradation",
              order: 0
            },
            {
              icon: "Layers",
              title: "High Strength Properties",
              description: "Excellent structural integrity and load-bearing capacity for demanding applications",
              order: 1
            },
            {
              icon: "Factory",
              title: "Cost-Effective Solution",
              description: "Economical option for large-scale industrial and construction applications",
              order: 2
            },
            {
              icon: "Thermometer",
              title: "Heat Treatment Compatibility",
              description: "Responds well to heat treatment for controlled hardness and strength",
              order: 3
            },
            {
              icon: "Award",
              title: "Versatile Applications",
              description: "Suitable for construction, automotive, machinery, and tool applications",
              order: 4
            },
            {
              icon: "Battery",
              title: "Magnetic Properties",
              description: "Ferromagnetic characteristics ideal for electromagnetic applications",
              order: 5
            }
          ]
        },
        processSteps: {
          create: [
            {
              step: "1",
              title: "Surface Preparation",
              description: "Thorough cleaning, scale removal, and surface conditioning for optimal coating",
              icon: "ClipboardCheck",
              order: 0
            },
            {
              step: "2",
              title: "Pre-treatment",
              description: "Phosphating or chemical conversion coating for enhanced adhesion",
              icon: "Layers",
              order: 1
            },
            {
              step: "3",
              title: "Coating Application",
              description: "Electroplating or hot-dip process for protective layer deposition",
              icon: "Zap",
              order: 2
            },
            {
              step: "4",
              title: "Heat Treatment",
              description: "Optional thermal processing for enhanced mechanical properties",
              icon: "Thermometer",
              order: 3
            },
            {
              step: "5",
              title: "Final Inspection",
              description: "Comprehensive testing for coating quality and performance verification",
              icon: "Award",
              order: 4
            }
          ]
        },
        applications: {
          create: [
            {
              title: "Construction & Infrastructure",
              image: "/uploads/carbon-steel/construction.jpg",
              items: JSON.stringify(["Structural beams", "Reinforcement bars", "Bridges", "Building frameworks"]),
              order: 0
            },
            {
              title: "Automotive & Transportation",
              image: "/uploads/carbon-steel/automotive.jpg",
              items: JSON.stringify(["Engine components", "Chassis parts", "Drive shafts", "Suspension systems"]),
              order: 1
            },
            {
              title: "Industrial Machinery",
              image: "/uploads/carbon-steel/machinery.jpg",
              items: JSON.stringify(["Gears", "Shafts", "Cutting tools", "Machine frames"]),
              order: 2
            }
          ]
        },
        industries: {
          create: [
            {
              name: "Construction & Infrastructure",
              icon: "Factory",
              examples: JSON.stringify(["Building construction", "Bridge building", "Infrastructure projects"]),
              image: "/uploads/carbon-steel/construction-industry.jpg",
              order: 0
            },
            {
              name: "Automotive Manufacturing",
              icon: "Car",
              examples: JSON.stringify(["Vehicle production", "Parts manufacturing", "Assembly lines"]),
              image: "/uploads/carbon-steel/automotive-industry.jpg",
              order: 1
            },
            {
              name: "Heavy Machinery",
              icon: "Battery",
              examples: JSON.stringify(["Mining equipment", "Agricultural machinery", "Industrial tools"]),
              image: "/uploads/carbon-steel/machinery-industry.jpg",
              order: 2
            },
            {
              name: "Energy & Power",
              icon: "Thermometer",
              examples: JSON.stringify(["Power plants", "Transmission equipment", "Pipeline systems"]),
              image: "/uploads/carbon-steel/energy-industry.jpg",
              order: 3
            }
          ]
        },
        qualityChecks: {
          create: [
            {
              title: "Coating Thickness",
              description: "Magnetic and eddy current measurement for uniform coating thickness",
              order: 0
            },
            {
              title: "Adhesion Strength",
              description: "Pull-off and cross-cut testing for coating bond integrity",
              order: 1
            },
            {
              title: "Hardness Testing",
              description: "Rockwell and Vickers hardness measurement for strength verification",
              order: 2
            },
            {
              title: "Corrosion Resistance",
              description: "Salt spray and environmental testing for long-term protection",
              order: 3
            }
          ]
        }
      }
    })

    console.log('✅ Carbon Steel content seeded successfully')
    return carbonSteelContent
  } catch (error) {
    console.error('❌ Error seeding carbon steel content:', error)
    throw error
  }
}
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedAluminiumContent() {
  console.log('🔶 Seeding Aluminium content...')

  try {
    // Clear existing content
    await prisma.aluminiumContent.deleteMany()
    
    // Create new aluminium content
    const aluminiumContent = await prisma.aluminiumContent.create({
      data: {
        heroTitle: "Specialised Aluminium Plating Services Across India",
        heroSubtitle: "Advanced Metal Finishing Solutions",
        heroDescription: "Reliable Protection, Enhanced Functionality, and Precision Finishing for Modern Industries",
        heroImage: "/uploads/aluminium/hero-aluminium-plating.jpg",
        whatIsTitle: "What is Aluminium Plating?",
        whatIsDescription: "Aluminium is a lightweight metal known for its excellent strength-to-weight ratio and natural corrosion resistance. Our specialized plating processes enhance these inherent properties for demanding applications, providing improved durability, conductivity, wear resistance, and decorative finishes.",
        whatIsImage: "/uploads/aluminium/aluminium-process.jpg",
        whatIsBestFor: "Complex geometries\nPrecision components\nCorrosion resistance\nWear resistance\nUniform thickness",
        whatIsMaterials: "Steel alloys\nAluminum substrates\nCopper alloys\nPlastics\nCeramics",
        whatIsAlkalineOffers: "Our specialised plating processes overcome aluminium's natural oxide layer challenges to ensure perfect adhesion and long-lasting performance for critical applications.",
        benefitsTitle: "Key Benefits of Aluminium Plating",
        benefitsSubtitle: "Enhance your components with our specialised plating solutions",
        processTitle: "Our Aluminium Plating Process",
        processSubtitle: "Precision steps to ensure optimal results for your aluminium components",
        applicationsTitle: "Aluminium Applications",
        applicationsSubtitle: "Critical for industries requiring enhanced functionality and lightweight solutions",
        industriesTitle: "Industries We Serve",
        industriesSubtitle: "Our aluminium plating solutions support critical applications across diverse sectors",
        qualityTitle: "Quality Commitment",
        qualityDescription: "Alkalyne maintains rigorous quality standards for every aluminium-plated component, ensuring performance excellence",
        qualityImage: "/uploads/aluminium/quality-control.jpg",
        ctaTitle: "Ready to Enhance Your Aluminium Components?",
        ctaDescription: "Our team is ready to discuss your specific plating requirements and provide a tailored solution for your application",
        benefits: {
          create: [
            {
              icon: "Shield",
              title: "Lightweight Strength",
              description: "Superior strength-to-weight ratio ideal for aerospace and automotive applications",
              order: 0
            },
            {
              icon: "Zap",
              title: "Enhanced Conductivity",
              description: "Improved electrical and thermal conductivity with specialized plating treatments",
              order: 1
            },
            {
              icon: "Layers",
              title: "Corrosion Resistance",
              description: "Advanced protection against oxidation and environmental damage",
              order: 2
            },
            {
              icon: "Thermometer",
              title: "Thermal Management",
              description: "Excellent heat dissipation for electronics and heat exchanger applications",
              order: 3
            },
            {
              icon: "Award",
              title: "Aesthetic Finishes",
              description: "Beautiful decorative and functional surface treatments for premium applications",
              order: 4
            },
            {
              icon: "Factory",
              title: "Chemical Resistance",
              description: "Withstands harsh industrial environments and chemical exposure",
              order: 5
            }
          ]
        },
        processSteps: {
          create: [
            {
              step: "1",
              title: "Surface Preparation",
              description: "Thorough cleaning and degreasing to remove contaminants and oxides",
              icon: "ClipboardCheck",
              order: 0
            },
            {
              step: "2",
              title: "Zincating Treatment",
              description: "Specialized zinc immersion process for optimal plating adhesion",
              icon: "Layers",
              order: 1
            },
            {
              step: "3",
              title: "Electroplating Process",
              description: "Precision deposition in controlled electrolyte solutions",
              icon: "Zap",
              order: 2
            },
            {
              step: "4",
              title: "Quality Control",
              description: "Rigorous testing for thickness uniformity and performance standards",
              icon: "Award",
              order: 3
            },
            {
              step: "5",
              title: "Packaging & Delivery",
              description: "Secure packaging and handling for safe transportation",
              icon: "Package",
              order: 4
            }
          ]
        },
        applications: {
          create: [
            {
              title: "Precision Components",
              image: "/uploads/aluminium/precision-components.jpg",
              items: JSON.stringify(["Valves", "Pumps", "Bearings", "Gears"]),
              order: 0
            },
            {
              title: "Electronics & Technology",
              image: "/uploads/aluminium/electronics.jpg",
              items: JSON.stringify(["Connectors", "Switches", "Circuit boards", "Heat sinks"]),
              order: 1
            },
            {
              title: "Aerospace & Aviation",
              image: "/uploads/aluminium/aerospace.jpg",
              items: JSON.stringify(["Engine parts", "Landing gear", "Hydraulic systems", "Fasteners"]),
              order: 2
            }
          ]
        },
        industries: {
          create: [
            {
              name: "Aerospace & Aviation",
              icon: "Rocket",
              examples: JSON.stringify(["Aircraft fuselage", "Landing gear components", "Avionics housings"]),
              image: "/uploads/aluminium/aerospace-industry.jpg",
              order: 0
            },
            {
              name: "Automotive & EV",
              icon: "Car",
              examples: JSON.stringify(["Battery enclosures", "Motor components", "Lightweight structures"]),
              image: "/uploads/aluminium/automotive-industry.jpg",
              order: 1
            },
            {
              name: "Defence & Security",
              icon: "Shield",
              examples: JSON.stringify(["Armor components", "Marine hardware", "Military aircraft parts"]),
              image: "/uploads/aluminium/defence-industry.jpg",
              order: 2
            },
            {
              name: "Electronics & Technology",
              icon: "CircuitBoard",
              examples: JSON.stringify(["Heat sinks", "RF connectors", "EMI shielding"]),
              image: "/uploads/aluminium/electronics-industry.jpg",
              order: 3
            }
          ]
        },
        qualityChecks: {
          create: [
            {
              title: "Thickness Testing",
              description: "Magnetic and X-ray fluorescence testing for precise thickness measurement",
              order: 0
            },
            {
              title: "Adhesion Testing",
              description: "ASTM B571 bend and impact tests for bond strength verification",
              order: 1
            },
            {
              title: "Corrosion Testing",
              description: "Salt spray testing per ASTM B117 for long-term durability",
              order: 2
            },
            {
              title: "Appearance Inspection",
              description: "Visual inspection and surface finish quality verification",
              order: 3
            }
          ]
        }
      }
    })

    console.log('✅ Aluminium content seeded successfully')
    return aluminiumContent
  } catch (error) {
    console.error('❌ Error seeding aluminium content:', error)
    throw error
  }
}
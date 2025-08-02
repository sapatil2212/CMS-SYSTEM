import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedCopperContent() {
  console.log('🔶 Seeding Copper content...')

  try {
    // Clear existing content
    await prisma.copperContent.deleteMany()
    
    // Create new copper content
    const copperContent = await prisma.copperContent.create({
      data: {
        heroTitle: "Premium Copper Plating Services for Superior Conductivity",
        heroSubtitle: "Excellence in Electrical & Thermal Performance",
        heroDescription: "Exceptional conductivity, antimicrobial properties, and superior finish quality for critical applications",
        heroImage: "/uploads/copper/hero-copper-plating.jpg",
        whatIsTitle: "What is Copper Plating?",
        whatIsDescription: "Copper plating is an electrochemical process that deposits a layer of copper onto various substrate materials. Known for its excellent electrical and thermal conductivity, copper plating is essential in electronics, telecommunications, and power applications where performance and reliability are critical.",
        whatIsImage: "/uploads/copper/copper-process.jpg",
        whatIsBestFor: "Electrical conductivity enhancement\nThermal management solutions\nCorrosion resistance\nSolderability improvement\nEMI/RFI shielding",
        whatIsMaterials: "Steel components\nAluminum parts\nPlastic substrates\nPCB surfaces\nConnectors and contacts",
        whatIsAlkalineOffers: "Our advanced copper plating processes ensure uniform coverage, excellent adhesion, and optimal conductivity for demanding applications in electronics and power systems.",
        benefitsTitle: "Why Choose Copper Plating?",
        benefitsSubtitle: "Maximize performance with our precision copper coating solutions",
        processTitle: "Our Copper Plating Process",
        processSubtitle: "Advanced techniques for superior copper deposition and finish quality",
        applicationsTitle: "Copper Plating Applications",
        applicationsSubtitle: "Essential for high-performance electrical and thermal applications",
        industriesTitle: "Industries We Serve",
        industriesSubtitle: "Copper plating solutions for mission-critical applications across industries",
        qualityTitle: "Quality Excellence",
        qualityDescription: "Every copper-plated component undergoes rigorous testing to ensure optimal conductivity, adhesion, and performance standards",
        qualityImage: "/uploads/copper/quality-control.jpg",
        ctaTitle: "Need Superior Copper Plating?",
        ctaDescription: "Contact our experts to discuss your copper plating requirements and get a customized solution for your project",
        benefits: {
          create: [
            {
              icon: "Zap",
              title: "Superior Electrical Conductivity",
              description: "Excellent electrical properties for power transmission and electronic applications",
              order: 0
            },
            {
              icon: "Thermometer", 
              title: "Thermal Management",
              description: "Outstanding heat dissipation for high-power electronic components",
              order: 1
            },
            {
              icon: "Shield",
              title: "Corrosion Protection",
              description: "Natural antimicrobial properties and protection against oxidation",
              order: 2
            },
            {
              icon: "Layers",
              title: "Excellent Solderability",
              description: "Superior bonding characteristics for electronic assembly processes",
              order: 3
            },
            {
              icon: "Award",
              title: "Aesthetic Appeal",
              description: "Beautiful reddish finish with natural patina development over time",
              order: 4
            },
            {
              icon: "Factory",
              title: "Workability",
              description: "Excellent forming, machining, and fabrication characteristics",
              order: 5
            }
          ]
        },
        processSteps: {
          create: [
            {
              step: "1",
              title: "Surface Preparation",
              description: "Thorough cleaning, degreasing, and surface activation for optimal adhesion",
              icon: "ClipboardCheck",
              order: 0
            },
            {
              step: "2", 
              title: "Pre-treatment",
              description: "Acid activation and etching to ensure uniform copper deposition",
              icon: "Layers",
              order: 1
            },
            {
              step: "3",
              title: "Copper Deposition",
              description: "Electrochemical plating in controlled copper sulfate solutions",
              icon: "Zap",
              order: 2
            },
            {
              step: "4",
              title: "Quality Testing",
              description: "Conductivity testing, thickness measurement, and adhesion verification",
              icon: "Award",
              order: 3
            },
            {
              step: "5",
              title: "Finishing & Protection",
              description: "Anti-tarnish treatments and protective packaging for delivery",
              icon: "Package",
              order: 4
            }
          ]
        },
        applications: {
          create: [
            {
              title: "Electronics & PCBs",
              image: "/uploads/copper/electronics-pcb.jpg",
              items: JSON.stringify(["Circuit boards", "Connectors", "Bus bars", "Heat sinks"]),
              order: 0
            },
            {
              title: "Power & Energy",
              image: "/uploads/copper/power-energy.jpg", 
              items: JSON.stringify(["Transformers", "Motor windings", "Power cables", "Switchgear"]),
              order: 1
            },
            {
              title: "Telecommunications",
              image: "/uploads/copper/telecommunications.jpg",
              items: JSON.stringify(["RF connectors", "Antenna components", "Cable assemblies", "Network hardware"]),
              order: 2
            }
          ]
        },
        industries: {
          create: [
            {
              name: "Electronics & Technology",
              icon: "CircuitBoard",
              examples: JSON.stringify(["Consumer electronics", "Computer hardware", "Mobile devices"]),
              image: "/uploads/copper/electronics-industry.jpg",
              order: 0
            },
            {
              name: "Automotive & EV",
              icon: "Car",
              examples: JSON.stringify(["EV battery systems", "Charging infrastructure", "Wiring harnesses"]),
              image: "/uploads/copper/automotive-industry.jpg",
              order: 1
            },
            {
              name: "Power Generation",
              icon: "Battery",
              examples: JSON.stringify(["Wind turbines", "Solar systems", "Grid infrastructure"]),
              image: "/uploads/copper/power-industry.jpg",
              order: 2
            },
            {
              name: "Telecommunications",
              icon: "Zap",
              examples: JSON.stringify(["5G infrastructure", "Data centers", "Satellite communications"]),
              image: "/uploads/copper/telecom-industry.jpg",
              order: 3
            }
          ]
        },
        qualityChecks: {
          create: [
            {
              title: "Conductivity Testing",
              description: "Four-point probe and eddy current testing for electrical performance",
              order: 0
            },
            {
              title: "Thickness Measurement",
              description: "X-ray fluorescence and magnetic induction thickness verification",
              order: 1
            },
            {
              title: "Adhesion Testing",
              description: "Peel tests and thermal cycling for bond strength verification",
              order: 2
            },
            {
              title: "Surface Quality",
              description: "Visual inspection and surface roughness measurement",
              order: 3
            }
          ]
        }
      }
    })

    console.log('✅ Copper content seeded successfully')
    return copperContent
  } catch (error) {
    console.error('❌ Error seeding copper content:', error)
    throw error
  }
}
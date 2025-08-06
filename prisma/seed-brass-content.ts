import { logger } from '@/lib/logger';
import {  PrismaClient  } from '@prisma/client';

const prisma = new PrismaClient()

export async function seedBrassContent() {
  logger.log('🔶 Seeding Brass content...')

  try {
    // Clear existing content
    await prisma.brassContent.deleteMany()
    
    // Create new brass content
    const brassContent = await prisma.brassContent.create({
      data: {
        heroTitle: "Professional Brass Plating for Decorative & Functional Excellence",
        heroSubtitle: "Beauty Meets Performance",
        heroDescription: "Combining aesthetic appeal with corrosion resistance and antimicrobial properties for diverse applications",
        heroImage: "/uploads/brass/hero-brass-plating.svg",
        whatIsTitle: "What is Brass Plating?",
        whatIsDescription: "Brass plating involves depositing a brass alloy layer (copper-zinc) onto various substrates. This process combines the electrical conductivity of copper with the corrosion resistance of zinc, creating an attractive golden finish that's both functional and decorative.",
        whatIsImage: "/uploads/brass/brass-process.jpg",
        whatIsBestFor: "Decorative applications\nCorrosion resistance\nAntimicrobial surfaces\nElectrical contacts\nMarine environments",
        whatIsMaterials: "Steel substrates\nIron components\nAluminum parts\nZinc die castings\nPlastic housings",
        whatIsAlkalineOffers: "Our precision brass plating delivers uniform golden finishes with excellent adhesion, combining aesthetic beauty with functional performance for demanding applications.",
        benefitsTitle: "Brass Plating Advantages",
        benefitsSubtitle: "Enhance your products with our premium brass finishing solutions",
        processTitle: "Our Brass Plating Process",
        processSubtitle: "Precision techniques for consistent, high-quality brass finishes",
        applicationsTitle: "Brass Plating Applications",
        applicationsSubtitle: "Versatile solutions for decorative and functional requirements",
        industriesTitle: "Industries We Serve",
        industriesSubtitle: "Brass plating solutions across diverse sectors requiring quality and reliability",
        qualityTitle: "Quality Assurance",
        qualityDescription: "Each brass-plated component is thoroughly tested for finish quality, adhesion, and corrosion resistance to meet industry standards",
        qualityImage: "/uploads/brass/quality-testing.jpg",
        ctaTitle: "Ready for Premium Brass Finishing?",
        ctaDescription: "Let our experts help you achieve the perfect brass finish for your specific application requirements",
        benefits: {
          create: [
            {
              icon: "Award",
              title: "Aesthetic Excellence",
              description: "Beautiful golden finish perfect for decorative and luxury applications",
              order: 0
            },
            {
              icon: "Shield",
              title: "Corrosion Resistance",
              description: "Excellent protection against saltwater and atmospheric corrosion",
              order: 1
            },
            {
              icon: "Zap",
              title: "Electrical Properties",
              description: "Good electrical conductivity for electronic and electrical applications",
              order: 2
            },
            {
              icon: "Factory",
              title: "Antimicrobial Action",
              description: "Natural antimicrobial properties for hygiene-critical applications",
              order: 3
            },
            {
              icon: "Layers",
              title: "Machinability",
              description: "Excellent forming and machining characteristics for complex parts",
              order: 4
            },
            {
              icon: "Thermometer",
              title: "Thermal Stability",
              description: "Good thermal properties and stability in varying temperatures",
              order: 5
            }
          ]
        },
        processSteps: {
          create: [
            {
              step: "1",
              title: "Surface Preparation",
              description: "Comprehensive cleaning and surface activation for optimal brass adhesion",
              icon: "ClipboardCheck",
              order: 0
            },
            {
              step: "2",
              title: "Base Layer Application",
              description: "Copper strike layer for enhanced adhesion and uniformity",
              icon: "Layers",
              order: 1
            },
            {
              step: "3",
              title: "Brass Deposition",
              description: "Controlled electroplating in specialized brass solution baths",
              icon: "Zap",
              order: 2
            },
            {
              step: "4",
              title: "Quality Verification",
              description: "Thickness testing, appearance inspection, and adhesion verification",
              icon: "Award",
              order: 3
            },
            {
              step: "5",
              title: "Protective Finishing",
              description: "Clear coating application and secure packaging for delivery",
              icon: "Package",
              order: 4
            }
          ]
        },
        applications: {
          create: [
            {
              title: "Decorative Hardware",
              image: "/uploads/brass/decorative-hardware.jpg",
              items: JSON.stringify(["Door handles", "Cabinet hardware", "Light fixtures", "Bathroom fittings"]),
              order: 0
            },
            {
              title: "Marine Components",
              image: "/uploads/brass/marine-components.jpg",
              items: JSON.stringify(["Propellers", "Valves", "Fittings", "Navigation equipment"]),
              order: 1
            },
            {
              title: "Electrical & Electronics",
              image: "/uploads/brass/electrical-components.jpg",
              items: JSON.stringify(["Connectors", "Terminals", "Switch components", "Circuit elements"]),
              order: 2
            }
          ]
        },
        industries: {
          create: [
            {
              name: "Architecture & Construction",
              icon: "Factory",
              examples: JSON.stringify(["Building hardware", "Architectural fittings", "Decorative elements"]),
              image: "/uploads/brass/architecture-industry.jpg",
              order: 0
            },
            {
              name: "Marine & Naval",
              icon: "Shield",
              examples: JSON.stringify(["Ship components", "Offshore equipment", "Marine instruments"]),
              image: "/uploads/brass/marine-industry.jpg",
              order: 1
            },
            {
              name: "Luxury Goods",
              icon: "Award",
              examples: JSON.stringify(["Watch components", "Jewelry", "Premium accessories"]),
              image: "/uploads/brass/luxury-industry.jpg",
              order: 2
            },
            {
              name: "Musical Instruments",
              icon: "Thermometer",
              examples: JSON.stringify(["Brass instruments", "Wind instruments", "Percussion elements"]),
              image: "/uploads/brass/musical-industry.jpg",
              order: 3
            }
          ]
        },
        qualityChecks: {
          create: [
            {
              title: "Finish Quality",
              description: "Color consistency and surface smoothness verification",
              order: 0
            },
            {
              title: "Thickness Control",
              description: "Precision measurement for uniform coating thickness",
              order: 1
            },
            {
              title: "Adhesion Testing",
              description: "Bond strength verification through standardized test methods",
              order: 2
            },
            {
              title: "Corrosion Resistance",
              description: "Salt spray testing and environmental exposure verification",
              order: 3
            }
          ]
        }
      }
    })

    logger.log('✅ Brass content seeded successfully')
    return brassContent
  } catch (error) {
    logger.error('❌ Error seeding brass content:', error)
    throw error
  }
}
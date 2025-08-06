import { logger } from '@/lib/logger';
import {  PrismaClient  } from '@prisma/client';

const prisma = new PrismaClient()

export async function seedStainlessSteelContent() {
  logger.log('🔶 Seeding Stainless Steel content...')

  try {
    // Clear existing content
    await prisma.stainlessSteelContent.deleteMany()
    
    // Create new stainless steel content
    const stainlessSteelContent = await prisma.stainlessSteelContent.create({
      data: {
        heroTitle: "Advanced Stainless Steel Plating for Superior Performance",
        heroSubtitle: "Unmatched Corrosion Resistance & Durability",
        heroDescription: "Premium finishing solutions for applications requiring exceptional strength, hygiene, and aesthetic appeal",
        heroImage: "/uploads/stainless-steel/hero-stainless-steel-plating.svg",
        whatIsTitle: "What is Stainless Steel Plating?",
        whatIsDescription: "Stainless steel plating involves applying a thin layer of stainless steel alloy to enhance corrosion resistance, strength, and appearance. This process provides exceptional protection against rust, staining, and chemical attack while maintaining the aesthetic appeal of polished steel.",
        whatIsImage: "/uploads/stainless-steel/stainless-process.jpg",
        whatIsBestFor: "Corrosion resistance\nHigh-temperature applications\nFood-grade surfaces\nMedical devices\nArchitectural elements",
        whatIsMaterials: "Carbon steel\nMild steel\nAluminum substrates\nCopper alloys\nCast iron components",
        whatIsAlkalineOffers: "Our advanced stainless steel plating processes deliver superior corrosion resistance, hygiene properties, and aesthetic finishes for demanding industrial and commercial applications.",
        benefitsTitle: "Stainless Steel Plating Benefits",
        benefitsSubtitle: "Enhance durability and performance with our precision stainless steel solutions",
        processTitle: "Our Stainless Steel Process",
        processSubtitle: "State-of-the-art techniques for exceptional finish quality and performance",
        applicationsTitle: "Stainless Steel Applications",
        applicationsSubtitle: "Critical solutions for industries requiring premium corrosion protection",
        industriesTitle: "Industries We Serve",
        industriesSubtitle: "Stainless steel plating for mission-critical applications across demanding sectors",
        qualityTitle: "Quality Excellence",
        qualityDescription: "Every stainless steel plated component undergoes comprehensive testing for corrosion resistance, finish quality, and performance standards",
        qualityImage: "/uploads/stainless-steel/quality-lab.jpg",
        ctaTitle: "Need Premium Stainless Steel Finishing?",
        ctaDescription: "Contact our specialists to discuss your stainless steel plating requirements and explore custom solutions",
        benefits: {
          create: [
            {
              icon: "Shield",
              title: "Superior Corrosion Resistance", 
              description: "Exceptional protection against rust, staining, and chemical attack in harsh environments",
              order: 0
            },
            {
              icon: "Layers",
              title: "High Strength & Durability",
              description: "Outstanding mechanical properties and long-term performance under stress",
              order: 1
            },
            {
              icon: "Thermometer",
              title: "Temperature Resistance",
              description: "Excellent performance stability at both high and low temperature extremes",
              order: 2
            },
            {
              icon: "Award",
              title: "Aesthetic Excellence",
              description: "Beautiful mirror-like or brushed finishes for premium appearance",
              order: 3
            },
            {
              icon: "Factory",
              title: "Hygienic Properties",
              description: "Easy to clean and sanitize, ideal for food and medical applications",
              order: 4
            },
            {
              icon: "Battery",
              title: "Environmental Sustainability",
              description: "100% recyclable material with minimal environmental impact",
              order: 5
            }
          ]
        },
        processSteps: {
          create: [
            {
              step: "1",
              title: "Surface Preparation",
              description: "Intensive cleaning, degreasing, and surface conditioning for optimal adhesion",
              icon: "ClipboardCheck",
              order: 0
            },
            {
              step: "2",
              title: "Activation Treatment",
              description: "Specialized acid treatment and surface activation for stainless steel bonding",
              icon: "Layers",
              order: 1
            },
            {
              step: "3",
              title: "Electroplating Process",
              description: "Controlled deposition in advanced stainless steel electrolyte solutions",
              icon: "Zap",
              order: 2
            },
            {
              step: "4",
              title: "Passivation",
              description: "Chemical passivation treatment to enhance corrosion resistance properties",
              icon: "Shield",
              order: 3
            },
            {
              step: "5",
              title: "Final Inspection",
              description: "Comprehensive testing and quality verification before packaging",
              icon: "Award",
              order: 4
            }
          ]
        },
        applications: {
          create: [
            {
              title: "Medical & Healthcare",
              image: "/uploads/stainless-steel/medical-devices.jpg",
              items: JSON.stringify(["Surgical instruments", "Medical implants", "Hospital equipment", "Dental tools"]),
              order: 0
            },
            {
              title: "Food & Beverage",
              image: "/uploads/stainless-steel/food-beverage.jpg",
              items: JSON.stringify(["Processing equipment", "Storage tanks", "Conveyor systems", "Kitchen appliances"]),
              order: 1
            },
            {
              title: "Architecture & Construction",
              image: "/uploads/stainless-steel/architecture.jpg",
              items: JSON.stringify(["Building facades", "Structural elements", "Decorative panels", "Handrails"]),
              order: 2
            }
          ]
        },
        industries: {
          create: [
            {
              name: "Healthcare & Medical",
              icon: "Shield",
              examples: JSON.stringify(["Hospitals", "Clinics", "Medical device manufacturers"]),
              image: "/uploads/stainless-steel/healthcare-industry.jpg",
              order: 0
            },
            {
              name: "Food & Beverage",
              icon: "Factory",
              examples: JSON.stringify(["Food processing", "Brewery equipment", "Restaurant kitchens"]),
              image: "/uploads/stainless-steel/food-industry.jpg",
              order: 1
            },
            {
              name: "Chemical & Pharmaceutical",
              icon: "Thermometer",
              examples: JSON.stringify(["Chemical plants", "Pharmaceutical manufacturing", "Laboratory equipment"]),
              image: "/uploads/stainless-steel/chemical-industry.jpg",
              order: 2
            },
            {
              name: "Marine & Offshore",
              icon: "Battery",
              examples: JSON.stringify(["Ship components", "Offshore platforms", "Coastal infrastructure"]),
              image: "/uploads/stainless-steel/marine-industry.jpg",
              order: 3
            }
          ]
        },
        qualityChecks: {
          create: [
            {
              title: "Corrosion Testing",
              description: "Extended salt spray testing and environmental exposure verification",
              order: 0
            },
            {
              title: "Mechanical Properties",
              description: "Hardness testing and mechanical strength verification",
              order: 1
            },
            {
              title: "Surface Finish",
              description: "Roughness measurement and visual appearance inspection",
              order: 2
            },
            {
              title: "Chemical Composition",
              description: "Alloy composition verification and contamination testing",
              order: 3
            }
          ]
        }
      }
    })

    logger.log('✅ Stainless Steel content seeded successfully')
    return stainlessSteelContent
  } catch (error) {
    logger.error('❌ Error seeding stainless steel content:', error)
    throw error
  }
}
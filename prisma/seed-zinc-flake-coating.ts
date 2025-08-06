import { logger } from '@/lib/logger';
import {  PrismaClient  } from '@prisma/client';

const prisma = new PrismaClient()

export default async function seedZincFlakeCoating() {
  try {
    const zincFlakeCoatingContent = await prisma.zincFlakeCoatingContent.create({
      data: {
        heroTitle: "Premium Zinc Flake Coating Services",
        heroSubtitle: "Advanced Corrosion Protection",
        heroDescription: "High-performance zinc flake coating providing superior corrosion resistance and durability for demanding industrial applications.",
        heroImage: "/uploads/zinc-flake-coating/hero.jpg",
        whatIsTitle: "What is Zinc Flake Coating?",
        whatIsDescription: "Zinc flake coating is an advanced surface treatment that applies a layer of zinc flakes with organic binders to provide exceptional corrosion protection. This process offers superior performance compared to traditional zinc plating.",
        whatIsImage: "/uploads/zinc-flake-coating/what-is.jpg",
        whatIsBestFor: "High corrosion resistance\nDurability\nChemical resistance\nTemperature stability\nComplex geometries",
        whatIsMaterials: "Steel alloys\nCast iron\nAluminum\nGalvanized steel\nVarious metals",
        whatIsAlkalineOffers: "Alkalyne offers comprehensive zinc flake coating services with various thickness and finish options.",
        benefitsTitle: "Key Advantages",
        benefitsSubtitle: "Why leading manufacturers choose zinc flake coating",
        processTitle: "Our Zinc Flake Process",
        processSubtitle: "Advanced coating technology for superior protection",
        applicationsTitle: "Zinc Flake Applications",
        applicationsSubtitle: "Critical for industries requiring maximum corrosion protection",
        industriesTitle: "Industries We Serve",
        industriesSubtitle: "Trusted by leading manufacturers across diverse sectors",
        qualityTitle: "Quality Commitment",
        qualityDescription: "Alkalyne maintains rigorous quality standards for every zinc flake coated component",
        qualityImage: "/uploads/zinc-flake-coating/quality.jpg",
        ctaTitle: "Need Zinc Flake Coating?",
        ctaDescription: "From prototype batches to high-volume production, we deliver zinc flake coating that meets exacting standards",
      }
    })

    const benefits = [
      { icon: "Shield", title: "Superior Corrosion", description: "Exceptional protection against rust and corrosion", order: 0 },
      { icon: "Activity", title: "High Durability", description: "Long-lasting protection in harsh environments", order: 1 },
      { icon: "TestTube2", title: "Chemical Resistance", description: "Resistance to various chemical environments", order: 2 },
      { icon: "Thermometer", title: "Temperature Stable", description: "Performance across wide temperature ranges", order: 3 },
      { icon: "Layers", title: "Uniform Coverage", description: "Even coating on complex geometries", order: 4 },
      { icon: "Check", title: "Cost Effective", description: "Economical long-term protection solution", order: 5 }
    ]

    for (const benefit of benefits) {
      await prisma.zincFlakeCoatingBenefit.create({
        data: {
          ...benefit,
          contentId: zincFlakeCoatingContent.id
        }
      })
    }

    const processSteps = [
      { step: "1", title: "Surface Preparation", description: "Cleaning, degreasing, and activation", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", order: 0 },
      { step: "2", title: "Coating Application", description: "Zinc flake coating application", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z", order: 1 },
      { step: "3", title: "Curing Process", description: "Thermal curing and bonding", icon: "M13 10V3L4 14h7v7l9-11h-7z", order: 2 },
      { step: "4", title: "Final Inspection", description: "Quality control and finishing", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z", order: 3 }
    ]

    for (const step of processSteps) {
      await prisma.zincFlakeCoatingProcessStep.create({
        data: {
          ...step,
          contentId: zincFlakeCoatingContent.id
        }
      })
    }

    const applications = [
      { title: "Automotive Components", image: "/uploads/zinc-flake-coating/automotive.jpg", items: JSON.stringify(["Chassis parts", "Suspension components", "Engine parts", "Body panels"]), order: 0 },
      { title: "Industrial Equipment", image: "/uploads/zinc-flake-coating/industrial.jpg", items: JSON.stringify(["Heavy machinery", "Construction equipment", "Agricultural machinery", "Mining equipment"]), order: 1 },
      { title: "Infrastructure", image: "/uploads/zinc-flake-coating/infrastructure.jpg", items: JSON.stringify(["Bridges", "Highway structures", "Railway components", "Power transmission"]), order: 2 }
    ]

    for (const app of applications) {
      await prisma.zincFlakeCoatingApplication.create({
        data: {
          ...app,
          contentId: zincFlakeCoatingContent.id
        }
      })
    }

    const industries = [
      { name: "Automotive", icon: "Car", examples: JSON.stringify(["Chassis parts", "Suspension components", "Engine parts"]), image: "/uploads/zinc-flake-coating/automotive-industry.jpg", order: 0 },
      { name: "Industrial", icon: "Cpu", examples: JSON.stringify(["Heavy machinery", "Construction equipment", "Agricultural machinery"]), image: "/uploads/zinc-flake-coating/industrial-industry.jpg", order: 1 },
      { name: "Infrastructure", icon: "Building", examples: JSON.stringify(["Bridges", "Highway structures", "Railway components"]), image: "/uploads/zinc-flake-coating/infrastructure-industry.jpg", order: 2 }
    ]

    for (const industry of industries) {
      await prisma.zincFlakeCoatingIndustry.create({
        data: {
          ...industry,
          contentId: zincFlakeCoatingContent.id
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
      await prisma.zincFlakeCoatingQualityCheck.create({
        data: {
          ...check,
          contentId: zincFlakeCoatingContent.id
        }
      })
    }

    logger.log('✅ Zinc flake coating content seeded successfully')
  } catch (error) {
    logger.error('❌ Error seeding zinc flake coating content:', error)
    throw error
  }
} 
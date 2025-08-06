const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleSectors = [
  {
    name: "Automotive Industry",
    description: "Comprehensive plating solutions for automotive components and parts",
    details: "We provide specialized plating services for automotive manufacturers, including corrosion-resistant coatings, decorative finishes, and functional plating for engine components, electrical systems, and exterior parts.",
    order: 1,
    isActive: true
  },
  {
    name: "Electronics Manufacturing",
    description: "Precision plating for electronic components and circuit boards",
    details: "Specialized plating services for the electronics industry, including gold plating for connectors, tin plating for solderability, and nickel plating for EMI shielding applications.",
    order: 2,
    isActive: true
  },
  {
    name: "Aerospace & Defense",
    description: "High-performance plating solutions for aerospace and defense applications",
    details: "Critical plating services for aerospace and defense industries, meeting strict quality standards and regulatory requirements for safety-critical components.",
    order: 3,
    isActive: true
  },
  {
    name: "Medical Devices",
    description: "Biocompatible plating for medical devices and equipment",
    details: "Specialized plating services for medical device manufacturers, ensuring biocompatibility, sterilization resistance, and long-term reliability for patient safety.",
    order: 4,
    isActive: true
  },
  {
    name: "Renewable Energy",
    description: "Sustainable plating solutions for renewable energy systems",
    details: "Plating services for solar panels, wind turbines, and other renewable energy equipment, focusing on durability and environmental resistance.",
    order: 5,
    isActive: true
  }
];

const sectorsOverviewContent = {
  title: "Industries We Serve",
  subtitle: "Choose the Best Coatings Based on Your Application Needs",
  description: "At Alkalyne Surface Technologies, we understand that every industry has unique challenges, operational conditions, and performance demands. With decades of experience in advanced coating solutions, we've developed high-quality, industry-specific treatments that improve durability, performance, hygiene, aesthetics, and operational efficiency.",
  whyChooseTitle: "Why Choose Alkalyne?",
  whyChooseDescription: "At Alkalyne, we bring decades of hands-on expertise in the coatings industry, offering custom-engineered surface treatments designed to meet the unique needs of each sector. Our mission is to optimize your production performance, extend the lifespan of your equipment, and reduce maintenance and downtime—all with high-quality, industry-specific coating solutions.",
  whyChooseFeatures: JSON.stringify([
    "Industry-specific coating solutions",
    "Customised surface treatments based on usage and environment",
    "High-volume processing with consistency and quality",
    "Trusted partner to aerospace, food, automotive, and more",
    "In-house R&D and application expertise",
    "Efficiency-focused partnership approach"
  ]),
  ctaText: "Get Free Consultation",
  ctaLink: "/contact",
  isActive: true
};

async function seedAllSectors() {
  try {
    console.log('🚀 Starting to seed all sectors data...');
    
    // Step 1: Seed Sectors
    console.log('📋 Seeding sectors...');
    for (const sector of sampleSectors) {
      // Check if sector already exists
      const existingSector = await prisma.sector.findFirst({
        where: {
          name: sector.name
        }
      });

      if (existingSector) {
        console.log(`✅ Sector "${sector.name}" already exists, updating...`);
        await prisma.sector.update({
          where: {
            id: existingSector.id
          },
          data: sector
        });
      } else {
        console.log(`➕ Creating sector: ${sector.name}`);
        await prisma.sector.create({
          data: sector
        });
      }
    }
    
    // Step 2: Seed Sectors Overview Content
    console.log('📝 Seeding sectors overview content...');
    const existingContent = await prisma.sectorsOverviewContent.findFirst({
      where: {
        isActive: true
      }
    });

    if (existingContent) {
      console.log('✅ Sectors overview content already exists, updating...');
      await prisma.sectorsOverviewContent.update({
        where: {
          id: existingContent.id
        },
        data: sectorsOverviewContent
      });
    } else {
      console.log('➕ Creating new sectors overview content...');
      await prisma.sectorsOverviewContent.create({
        data: sectorsOverviewContent
      });
    }
    
    console.log('🎉 All sectors data seeded successfully!');
    
    // Step 3: Verify the data
    console.log('🔍 Verifying seeded data...');
    const sectorsCount = await prisma.sector.count({
      where: {
        isActive: true
      }
    });
    
    const contentExists = await prisma.sectorsOverviewContent.findFirst({
      where: {
        isActive: true
      }
    });
    
    console.log(`📊 Verification Results:`);
    console.log(`   - Active sectors: ${sectorsCount}`);
    console.log(`   - Overview content: ${contentExists ? '✅ Exists' : '❌ Missing'}`);
    
  } catch (error) {
    console.error('❌ Error seeding sectors data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAllSectors(); 
const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function deploySectors() {
  try {
    console.log('🚀 Starting sectors deployment process...');
    
    // Step 1: Generate Prisma client
    console.log('📦 Generating Prisma client...');
    try {
      execSync('npx prisma generate', { stdio: 'inherit' });
      console.log('✅ Prisma client generated successfully');
    } catch (error) {
      console.log('⚠️ Prisma client generation failed, continuing...');
    }
    
    // Step 2: Push schema to database (if needed)
    console.log('🗄️ Pushing schema to database...');
    try {
      execSync('npx prisma db push', { stdio: 'inherit' });
      console.log('✅ Database schema updated successfully');
    } catch (error) {
      console.log('⚠️ Database schema push failed, continuing...');
    }
    
    // Step 3: Seed sectors data
    console.log('🌱 Seeding sectors data...');
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

    // Seed sectors
    for (const sector of sampleSectors) {
      const existingSector = await prisma.sector.findFirst({
        where: { name: sector.name }
      });

      if (existingSector) {
        await prisma.sector.update({
          where: { id: existingSector.id },
          data: sector
        });
        console.log(`✅ Updated sector: ${sector.name}`);
      } else {
        await prisma.sector.create({ data: sector });
        console.log(`➕ Created sector: ${sector.name}`);
      }
    }

    // Seed sectors overview content
    const existingContent = await prisma.sectorsOverviewContent.findFirst({
      where: { isActive: true }
    });

    if (existingContent) {
      await prisma.sectorsOverviewContent.update({
        where: { id: existingContent.id },
        data: sectorsOverviewContent
      });
      console.log('✅ Updated sectors overview content');
    } else {
      await prisma.sectorsOverviewContent.create({
        data: sectorsOverviewContent
      });
      console.log('➕ Created sectors overview content');
    }

    console.log('🎉 Sectors deployment completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during sectors deployment:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

deploySectors(); 
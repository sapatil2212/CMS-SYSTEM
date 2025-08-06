const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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

async function seedSectorsOverview() {
  try {
    console.log('Starting to seed sectors overview content...');
    
    // Check if content already exists
    const existingContent = await prisma.sectorsOverviewContent.findFirst({
      where: {
        isActive: true
      }
    });

    if (existingContent) {
      console.log('Sectors overview content already exists, updating...');
      const updatedContent = await prisma.sectorsOverviewContent.update({
        where: {
          id: existingContent.id
        },
        data: sectorsOverviewContent
      });
      console.log('Updated sectors overview content successfully!');
    } else {
      console.log('Creating new sectors overview content...');
      const createdContent = await prisma.sectorsOverviewContent.create({
        data: sectorsOverviewContent
      });
      console.log('Created sectors overview content successfully!');
    }
    
    console.log('Sectors overview seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding sectors overview content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSectorsOverview(); 
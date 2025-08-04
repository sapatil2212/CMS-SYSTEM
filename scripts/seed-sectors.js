const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleSectors = [
  {
    name: "Automotive Industry",
    description: "Comprehensive plating solutions for automotive components and parts",
    details: "We provide specialized plating services for automotive manufacturers, including corrosion-resistant coatings, decorative finishes, and functional plating for engine components, electrical systems, and exterior parts.",
    category: "Manufacturing",
    features: JSON.stringify([
      "Corrosion-resistant coatings",
      "Decorative finishes",
      "Functional plating",
      "Quality assurance",
      "Industry compliance"
    ]),
    applications: JSON.stringify([
      "Engine components",
      "Electrical systems",
      "Exterior parts",
      "Interior trim",
      "Safety components"
    ]),
    order: 1,
    isActive: true
  },
  {
    name: "Electronics Manufacturing",
    description: "Precision plating for electronic components and circuit boards",
    details: "Specialized plating services for the electronics industry, including gold plating for connectors, tin plating for solderability, and nickel plating for EMI shielding applications.",
    category: "Technology",
    features: JSON.stringify([
      "Gold plating",
      "Tin plating",
      "Nickel plating",
      "EMI shielding",
      "Precision coating"
    ]),
    applications: JSON.stringify([
      "Circuit boards",
      "Connectors",
      "Semiconductors",
      "Electronic housings",
      "RF components"
    ]),
    order: 2,
    isActive: true
  },
  {
    name: "Aerospace & Defense",
    description: "High-performance plating solutions for aerospace and defense applications",
    details: "Critical plating services for aerospace and defense industries, meeting strict quality standards and regulatory requirements for safety-critical components.",
    category: "Aerospace",
    features: JSON.stringify([
      "High-performance coatings",
      "Regulatory compliance",
      "Quality certification",
      "Documentation support",
      "Traceability"
    ]),
    applications: JSON.stringify([
      "Aircraft components",
      "Defense equipment",
      "Satellite parts",
      "Military hardware",
      "Safety systems"
    ]),
    order: 3,
    isActive: true
  },
  {
    name: "Medical Devices",
    description: "Biocompatible plating for medical devices and equipment",
    details: "Specialized plating services for medical device manufacturers, ensuring biocompatibility, sterilization resistance, and long-term reliability for patient safety.",
    category: "Healthcare",
    features: JSON.stringify([
      "Biocompatible coatings",
      "Sterilization resistant",
      "Medical grade materials",
      "FDA compliance",
      "Quality validation"
    ]),
    applications: JSON.stringify([
      "Surgical instruments",
      "Implantable devices",
      "Diagnostic equipment",
      "Medical tools",
      "Dental equipment"
    ]),
    order: 4,
    isActive: true
  },
  {
    name: "Renewable Energy",
    description: "Sustainable plating solutions for renewable energy systems",
    details: "Plating services for solar panels, wind turbines, and other renewable energy equipment, focusing on durability and environmental resistance.",
    category: "Energy",
    features: JSON.stringify([
      "Environmental resistance",
      "UV protection",
      "Corrosion prevention",
      "Long-term durability",
      "Sustainable processes"
    ]),
    applications: JSON.stringify([
      "Solar panels",
      "Wind turbines",
      "Energy storage",
      "Power transmission",
      "Green infrastructure"
    ]),
    order: 5,
    isActive: true
  }
];

async function seedSectors() {
  try {
    console.log('Starting to seed sectors...');
    
    for (const sector of sampleSectors) {
      const createdSector = await prisma.sector.create({
        data: sector
      });
      console.log(`Created sector: ${createdSector.name}`);
    }
    
    console.log('Sector seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding sectors:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSectors(); 
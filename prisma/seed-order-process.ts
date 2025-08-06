import { logger } from '@/lib/logger';
import {  PrismaClient  } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {
  logger.log('🌱 Seeding order process steps...')

  const steps = [
    {
      title: "Submit Your Enquiry",
      description: "Reach out via our website, email, or phone and receive a detailed response or quote within 1 business day.",
      details: [
        "24-hour response guarantee",
        "No-obligation quotes",
        "Dedicated account manager"
      ],
      icon: "📧",
      order: 1,
      gradientFrom: "from-emerald-500",
      gradientTo: "to-teal-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-600"
    },
    {
      title: "Technical Discussion & Samples",
      description: "Our experts will connect with you to discuss material specifications and coating requirements.",
      details: [
        "Material compatibility checks",
        "Sample trials available",
        "Process validation"
      ],
      icon: "⚙️",
      order: 2,
      gradientFrom: "from-purple-500",
      gradientTo: "to-violet-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-600"
    },
    {
      title: "Processing & Quality Inspection",
      description: "Your components are handled by highly trained technicians using state-of-the-art equipment.",
      details: [
        "ISO-certified processes",
        "Multiple QC checkpoints",
        "Detailed inspection reports"
      ],
      icon: "✅",
      order: 3,
      gradientFrom: "from-amber-500",
      gradientTo: "to-orange-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-600"
    },
    {
      title: "Packaging & Timely Delivery",
      description: "We carefully package all treated parts to avoid damage during transport.",
      details: [
        "Custom packaging solutions",
        "Domestic & international shipping",
        "Real-time tracking"
      ],
      icon: "📦",
      order: 4,
      gradientFrom: "from-rose-500",
      gradientTo: "to-pink-500",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      textColor: "text-rose-600"
    }
  ]

  // Clear existing steps
  await prisma.homeOrderProcessStep.deleteMany()

  // Create all steps
  for (const step of steps) {
    await prisma.homeOrderProcessStep.create({
      data: {
        ...step,
        details: JSON.stringify(step.details)
      }
    })
    logger.log(`✅ Created step: ${step.title}`)
  }

  logger.log('🎉 All order process steps seeded successfully!')
}

main()
  .catch((e) => {
    logger.error('❌ Error seeding order process steps:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
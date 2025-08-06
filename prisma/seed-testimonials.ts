import { logger } from '@/lib/logger';
import {  PrismaClient  } from '@prisma/client';

const prisma = new PrismaClient()

const testimonials = [
  {
    name: "Rahul Mehta",
    avatar: "RM",
    company: "Precision Components Ltd.",
    quote: "Exceptional quality and turnaround time! We've been working with Alkalyne for over two years, and their plating quality has always been top-notch. The team is professional, responsive, and extremely knowledgeable.",
    rating: 5,
    date: "2 months ago",
    verified: true,
    industry: "Automotive",
    order: 1,
    isActive: true
  },
  {
    name: "Sonal Kulkarni",
    avatar: "SK",
    company: "Aerospace Tech Solutions",
    quote: "Our go-to partner for all surface treatments. Alkalyne helped us with prototyping and batch processing of critical components. Their attention to detail and documentation were flawless.",
    rating: 5,
    date: "3 weeks ago",
    verified: true,
    industry: "Aerospace",
    order: 2,
    isActive: true
  },
  {
    name: "Amit Bansal",
    avatar: "AB",
    company: "ElectroTech Industries",
    quote: "Reliable, responsive, and technically sound. We switched to Alkalyne after inconsistent results with another vendor. Their nickel and zinc plating work exceeded expectations.",
    rating: 5,
    date: "1 month ago",
    verified: true,
    industry: "Electronics",
    order: 3,
    isActive: true
  },
  {
    name: "Neha Sharma",
    avatar: "NS",
    company: "PowerGrid Solutions",
    quote: "Quality plating and great communication! The team worked closely with us during a complex busbar plating project. They advised on process specs and delivered a perfect batch on time.",
    rating: 5,
    date: "2 weeks ago",
    verified: true,
    industry: "Energy",
    order: 4,
    isActive: true
  },
  {
    name: "Jayesh Deshmukh",
    avatar: "JD",
    company: "MediTech Devices",
    quote: "A true partner, not just a service provider. Alkalyne customized a process line for our unique medical components without compromising on quality.",
    rating: 5,
    date: "3 months ago",
    verified: true,
    industry: "Medical",
    order: 5,
    isActive: true
  },
  {
    name: "Dr. Ankit Shah",
    avatar: "AS",
    company: "Surgical Instruments Co.",
    quote: "Alkalyne delivered exactly what we needed! Their team guided us through plating for a new medical device. The finish was flawless, and turnaround was quicker than expected.",
    rating: 5,
    date: "5 days ago",
    verified: true,
    industry: "Medical",
    order: 6,
    isActive: true
  }
]

async function seedTestimonials() {
  try {
    logger.log('🌱 Seeding testimonials...')

    // Clear existing testimonials
    await prisma.testimonial.deleteMany({})

    // Create new testimonials
    for (const testimonial of testimonials) {
      await prisma.testimonial.create({
        data: testimonial
      })
    }

    logger.log('✅ Testimonials seeded successfully!')
  } catch (error) {
    logger.error('❌ Error seeding testimonials:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedTestimonials() 
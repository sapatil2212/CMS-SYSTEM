import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Helper function to safely get error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

export async function POST() {
  try {
    console.log('🌱 Starting production database seed...')
    
    // Check if AboutContent exists
    const aboutContentCount = await prisma.aboutContent.count()
    if (aboutContentCount === 0) {
      console.log('📝 Seeding AboutContent...')
      await prisma.aboutContent.create({
        data: {
          title: 'About Alkalyne',
          subtitle: 'Precision in Every Layer. Commitment in Every Process.',
          description: 'Alkalyne is a trusted name in the field of metal finishing and surface treatment, known for delivering high-performance plating solutions that meet the rigorous demands of modern industries. With a focus on quality, reliability, and innovation, we provide a wide range of services — from electroplating and electroless nickel plating to phosphating, tin plating, and surface preparation. Our processes are engineered to improve durability, corrosion resistance, conductivity, and appearance across various components.',
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        }
      })
      console.log('✅ AboutContent seeded')
    }
    
    // Check if AboutValue exists
    const aboutValueCount = await prisma.aboutValue.count()
    if (aboutValueCount === 0) {
      console.log('📝 Seeding AboutValues...')
      await prisma.aboutValue.createMany({
        data: [
          {
            icon: 'fas fa-award',
            title: 'Excellence',
            description: 'We strive for excellence in everything we do, delivering superior quality and precision in our metal finishing processes.',
            order: 1,
            isActive: true
          },
          {
            icon: 'fas fa-cogs',
            title: 'Innovation',
            description: 'We embrace cutting-edge technologies and innovative solutions to meet the evolving needs of modern industries.',
            order: 2,
            isActive: true
          },
          {
            icon: 'fas fa-handshake',
            title: 'Partnership',
            description: 'We work closely with our clients as trusted partners, understanding their unique requirements and delivering tailored solutions.',
            order: 3,
            isActive: true
          },
          {
            icon: 'fas fa-leaf',
            title: 'Sustainability',
            description: 'We are committed to environmentally responsible practices and sustainable metal finishing solutions.',
            order: 4,
            isActive: true
          }
        ]
      })
      console.log('✅ AboutValues seeded')
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Production database seeded successfully',
      aboutContentCount: await prisma.aboutContent.count(),
      aboutValueCount: await prisma.aboutValue.count()
    })
    
  } catch (error) {
    console.error('❌ Production seeding failed:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Failed to seed production database',
      error: getErrorMessage(error)
    }, { status: 500 })
  }
}
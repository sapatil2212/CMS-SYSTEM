import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';



export async function GET() {
  try {
    const content = await prisma.aboutContent.findFirst()
    
    if (!content) {
      // Return default content if none exists
      return NextResponse.json({
        title: 'About Alkalyne',
        subtitle: 'Precision in Every Layer. Commitment in Every Process.',
        description: 'Alkalyne is a trusted name in the field of metal finishing and surface treatment, known for delivering high-performance plating solutions that meet the rigorous demands of modern industries. With a focus on quality, reliability, and innovation, we provide a wide range of services — from electroplating and electroless nickel plating to phosphating, tin plating, and surface preparation. Our processes are engineered to improve durability, corrosion resistance, conductivity, and appearance across various components.',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      })
    }
    
    return NextResponse.json(content)
  } catch (error) {
    logger.error('Error fetching about content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, subtitle, description, image } = body

    // Delete existing content and create new one
    await prisma.aboutContent.deleteMany()

    const result = await prisma.aboutContent.create({
      data: {
        title,
        subtitle,
        description,
        image
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    logger.error('Error creating about content:', error)
    return NextResponse.json(
      { error: 'Failed to create about content' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, subtitle, description, image } = body

    const result = await prisma.aboutContent.update({
      where: { id },
      data: {
        title,
        subtitle,
        description,
        image
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    logger.error('Error updating about content:', error)
    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    )
  }
} 
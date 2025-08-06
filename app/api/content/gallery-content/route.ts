import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';

export async function GET() {
  try {
    const content = await prisma.galleryContent.findFirst()
    
    if (!content) {
      // Return default content if none exists
      return NextResponse.json({
        title: 'Our Advanced Plating & Surface Finishing Facilities',
        subtitle: 'Precision Unleashed',
        description: 'Explore our state-of-the-art facilities and advanced plating technologies that deliver exceptional quality and precision for every project.'
      })
    }
    
    return NextResponse.json(content)
  } catch (error) {
    logger.error('Error fetching gallery content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, subtitle, description } = body

    // Delete existing content and create new one
    await prisma.galleryContent.deleteMany()

    const result = await prisma.galleryContent.create({
      data: {
        title,
        subtitle,
        description
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    logger.error('Error creating gallery content:', error)
    return NextResponse.json(
      { error: 'Failed to create gallery content' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, subtitle, description } = body

    const result = await prisma.galleryContent.update({
      where: { id },
      data: {
        title,
        subtitle,
        description
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    logger.error('Error updating gallery content:', error)
    return NextResponse.json(
      { error: 'Failed to update gallery content' },
      { status: 500 }
    )
  }
} 
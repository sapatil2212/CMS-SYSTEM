import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';



export async function GET() {
  try {
    const content = await prisma.testimonialContent.findFirst()
    
    if (!content) {
      // Return default content if none exists
      return NextResponse.json({
        title: 'Trusted by Industry Leaders',
        subtitle: 'CLIENT TESTIMONIALS',
        description: 'What leading manufacturers say about our metal finishing services',
        averageRating: '4.9',
        totalClients: '200+',
        qualityCompliance: '100%'
      })
    }
    
    return NextResponse.json({
      title: content.title,
      subtitle: content.subtitle,
      description: content.description,
      stats: {
        averageRating: content.averageRating,
        totalClients: content.totalClients,
        qualityCompliance: content.qualityCompliance
      }
    })
  } catch (error) {
    logger.error('Error fetching testimonial content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonial content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, subtitle, description, stats } = body

    // Delete existing content and create new one
    await prisma.testimonialContent.deleteMany()

    const result = await prisma.testimonialContent.create({
      data: {
        title,
        subtitle,
        description,
        averageRating: stats.averageRating,
        totalClients: stats.totalClients,
        qualityCompliance: stats.qualityCompliance
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    logger.error('Error creating testimonial content:', error)
    return NextResponse.json(
      { error: 'Failed to create testimonial content' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, subtitle, description, stats } = body

    const result = await prisma.testimonialContent.update({
      where: { id },
      data: {
        title,
        subtitle,
        description,
        averageRating: stats.averageRating,
        totalClients: stats.totalClients,
        qualityCompliance: stats.qualityCompliance
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    logger.error('Error updating testimonial content:', error)
    return NextResponse.json(
      { error: 'Failed to update testimonial content' },
      { status: 500 }
    )
  }
} 
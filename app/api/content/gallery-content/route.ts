import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    })
    
    const content = await prisma.galleryContent.findFirst()
    
    await prisma.$disconnect()
    
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
    console.error('Error fetching gallery content:', error)
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

    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    })

    // Delete existing content and create new one
    await prisma.galleryContent.deleteMany()

    const result = await prisma.galleryContent.create({
      data: {
        title,
        subtitle,
        description
      }
    })

    await prisma.$disconnect()

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating gallery content:', error)
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

    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    })

    const result = await prisma.galleryContent.update({
      where: { id },
      data: {
        title,
        subtitle,
        description
      }
    })

    await prisma.$disconnect()

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating gallery content:', error)
    return NextResponse.json(
      { error: 'Failed to update gallery content' },
      { status: 500 }
    )
  }
} 
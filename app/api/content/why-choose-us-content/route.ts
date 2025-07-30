import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const content = await prisma.whyChooseUsContent.findFirst()
    
    if (!content) {
      // Return default content if none exists
      return NextResponse.json({
        title: 'Why Choose Alkalyne Surface Technologies?',
        description: 'We understand the challenges of finding a reliable, technically sound plating partner. At Alkalyne, we are committed to delivering precision, performance, and peace of mind — every time.',
        image: '',
        rating: 5,
        ratingText: 'Decades of Experience',
        technologyText: 'Advanced Tech'
      })
    }
    
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching why choose us content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch why choose us content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, image, rating, ratingText, technologyText } = body

    // Delete existing content and create new one
    await prisma.whyChooseUsContent.deleteMany()

    const result = await prisma.whyChooseUsContent.create({
      data: {
        title,
        description,
        image,
        rating: rating || 5,
        ratingText,
        technologyText
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating why choose us content:', error)
    return NextResponse.json(
      { error: 'Failed to create why choose us content' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, image, rating, ratingText, technologyText } = body

    const result = await prisma.whyChooseUsContent.update({
      where: { id },
      data: {
        title,
        description,
        image,
        rating: rating || 5,
        ratingText,
        technologyText
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating why choose us content:', error)
    return NextResponse.json(
      { error: 'Failed to update why choose us content' },
      { status: 500 }
    )
  }
} 
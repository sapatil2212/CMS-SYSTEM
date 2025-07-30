import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'



export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: {
        order: 'asc'
      }
    })
    
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, avatar, company, quote, rating, date, verified, industry, order, isActive } = body

    const result = await prisma.testimonial.create({
      data: {
        name,
        avatar,
        company,
        quote,
        rating: rating || 5,
        date,
        verified: verified !== undefined ? verified : true,
        industry,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, avatar, company, quote, rating, date, verified, industry, order, isActive } = body

    const result = await prisma.testimonial.update({
      where: { id },
      data: {
        name,
        avatar,
        company,
        quote,
        rating: rating || 5,
        date,
        verified: verified !== undefined ? verified : true,
        industry,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Testimonial ID is required' },
        { status: 400 }
      )
    }

    await prisma.testimonial.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
} 
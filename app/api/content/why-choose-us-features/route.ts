import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';



export async function GET() {
  try {
    const features = await prisma.whyChooseUsFeature.findMany({
      orderBy: {
        order: 'asc'
      }
    })
    
    return NextResponse.json(features)
  } catch (error) {
    logger.error('Error fetching why choose us features:', error)
    return NextResponse.json(
      { error: 'Failed to fetch why choose us features' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { icon, title, description, color, bg, order, isActive } = body

    const result = await prisma.whyChooseUsFeature.create({
      data: {
        icon,
        title,
        description,
        color,
        bg,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    logger.error('Error creating why choose us feature:', error)
    return NextResponse.json(
      { error: 'Failed to create why choose us feature' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, icon, title, description, color, bg, order, isActive } = body

    const result = await prisma.whyChooseUsFeature.update({
      where: { id },
      data: {
        icon,
        title,
        description,
        color,
        bg,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    logger.error('Error updating why choose us feature:', error)
    return NextResponse.json(
      { error: 'Failed to update why choose us feature' },
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
        { error: 'Feature ID is required' },
        { status: 400 }
      )
    }

    await prisma.whyChooseUsFeature.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error deleting why choose us feature:', error)
    return NextResponse.json(
      { error: 'Failed to delete why choose us feature' },
      { status: 500 }
    )
  }
} 
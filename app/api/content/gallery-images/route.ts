import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: {
        order: 'asc'
      }
    })
    
    return NextResponse.json(images)
  } catch (error) {
    logger.error('Error fetching gallery images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, image, order, isActive } = body

    const result = await prisma.galleryImage.create({
      data: {
        title,
        description,
        image,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    logger.error('Error creating gallery image:', error)
    return NextResponse.json(
      { error: 'Failed to create gallery image' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, image, order, isActive } = body

    const result = await prisma.galleryImage.update({
      where: { id },
      data: {
        title,
        description,
        image,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    logger.error('Error updating gallery image:', error)
    return NextResponse.json(
      { error: 'Failed to update gallery image' },
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
        { error: 'Image ID is required' },
        { status: 400 }
      )
    }

    await prisma.galleryImage.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error deleting gallery image:', error)
    return NextResponse.json(
      { error: 'Failed to delete gallery image' },
      { status: 500 }
    )
  }
} 
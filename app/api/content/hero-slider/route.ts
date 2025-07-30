import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { deleteImageFromPublic } from '@/lib/image-utils'

export async function GET(request: NextRequest) {
  try {
    const slides = await prisma.heroSlider.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(slides)
  } catch (error) {
    console.error('Error fetching hero slider:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero slider' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, subtitle, description, image, mobileImage, ctaText, ctaLink, order } = await request.json()

    const slide = await prisma.heroSlider.create({
      data: {
        title,
        subtitle,
        description,
        image,
        mobileImage,
        ctaText: ctaText || 'Learn More',
        ctaLink,
        order: order || 0,
      },
    })

    return NextResponse.json(slide)
  } catch (error) {
    console.error('Error creating hero slide:', error)
    return NextResponse.json(
      { error: 'Failed to create hero slide' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, title, subtitle, description, image, mobileImage, ctaText, ctaLink, order, isActive } = await request.json()

    // Get the current slide to check for image changes
    const currentSlide = await prisma.heroSlider.findUnique({
      where: { id },
    })

    if (!currentSlide) {
      return NextResponse.json(
        { error: 'Slide not found' },
        { status: 404 }
      )
    }

    // Update the slide
    const slide = await prisma.heroSlider.update({
      where: { id },
      data: {
        title,
        subtitle,
        description,
        image,
        mobileImage,
        ctaText,
        ctaLink,
        order,
        isActive,
      },
    })

    // Delete old images if they've been replaced and are local files
    if (currentSlide.image && currentSlide.image !== image) {
      await deleteImageFromPublic(currentSlide.image)
    }
    if (currentSlide.mobileImage && currentSlide.mobileImage !== mobileImage) {
      await deleteImageFromPublic(currentSlide.mobileImage)
    }

    return NextResponse.json(slide)
  } catch (error) {
    console.error('Error updating hero slide:', error)
    return NextResponse.json(
      { error: 'Failed to update hero slide' },
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
        { error: 'Slide ID is required' },
        { status: 400 }
      )
    }

    // Get the slide before deleting to access its images
    const slide = await prisma.heroSlider.findUnique({
      where: { id },
    })

    if (!slide) {
      return NextResponse.json(
        { error: 'Slide not found' },
        { status: 404 }
      )
    }

    // Delete the slide
    await prisma.heroSlider.delete({
      where: { id },
    })

    // Delete associated images from public folder
    if (slide.image) {
      await deleteImageFromPublic(slide.image)
    }
    if (slide.mobileImage) {
      await deleteImageFromPublic(slide.mobileImage)
    }

    return NextResponse.json({ message: 'Slide deleted successfully' })
  } catch (error) {
    console.error('Error deleting hero slide:', error)
    return NextResponse.json(
      { error: 'Failed to delete hero slide' },
      { status: 500 }
    )
  }
} 
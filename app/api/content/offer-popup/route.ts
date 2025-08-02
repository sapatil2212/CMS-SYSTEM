import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Get all offer popups
export async function GET() {
  try {
    const offerPopups = await prisma.offerPopup.findMany({
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json(offerPopups)
  } catch (error) {
    console.error('Error fetching offer popups:', error)
    return NextResponse.json(
      { error: 'Failed to fetch offer popups' },
      { status: 500 }
    )
  }
}

// POST - Create new offer popup
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image, ctaText, ctaLink } = body

    // Deactivate all existing offer popups
    await prisma.offerPopup.updateMany({
      where: {
        isActive: true
      },
      data: {
        isActive: false
      }
    })

    // Create new offer popup
    const offerPopup = await prisma.offerPopup.create({
      data: {
        title: 'Offer Popup',
        description: 'Special offer popup',
        image,
        ctaText: ctaText || 'Learn More',
        ctaLink,
        isActive: true
      }
    })

    return NextResponse.json(offerPopup)
  } catch (error) {
    console.error('Error creating offer popup:', error)
    return NextResponse.json(
      { error: 'Failed to create offer popup' },
      { status: 500 }
    )
  }
}

// PUT - Update offer popup
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, image, ctaText, ctaLink, isActive } = body

    const offerPopup = await prisma.offerPopup.update({
      where: { id },
      data: {
        image,
        ctaText,
        ctaLink,
        isActive
      }
    })

    return NextResponse.json(offerPopup)
  } catch (error) {
    console.error('Error updating offer popup:', error)
    return NextResponse.json(
      { error: 'Failed to update offer popup' },
      { status: 500 }
    )
  }
}

// DELETE - Delete offer popup
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Offer popup ID is required' },
        { status: 400 }
      )
    }

    await prisma.offerPopup.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Offer popup deleted successfully' })
  } catch (error) {
    console.error('Error deleting offer popup:', error)
    return NextResponse.json(
      { error: 'Failed to delete offer popup' },
      { status: 500 }
    )
  }
} 
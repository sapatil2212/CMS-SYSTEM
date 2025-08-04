import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET single sector
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sector = await prisma.sector.findUnique({
      where: {
        id: params.id
      }
    })

    if (!sector) {
      return NextResponse.json(
        { error: 'Sector not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(sector)
  } catch (error) {
    console.error('Error fetching sector:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sector' },
      { status: 500 }
    )
  }
}

// PUT update sector
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, details, image, order, isActive } = body

    // Validate required fields
    if (!name || !description || !details) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const sector = await prisma.sector.update({
      where: {
        id: params.id
      },
      data: {
        name,
        description,
        details,
        image: image || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(sector)
  } catch (error) {
    console.error('Error updating sector:', error)
    return NextResponse.json(
      { error: 'Failed to update sector' },
      { status: 500 }
    )
  }
}

// DELETE sector (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sector = await prisma.sector.update({
      where: {
        id: params.id
      },
      data: {
        isActive: false
      }
    })

    return NextResponse.json({ message: 'Sector deleted successfully' })
  } catch (error) {
    console.error('Error deleting sector:', error)
    return NextResponse.json(
      { error: 'Failed to delete sector' },
      { status: 500 }
    )
  }
} 
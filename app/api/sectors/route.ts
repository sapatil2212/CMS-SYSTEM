import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all sectors
export async function GET() {
  try {
    const sectors = await prisma.sector.findMany({
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json(sectors)
  } catch (error) {
    console.error('Error fetching sectors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sectors' },
      { status: 500 }
    )
  }
}

// POST new sector
export async function POST(request: NextRequest) {
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

    const sector = await prisma.sector.create({
      data: {
        name,
        description,
        details,
        image: image || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(sector, { status: 201 })
  } catch (error) {
    console.error('Error creating sector:', error)
    return NextResponse.json(
      { error: 'Failed to create sector' },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger';
import {  createAPIHandler  } from '@/lib/api-validation';

// GET single sector
const getSector = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
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
    logger.error('Error fetching sector:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sector' },
      { status: 500 }
    )
  }
}

export const GET = createAPIHandler(getSector, {
  methods: ['GET'],
  requireAuth: false,  // Allow public access for viewing single sector
  requireAdmin: false
})

// PUT update sector
const updateSector = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
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
    logger.error('Error updating sector:', error)
    return NextResponse.json(
      { error: 'Failed to update sector' },
      { status: 500 }
    )
  }
}

export const PUT = createAPIHandler(updateSector, {
  methods: ['PUT'],
  requireAuth: true,
  requireAdmin: true
})

// DELETE sector (soft delete)
const deleteSector = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    // First check if the sector exists
    const existingSector = await prisma.sector.findUnique({
      where: {
        id: params.id
      }
    })

    if (!existingSector) {
      return NextResponse.json(
        { error: 'Sector not found' },
        { status: 404 }
      )
    }

    // Perform soft delete
    const sector = await prisma.sector.update({
      where: {
        id: params.id
      },
      data: {
        isActive: false
      }
    })

    return NextResponse.json({ 
      message: 'Sector deleted successfully',
      sectorName: sector.name 
    })
  } catch (error) {
    logger.error('Error deleting sector:', error)
    return NextResponse.json(
      { error: 'Failed to delete sector' },
      { status: 500 }
    )
  }
}

export const DELETE = createAPIHandler(deleteSector, {
  methods: ['DELETE'],
  requireAuth: true,
  requireAdmin: true
}) 
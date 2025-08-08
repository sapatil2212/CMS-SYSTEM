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
  requireAdmin: false,
  cors: true
})

// PUT update sector
const updateSector = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    // Log request details for debugging
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
    
    logger.log('Sector update request', {
      sectorId: params.id,
      hasAuthHeader: !!authHeader,
      hasToken: !!token,
      tokenLength: token?.length || 0,
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      origin: request.headers.get('origin')
    })

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

    logger.log('Sector updated successfully', {
      sectorId: params.id,
      sectorName: sector.name
    })

    return NextResponse.json(sector)
  } catch (error) {
    logger.error('Error updating sector:', {
      sectorId: params.id,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: 'Failed to update sector' },
      { status: 500 }
    )
  }
}

export const PUT = createAPIHandler(updateSector, {
  methods: ['PUT'],
  requireAuth: true,
  requireAdmin: false,  // Allow both USER and ADMIN to update sectors
  cors: true
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
  requireAdmin: false,  // Allow both USER and ADMIN to delete sectors
  cors: true
}) 
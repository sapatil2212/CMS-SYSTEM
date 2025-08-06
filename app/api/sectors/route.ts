import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger';
import {  createAPIHandler  } from '@/lib/api-validation';

// GET all sectors (only active ones for admin dashboard)
const getSectors = async (request: NextRequest) => {
  try {
    const sectors = await prisma.sector.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json(sectors)
  } catch (error) {
    logger.error('Error fetching sectors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sectors' },
      { status: 500 }
    )
  }
}

export const GET = createAPIHandler(getSectors, {
  methods: ['GET'],
  requireAuth: false,  // Allow public access for viewing sectors
  requireAdmin: false
})

// POST new sector
const createSector = async (request: NextRequest) => {
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
    logger.error('Error creating sector:', error)
    return NextResponse.json(
      { error: 'Failed to create sector' },
      { status: 500 }
    )
  }
}

export const POST = createAPIHandler(createSector, {
  methods: ['POST'],
  requireAuth: true,
  requireAdmin: true
}) 
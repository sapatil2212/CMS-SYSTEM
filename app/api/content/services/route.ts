import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        slug: true,
      },
    })

    return NextResponse.json(services)
  } catch (error) {
    logger.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
} 
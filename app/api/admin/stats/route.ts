import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const [pages, heroSlides, services, users] = await Promise.all([
      prisma.page.count(),
      prisma.heroSlider.count(),
      prisma.service.count(),
      prisma.user.count(),
    ])

    // Mock data for pageViews and activeUsers since we don't have analytics tracking yet
    const pageViews = Math.floor(Math.random() * 2000) + 500
    const activeUsers = Math.floor(Math.random() * 200) + 50

    return NextResponse.json({
      pages,
      heroSlides,
      services,
      users,
      pageViews,
      activeUsers,
    })
  } catch (error) {
    logger.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
} 
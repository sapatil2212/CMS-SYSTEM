import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const [pages, heroSlides, services, users] = await Promise.all([
      prisma.page.count(),
      prisma.heroSlider.count(),
      prisma.service.count(),
      prisma.user.count(),
    ])

    return NextResponse.json({
      pages,
      heroSlides,
      services,
      users,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
} 
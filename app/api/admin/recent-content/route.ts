import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const [pages, heroSlides, services] = await Promise.all([
      prisma.page.findMany({
        take: 3,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
          updatedAt: true,
        },
      }),
      prisma.heroSlider.findMany({
        take: 3,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
          updatedAt: true,
        },
      }),
      prisma.service.findMany({
        take: 3,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
          updatedAt: true,
        },
      }),
    ])

    const recentContent = [
      ...pages.map(page => ({ ...page, type: 'Page' })),
      ...heroSlides.map(slide => ({ ...slide, type: 'HeroSlide' })),
      ...services.map(service => ({ ...service, type: 'Service' })),
    ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5)

    return NextResponse.json(recentContent)
  } catch (error) {
    console.error('Error fetching recent content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent content' },
      { status: 500 }
    )
  }
} 
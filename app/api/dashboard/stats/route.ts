import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get counts for dashboard stats
    const [totalPages, totalServices, totalUsers] = await Promise.all([
      prisma.page.count(),
      prisma.service.count(),
      prisma.user.count(),
    ])

    // Get recent activity (last 5 items)
    const recentActivity = await Promise.all([
      prisma.page.findMany({
        take: 3,
        orderBy: { updatedAt: 'desc' },
        select: { id: true, title: true, updatedAt: true },
      }),
      prisma.service.findMany({
        take: 2,
        orderBy: { updatedAt: 'desc' },
        select: { id: true, title: true, updatedAt: true },
      }),
    ])

    // Combine and format recent activity
    const combinedActivity = [
      ...recentActivity[0].map(page => ({
        id: page.id,
        type: 'Page',
        title: `Updated "${page.title}"`,
        timestamp: new Date(page.updatedAt).toLocaleDateString(),
      })),
      ...recentActivity[1].map(service => ({
        id: service.id,
        type: 'Service',
        title: `Updated "${service.title}"`,
        timestamp: new Date(service.updatedAt).toLocaleDateString(),
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5)

    return NextResponse.json({
      totalPages,
      totalServices,
      totalUsers,
      recentActivity: combinedActivity,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get all visitor tracking records
    const visitors = await prisma.visitorTracking.findMany({
      orderBy: {
        lastVisit: 'desc'
      },
      take: 10
    })

    // Get basic stats
    const totalVisitors = await prisma.visitorTracking.count()
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    const activeVisitors = await prisma.visitorTracking.count({
      where: {
        lastVisit: {
          gte: fiveMinutesAgo
        }
      }
    })

    return NextResponse.json({
      success: true,
      totalVisitors,
      activeVisitors,
      recentVisitors: visitors.map(v => ({
        ip: v.ip,
        userAgent: v.userAgent,
        currentPage: v.currentPage,
        pageVisits: v.pageVisits,
        lastVisit: v.lastVisit
      }))
    })
  } catch (error) {
    console.error('Error in test endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to get test data' },
      { status: 500 }
    )
  }
} 
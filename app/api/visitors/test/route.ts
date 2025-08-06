import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';

export async function GET() {
  try {
    // Get visitor count data
    const visitData = await prisma.visitCount.findUnique({
      where: { id: 1 }
    })

    const totalVisitors = visitData?.count || 0
    const lastVisit = visitData?.lastVisit || new Date()
    
    // Calculate active visitors (visits in last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    const isActive = lastVisit >= fiveMinutesAgo

    return NextResponse.json({
      success: true,
      totalVisitors,
      activeVisitors: isActive ? 1 : 0,
      lastVisit: lastVisit,
      visitData: visitData ? {
        id: visitData.id,
        count: visitData.count,
        lastVisit: visitData.lastVisit,
        updatedAt: visitData.updatedAt
      } : null
    })
  } catch (error) {
    logger.error('Error in test endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to get test data' },
      { status: 500 }
    )
  }
} 
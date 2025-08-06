import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    logger.log('Visitor visit tracked!')
    
    // Use a transaction to prevent race conditions
    const visitCount = await prisma.$transaction(async (tx) => {
      // Get current count first
      const current = await tx.visitCount.findUnique({
        where: { id: 1 }
      })
      
      if (current) {
        // Update existing record
        return await tx.visitCount.update({
          where: { id: 1 },
          data: {
            count: current.count + 1,
            lastVisit: new Date()
          }
        })
      } else {
        // Create new record
        return await tx.visitCount.create({
          data: {
            id: 1,
            count: 1,
            lastVisit: new Date()
          }
        })
      }
    })

    return NextResponse.json({
      success: true,
      visitCount: visitCount.count
    })
  } catch (error) {
    logger.error('Error tracking visitor:', error)
    return NextResponse.json(
      { error: 'Failed to track visitor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    logger.log('Fetching visitor count...')
    
    // Get the current visit count
    const visitData = await prisma.visitCount.findUnique({
      where: { id: 1 }
    })

    const totalVisits = visitData?.count || 0
    
    logger.log('Total visits:', totalVisits)
    
    return NextResponse.json({
      totalVisits
    })
  } catch (error) {
    logger.error('Error fetching visitor count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch visitor count' },
      { status: 500 }
    )
  }
} 
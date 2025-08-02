import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('Resetting visitor count...')
    
    // Reset the visit count to 0
    const visitCount = await prisma.visitCount.upsert({
      where: { id: 1 },
      update: {
        count: 0,
        lastVisit: new Date()
      },
      create: {
        id: 1,
        count: 0,
        lastVisit: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      visitCount: visitCount.count
    })
  } catch (error) {
    console.error('Error resetting visitor count:', error)
    return NextResponse.json(
      { error: 'Failed to reset visitor count' },
      { status: 500 }
    )
  }
} 
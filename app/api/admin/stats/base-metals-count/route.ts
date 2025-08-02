import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get count of active base metals
    const baseMetalsCount = await prisma.baseMetalSettings.count({
      where: {
        isActive: true
      }
    })

    return NextResponse.json({
      count: baseMetalsCount
    })
  } catch (error) {
    console.error('Error fetching base metals count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch base metals count' },
      { status: 500 }
    )
  }
} 
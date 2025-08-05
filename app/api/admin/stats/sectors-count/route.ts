import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const count = await prisma.sector.count({
      where: {
        isActive: true
      }
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching sectors count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sectors count', count: 0 },
      { status: 500 }
    )
  }
}
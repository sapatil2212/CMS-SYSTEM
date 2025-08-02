import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Activity tracking interface
interface ActivityData {
  userId?: string
  action: string
  details?: string
  ipAddress?: string
  userAgent?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, action, details, ipAddress, userAgent } = body

    // Store activity in database
    const activity = await prisma.userActivity.create({
      data: {
        userId,
        action,
        details,
        ipAddress,
        userAgent
      }
    })

    return NextResponse.json({ success: true, activity })
  } catch (error) {
    console.error('Error tracking activity:', error)
    return NextResponse.json(
      { error: 'Failed to track activity' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get recent activities (last 24 hours)
    const activities = await prisma.userActivity.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    })

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
} 
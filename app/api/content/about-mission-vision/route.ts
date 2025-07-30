import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'



export async function GET() {
  try {
    const missionVision = await prisma.aboutMissionVision.findMany({
      orderBy: {
        type: 'asc'
      }
    })
    
    if (missionVision.length === 0) {
      // Return default content if none exists
      return NextResponse.json([
        {
          id: 'default-mission',
          type: 'mission',
          title: 'Our Mission',
          description: 'To deliver consistent, customized, and cost-effective metal finishing services that exceed customer expectations and elevate product performance. We are committed to providing solutions that combine technical excellence with reliable results.',
          icon: 'Target'
        },
        {
          id: 'default-vision',
          type: 'vision',
          title: 'Our Vision',
          description: 'To be a leading force in the surface finishing industry by offering solutions that combine technology, trust, and technical excellence. We aspire to set new standards in metal finishing while maintaining our commitment to quality and innovation.',
          icon: 'Eye'
        }
      ])
    }
    
    return NextResponse.json(missionVision)
  } catch (error) {
    console.error('Error fetching about mission/vision:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about mission/vision' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, title, description, icon } = body

    const result = await prisma.aboutMissionVision.create({
      data: {
        type,
        title,
        description,
        icon
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating about mission/vision:', error)
    return NextResponse.json(
      { error: 'Failed to create about mission/vision' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, type, title, description, icon } = body

    const result = await prisma.aboutMissionVision.update({
      where: { id },
      data: {
        type,
        title,
        description,
        icon
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating about mission/vision:', error)
    return NextResponse.json(
      { error: 'Failed to update about mission/vision' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Mission/Vision ID is required' },
        { status: 400 }
      )
    }

    await prisma.aboutMissionVision.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting about mission/vision:', error)
    return NextResponse.json(
      { error: 'Failed to delete about mission/vision' },
      { status: 500 }
    )
  }
} 
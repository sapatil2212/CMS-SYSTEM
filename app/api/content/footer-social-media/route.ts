import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const socialMedia = await prisma.footerSocialMedia.findMany({
      orderBy: { order: 'asc' }
    })
    
    if (socialMedia.length === 0) {
      // Create default social media if none exist
      const defaultSocialMedia = await prisma.footerSocialMedia.createMany({
        data: [
          {
            platform: 'facebook',
            url: '#',
            icon: 'facebook',
            order: 1
          },
          {
            platform: 'twitter',
            url: '#',
            icon: 'twitter',
            order: 2
          },
          {
            platform: 'instagram',
            url: '#',
            icon: 'instagram',
            order: 3
          },
          {
            platform: 'linkedin',
            url: '#',
            icon: 'linkedin',
            order: 4
          }
        ]
      })
      
      const newSocialMedia = await prisma.footerSocialMedia.findMany({
        orderBy: { order: 'asc' }
      })
      return NextResponse.json(newSocialMedia)
    }
    
    return NextResponse.json(socialMedia)
  } catch (error) {
    console.error('Error fetching footer social media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch footer social media' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { platform, url, icon, order } = body

    const socialMedia = await prisma.footerSocialMedia.create({
      data: {
        platform,
        url,
        icon,
        order: order || 0
      }
    })
    
    return NextResponse.json(socialMedia)
  } catch (error) {
    console.error('Error creating footer social media:', error)
    return NextResponse.json(
      { error: 'Failed to create footer social media' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, platform, url, icon, isActive, order } = body

    const socialMedia = await prisma.footerSocialMedia.update({
      where: { id },
      data: {
        platform,
        url,
        icon,
        isActive,
        order
      }
    })
    
    return NextResponse.json(socialMedia)
  } catch (error) {
    console.error('Error updating footer social media:', error)
    return NextResponse.json(
      { error: 'Failed to update footer social media' },
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
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    await prisma.footerSocialMedia.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting footer social media:', error)
    return NextResponse.json(
      { error: 'Failed to delete footer social media' },
      { status: 500 }
    )
  }
} 
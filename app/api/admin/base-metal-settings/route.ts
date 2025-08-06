import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';

export async function GET() {
  try {
    const baseMetalSettings = await prisma.baseMetalSettings.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(baseMetalSettings)
  } catch (error) {
    logger.error('Error fetching base metal settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, name, isActive } = body

    if (!slug || typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }

    // Check if the base metal setting already exists
    const existingSetting = await prisma.baseMetalSettings.findUnique({
      where: { slug }
    })

    let updatedSetting

    if (existingSetting) {
      // Update existing setting
      updatedSetting = await prisma.baseMetalSettings.update({
        where: { slug },
        data: { isActive },
        select: {
          id: true,
          slug: true,
          name: true,
          isActive: true
        }
      })
    } else {
      // Create new setting
      if (!name) {
        return NextResponse.json({ error: 'Name is required for new base metals' }, { status: 400 })
      }

      updatedSetting = await prisma.baseMetalSettings.create({
        data: {
          slug,
          name,
          isActive
        },
        select: {
          id: true,
          slug: true,
          name: true,
          isActive: true
        }
      })
    }

    return NextResponse.json(updatedSetting)
  } catch (error) {
    logger.error('Error updating base metal setting:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // Delete the base metal setting and its content
    await prisma.$transaction([
      prisma.baseMetalContent.deleteMany({ where: { slug } }),
      prisma.baseMetalSettings.delete({ where: { slug } })
    ])

    return NextResponse.json({ message: 'Base metal deleted successfully' })
  } catch (error) {
    logger.error('Error deleting base metal:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
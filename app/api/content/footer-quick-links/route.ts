import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';

// Add OPTIONS method for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function GET() {
  try {
    const quickLinks = await prisma.footerQuickLink.findMany({
      orderBy: { order: 'asc' }
    })
    
    if (quickLinks.length === 0) {
      // Create default quick links if none exist
      const defaultQuickLinks = await prisma.footerQuickLink.createMany({
        data: [
          { name: 'Home', href: '/', order: 1 },
          { name: 'Services', href: '/services', order: 2 },
          { name: 'Industries', href: '/industries', order: 3 },
          { name: 'About Us', href: '/about', order: 4 },
          { name: 'Contact', href: '/contact', order: 5 },
          { name: 'Blog', href: '/blog', order: 6 }
        ]
      })
      
      const newQuickLinks = await prisma.footerQuickLink.findMany({
        orderBy: { order: 'asc' }
      })
      return NextResponse.json(newQuickLinks)
    }
    
    return NextResponse.json(quickLinks)
  } catch (error) {
    logger.error('Error fetching footer quick links:', error)
    return NextResponse.json(
      { error: 'Failed to fetch footer quick links' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, href, order } = body

    const quickLink = await prisma.footerQuickLink.create({
      data: {
        name,
        href,
        order: order || 0
      }
    })
    
    return NextResponse.json(quickLink)
  } catch (error) {
    logger.error('Error creating footer quick link:', error)
    return NextResponse.json(
      { error: 'Failed to create footer quick link' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, href, isActive, order } = body

    const quickLink = await prisma.footerQuickLink.update({
      where: { id },
      data: {
        name,
        href,
        isActive,
        order
      }
    })
    
    return NextResponse.json(quickLink)
  } catch (error) {
    logger.error('Error updating footer quick link:', error)
    return NextResponse.json(
      { error: 'Failed to update footer quick link' },
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

    await prisma.footerQuickLink.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error deleting footer quick link:', error)
    return NextResponse.json(
      { error: 'Failed to delete footer quick link' },
      { status: 500 }
    )
  }
} 
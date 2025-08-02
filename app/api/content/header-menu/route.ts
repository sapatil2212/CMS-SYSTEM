import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const menuItems = await prisma.headerMenuItem.findMany({
      include: {
        dropdownItems: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(menuItems)
  } catch (error) {
    console.error('Error fetching header menu items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch header menu items' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { menuItemId, isActive } = body

    if (!menuItemId || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    const updatedMenuItem = await prisma.headerMenuItem.update({
      where: { id: menuItemId },
      data: { isActive },
      include: {
        dropdownItems: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(updatedMenuItem)
  } catch (error) {
    console.error('Error updating header menu item:', error)
    return NextResponse.json(
      { error: 'Failed to update header menu item' },
      { status: 500 }
    )
  }
} 
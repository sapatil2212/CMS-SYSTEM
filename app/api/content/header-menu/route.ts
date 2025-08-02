import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const menuItems = await prisma.headerMenuItem.findMany({
      include: {
        dropdownItems: {
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
    const { menuItemId, dropdownItemId, isActive } = body

    // If dropdownItemId is provided, update dropdown item
    if (dropdownItemId) {
      if (!dropdownItemId || typeof isActive !== 'boolean') {
        return NextResponse.json(
          { error: 'Invalid request data for dropdown item' },
          { status: 400 }
        )
      }

      const updatedDropdownItem = await prisma.headerMenuDropdownItem.update({
        where: { id: dropdownItemId },
        data: { isActive }
      })

      return NextResponse.json(updatedDropdownItem)
    }

    // Otherwise, update menu item
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
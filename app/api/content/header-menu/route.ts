import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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
    console.log('Header menu GET request received')
    
    const menuItems = await prisma.headerMenuItem.findMany({
      include: {
        dropdownItems: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    console.log('Menu items fetched successfully:', menuItems.length)
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
    console.log('Header menu PUT request received')
    console.log('Request method:', request.method)
    console.log('Request URL:', request.url)
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { menuItemId, dropdownItemId, isActive } = body

    // If dropdownItemId is provided, update dropdown item
    if (dropdownItemId) {
      console.log('Updating dropdown item:', dropdownItemId, 'isActive:', isActive)
      
      if (!dropdownItemId || typeof isActive !== 'boolean') {
        console.error('Invalid request data for dropdown item:', { dropdownItemId, isActive })
        return NextResponse.json(
          { error: 'Invalid request data for dropdown item' },
          { status: 400 }
        )
      }

      const updatedDropdownItem = await prisma.headerMenuDropdownItem.update({
        where: { id: dropdownItemId },
        data: { isActive }
      })

      console.log('Dropdown item updated successfully:', updatedDropdownItem)
      return NextResponse.json(updatedDropdownItem)
    }

    // Otherwise, update menu item
    console.log('Updating menu item:', menuItemId, 'isActive:', isActive)
    
    if (!menuItemId || typeof isActive !== 'boolean') {
      console.error('Invalid request data for menu item:', { menuItemId, isActive })
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

    console.log('Menu item updated successfully:', updatedMenuItem)
    return NextResponse.json(updatedMenuItem)
  } catch (error) {
    console.error('Error updating header menu item:', error)
    return NextResponse.json(
      { error: 'Failed to update header menu item' },
      { status: 500 }
    )
  }
}

// Add POST method as fallback for debugging
export async function POST(request: NextRequest) {
  try {
    console.log('Header menu POST request received (fallback)')
    console.log('Request method:', request.method)
    console.log('Request URL:', request.url)
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { menuItemId, dropdownItemId, isActive } = body

    // If dropdownItemId is provided, update dropdown item
    if (dropdownItemId) {
      console.log('Updating dropdown item:', dropdownItemId, 'isActive:', isActive)
      
      if (!dropdownItemId || typeof isActive !== 'boolean') {
        console.error('Invalid request data for dropdown item:', { dropdownItemId, isActive })
        return NextResponse.json(
          { error: 'Invalid request data for dropdown item' },
          { status: 400 }
        )
      }

      const updatedDropdownItem = await prisma.headerMenuDropdownItem.update({
        where: { id: dropdownItemId },
        data: { isActive }
      })

      console.log('Dropdown item updated successfully:', updatedDropdownItem)
      return NextResponse.json(updatedDropdownItem)
    }

    // Otherwise, update menu item
    console.log('Updating menu item:', menuItemId, 'isActive:', isActive)
    
    if (!menuItemId || typeof isActive !== 'boolean') {
      console.error('Invalid request data for menu item:', { menuItemId, isActive })
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

    console.log('Menu item updated successfully:', updatedMenuItem)
    return NextResponse.json(updatedMenuItem)
  } catch (error) {
    console.error('Error updating header menu item:', error)
    return NextResponse.json(
      { error: 'Failed to update header menu item' },
      { status: 500 }
    )
  }
} 
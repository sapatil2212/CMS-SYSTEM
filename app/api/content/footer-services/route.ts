import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const services = await prisma.footerService.findMany({
      orderBy: { order: 'asc' }
    })
    
    if (services.length === 0) {
      // Create default services if none exist
      const defaultServices = await prisma.footerService.createMany({
        data: [
          { name: 'Silver Plating', order: 1 },
          { name: 'Electroless Nickel Plating', order: 2 },
          { name: 'Bright Tin Plating', order: 3 },
          { name: 'Copper Plating', order: 4 },
          { name: 'Quality Testing', order: 5 },
          { name: 'Custom Solutions', order: 6 }
        ]
      })
      
      const newServices = await prisma.footerService.findMany({
        orderBy: { order: 'asc' }
      })
      return NextResponse.json(newServices)
    }
    
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching footer services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch footer services' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, order } = body

    const service = await prisma.footerService.create({
      data: {
        name,
        order: order || 0
      }
    })
    
    return NextResponse.json(service)
  } catch (error) {
    console.error('Error creating footer service:', error)
    return NextResponse.json(
      { error: 'Failed to create footer service' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, isActive, order } = body

    const service = await prisma.footerService.update({
      where: { id },
      data: {
        name,
        isActive,
        order
      }
    })
    
    return NextResponse.json(service)
  } catch (error) {
    console.error('Error updating footer service:', error)
    return NextResponse.json(
      { error: 'Failed to update footer service' },
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

    await prisma.footerService.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting footer service:', error)
    return NextResponse.json(
      { error: 'Failed to delete footer service' },
      { status: 500 }
    )
  }
} 
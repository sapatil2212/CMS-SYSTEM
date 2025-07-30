import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const capabilities = await prisma.aboutCapability.findMany({
      orderBy: {
        order: 'asc'
      }
    })
    
    return NextResponse.json(capabilities)
  } catch (error) {
    console.error('Error fetching about capabilities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about capabilities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { icon, title, description, order, isActive } = body

    const result = await prisma.aboutCapability.create({
      data: {
        icon,
        title,
        description,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating about capability:', error)
    return NextResponse.json(
      { error: 'Failed to create about capability' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, icon, title, description, order, isActive } = body

    const result = await prisma.aboutCapability.update({
      where: { id },
      data: {
        icon,
        title,
        description,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating about capability:', error)
    return NextResponse.json(
      { error: 'Failed to update about capability' },
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
        { error: 'Capability ID is required' },
        { status: 400 }
      )
    }

    await prisma.aboutCapability.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting about capability:', error)
    return NextResponse.json(
      { error: 'Failed to delete about capability' },
      { status: 500 }
    )
  }
} 
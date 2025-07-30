import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const values = await prisma.aboutValue.findMany({
      orderBy: {
        order: 'asc'
      }
    })
    
    return NextResponse.json(values)
  } catch (error) {
    console.error('Error fetching about values:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about values' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { icon, title, description, order, isActive } = body

    const result = await prisma.aboutValue.create({
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
    console.error('Error creating about value:', error)
    return NextResponse.json(
      { error: 'Failed to create about value' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, icon, title, description, order, isActive } = body

    const result = await prisma.aboutValue.update({
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
    console.error('Error updating about value:', error)
    return NextResponse.json(
      { error: 'Failed to update about value' },
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
        { error: 'Value ID is required' },
        { status: 400 }
      )
    }

    await prisma.aboutValue.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting about value:', error)
    return NextResponse.json(
      { error: 'Failed to delete about value' },
      { status: 500 }
    )
  }
} 
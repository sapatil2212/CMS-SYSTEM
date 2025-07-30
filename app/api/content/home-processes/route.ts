import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const processes = await prisma.homeProcess.findMany({
      orderBy: {
        order: 'asc'
      }
    })
    
    return NextResponse.json(processes)
  } catch (error) {
    console.error('Error fetching home processes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch home processes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, content, image, link, order, isActive } = body

    const result = await prisma.homeProcess.create({
      data: {
        title,
        description,
        content,
        image,
        link,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    // Revalidate home page to ensure frontend updates
    revalidatePath('/')
    revalidatePath('/admin/home')

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating home process:', error)
    return NextResponse.json(
      { error: 'Failed to create home process' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, content, image, link, order, isActive } = body

    const result = await prisma.homeProcess.update({
      where: { id },
      data: {
        title,
        description,
        content,
        image,
        link,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    // Revalidate home page to ensure frontend updates
    revalidatePath('/')
    revalidatePath('/admin/home')

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating home process:', error)
    return NextResponse.json(
      { error: 'Failed to update home process' },
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
        { error: 'Process ID is required' },
        { status: 400 }
      )
    }

    await prisma.homeProcess.delete({
      where: { id }
    })

    // Revalidate home page to ensure frontend updates
    revalidatePath('/')
    revalidatePath('/admin/home')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting home process:', error)
    return NextResponse.json(
      { error: 'Failed to delete home process' },
      { status: 500 }
    )
  }
} 
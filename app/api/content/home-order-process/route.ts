import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const steps = await prisma.homeOrderProcessStep.findMany({
      orderBy: { order: 'asc' }
    })
    // Parse details JSON
    const parsed = steps.map(step => ({ ...step, details: JSON.parse(step.details) }))
    return NextResponse.json(parsed)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order process steps' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, details, icon, order, gradientFrom, gradientTo, bgColor, borderColor, textColor } = body
    const step = await prisma.homeOrderProcessStep.create({
      data: {
        title,
        description,
        details: JSON.stringify(details),
        icon,
        order: order || 0,
        gradientFrom,
        gradientTo,
        bgColor,
        borderColor,
        textColor
      }
    })
    return NextResponse.json({ ...step, details: JSON.parse(step.details) })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order process step' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, details, icon, order, gradientFrom, gradientTo, bgColor, borderColor, textColor } = body
    const step = await prisma.homeOrderProcessStep.update({
      where: { id },
      data: {
        title,
        description,
        details: JSON.stringify(details),
        icon,
        order: order || 0,
        gradientFrom,
        gradientTo,
        bgColor,
        borderColor,
        textColor
      }
    })
    return NextResponse.json({ ...step, details: JSON.parse(step.details) })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order process step' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await prisma.homeOrderProcessStep.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete order process step' }, { status: 500 })
  }
} 
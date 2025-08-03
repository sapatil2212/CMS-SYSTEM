import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Get all base metal content with their activation status
    const baseMetals = await Promise.all([
      prisma.aluminiumContent.findFirst().then(content => ({
        id: content?.id || 'aluminium',
        name: 'Aluminium',
        slug: 'aluminium',
        href: '/basemetals/aluminium',
        isMenuActive: content?.isMenuActive ?? true
      })),
      prisma.copperContent.findFirst().then(content => ({
        id: content?.id || 'copper',
        name: 'Copper',
        slug: 'copper',
        href: '/basemetals/copper',
        isMenuActive: content?.isMenuActive ?? true
      })),
      prisma.stainlessSteelContent.findFirst().then(content => ({
        id: content?.id || 'stainless-steel',
        name: 'Stainless Steel',
        slug: 'stainless-steel',
        href: '/basemetals/stainless-steel',
        isMenuActive: content?.isMenuActive ?? true
      })),
      prisma.carbonSteelContent.findFirst().then(content => ({
        id: content?.id || 'carbon-steel',
        name: 'Carbon Steel',
        slug: 'carbon-steel',
        href: '/basemetals/carbon-steel',
        isMenuActive: content?.isMenuActive ?? true
      })),
      prisma.brassContent.findFirst().then(content => ({
        id: content?.id || 'brass',
        name: 'Brass',
        slug: 'brass',
        href: '/basemetals/brass',
        isMenuActive: content?.isMenuActive ?? true
      }))
    ])

    return NextResponse.json(baseMetals)
  } catch (error) {
    console.error('Error fetching base metal activation status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch base metal activation status' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { baseMetalSlug, isMenuActive } = body

    if (!baseMetalSlug || typeof isMenuActive !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    // Map base metal slugs to their respective Prisma models
    const baseMetalModelMap: { [key: string]: any } = {
      'aluminium': prisma.aluminiumContent,
      'copper': prisma.copperContent,
      'stainless-steel': prisma.stainlessSteelContent,
      'carbon-steel': prisma.carbonSteelContent,
      'brass': prisma.brassContent
    }

    const model = baseMetalModelMap[baseMetalSlug]
    if (!model) {
      return NextResponse.json(
        { error: 'Invalid base metal slug' },
        { status: 400 }
      )
    }

    // Update the first record (there should only be one per base metal)
    const updatedBaseMetal = await model.updateMany({
      where: {},
      data: { isMenuActive }
    })

    return NextResponse.json({ success: true, updatedBaseMetal })
  } catch (error) {
    console.error('Error updating base metal activation status:', error)
    return NextResponse.json(
      { error: 'Failed to update base metal activation status' },
      { status: 500 }
    )
  }
} 
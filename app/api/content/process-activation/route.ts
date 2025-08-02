import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
    console.log('Process activation GET request received')
    
    // Get all process content with their activation status
    const processes = await Promise.all([
      prisma.copperPlatingContent.findFirst().then(content => ({
        id: content?.id || 'copper-plating',
        name: 'Copper Plating',
        slug: 'copper-plating',
        href: '/processes/copper-plating',
        isMenuActive: content?.isMenuActive ?? true
      })),
      prisma.silverPlatingContent.findFirst().then(content => ({
        id: content?.id || 'silver-plating',
        name: 'Silver Plating',
        slug: 'silver-plating',
        href: '/processes/silver-plating',
        isMenuActive: content?.isMenuActive ?? true
      })),
      prisma.goldPlatingContent.findFirst().then(content => ({
        id: content?.id || 'gold-plating',
        name: 'Gold Plating',
        slug: 'gold-plating',
        href: '/processes/gold-plating',
        isMenuActive: content?.isMenuActive ?? true
      })),
      prisma.busbarPlatingContent.findFirst().then(content => ({
        id: content?.id || 'busbar-plating',
        name: 'Busbar Plating',
        slug: 'busbar-plating',
        href: '/processes/busbar-plating',
        isMenuActive: content?.isMenuActive ?? true
      })),
      prisma.zincPlatingContent.findFirst().then(content => ({
        id: content?.id || 'zinc-plating',
        name: 'Zinc Plating & Colour Passivates',
        slug: 'zinc-plating',
        href: '/processes/zinc-plating',
        isMenuActive: content?.isMenuActive ?? true
      })),
      prisma.nickelPlatingContent.findFirst().then(content => ({
        id: content?.id || 'nickel-plating',
        name: 'Nickel Plating',
        slug: 'nickel-plating',
        href: '/processes/nickel-plating',
        isMenuActive: content?.isMenuActive ?? true
      })),
      prisma.electrolessNickelPlatingContent.findFirst().then(content => ({
        id: content?.id || 'electroless-nickel-plating',
        name: 'Electroless Nickel Plating',
        slug: 'electroless-nickel-plating',
        href: '/processes/electroless-nickel-plating',
        isMenuActive: content?.isMenuActive ?? true
      })),
      prisma.brightTinPlatingContent.findFirst().then(content => ({
        id: content?.id || 'bright-tin-plating',
        name: 'Bright Tin Plating',
        slug: 'bright-tin-plating',
        href: '/processes/bright-tin-plating',
        isMenuActive: content?.isMenuActive ?? true
      })),
      prisma.dullTinPlatingContent.findFirst().then(content => ({
        id: content?.id || 'dull-tin-plating',
        name: 'Dull Tin Plating',
        slug: 'dull-tin-plating',
        href: '/processes/dull-tin-plating',
        isMenuActive: content?.isMenuActive ?? true
      })),
      prisma.rackBarrelPlatingContent.findFirst().then(content => ({
        id: content?.id || 'rack-barrel-plating',
        name: 'Rack & Barrel Plating',
        slug: 'rack-barrel-plating',
        href: '/processes/rack-barrel-plating',
        isMenuActive: content?.isMenuActive ?? true
      })),
      prisma.zincFlakeCoatingContent.findFirst().then(content => ({
        id: content?.id || 'zinc-flake-coating',
        name: 'Zinc Flake Coating',
        slug: 'zinc-flake-coating',
        href: '/processes/zinc-flake-coating',
        isMenuActive: content?.isMenuActive ?? true
      })),
      prisma.molykoteContent.findFirst().then(content => ({
        id: content?.id || 'molykote',
        name: 'Molykote',
        slug: 'molykote',
        href: '/processes/molykote',
        isMenuActive: content?.isMenuActive ?? true
      }))
    ])

    console.log('Processes fetched successfully:', processes.length)
    return NextResponse.json(processes)
  } catch (error) {
    console.error('Error fetching process activation status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch process activation status' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('Process activation PUT request received')
    console.log('Request method:', request.method)
    console.log('Request URL:', request.url)
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { processSlug, isMenuActive } = body

    if (!processSlug || typeof isMenuActive !== 'boolean') {
      console.error('Invalid request data:', { processSlug, isMenuActive })
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    console.log('Processing request for:', processSlug, 'isMenuActive:', isMenuActive)

    // Map process slugs to their respective Prisma models
    const processModelMap: { [key: string]: any } = {
      'copper-plating': prisma.copperPlatingContent,
      'silver-plating': prisma.silverPlatingContent,
      'gold-plating': prisma.goldPlatingContent,
      'busbar-plating': prisma.busbarPlatingContent,
      'zinc-plating': prisma.zincPlatingContent,
      'nickel-plating': prisma.nickelPlatingContent,
      'electroless-nickel-plating': prisma.electrolessNickelPlatingContent,
      'bright-tin-plating': prisma.brightTinPlatingContent,
      'dull-tin-plating': prisma.dullTinPlatingContent,
      'rack-barrel-plating': prisma.rackBarrelPlatingContent,
      'zinc-flake-coating': prisma.zincFlakeCoatingContent,
      'molykote': prisma.molykoteContent
    }

    const model = processModelMap[processSlug]
    if (!model) {
      console.error('Invalid process slug:', processSlug)
      return NextResponse.json(
        { error: 'Invalid process slug' },
        { status: 400 }
      )
    }

    console.log('Found model for process:', processSlug)

    // Update the first record (there should only be one per process)
    const updatedProcess = await model.updateMany({
      where: {},
      data: { isMenuActive }
    })

    console.log('Process updated successfully:', updatedProcess)
    return NextResponse.json({ success: true, updatedProcess })
  } catch (error) {
    console.error('Error updating process activation status:', error)
    return NextResponse.json(
      { error: 'Failed to update process activation status' },
      { status: 500 }
    )
  }
}

// Add POST method as fallback for debugging
export async function POST(request: NextRequest) {
  try {
    console.log('Process activation POST request received (fallback)')
    console.log('Request method:', request.method)
    console.log('Request URL:', request.url)
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { processSlug, isMenuActive } = body

    if (!processSlug || typeof isMenuActive !== 'boolean') {
      console.error('Invalid request data:', { processSlug, isMenuActive })
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    console.log('Processing request for:', processSlug, 'isMenuActive:', isMenuActive)

    // Map process slugs to their respective Prisma models
    const processModelMap: { [key: string]: any } = {
      'copper-plating': prisma.copperPlatingContent,
      'silver-plating': prisma.silverPlatingContent,
      'gold-plating': prisma.goldPlatingContent,
      'busbar-plating': prisma.busbarPlatingContent,
      'zinc-plating': prisma.zincPlatingContent,
      'nickel-plating': prisma.nickelPlatingContent,
      'electroless-nickel-plating': prisma.electrolessNickelPlatingContent,
      'bright-tin-plating': prisma.brightTinPlatingContent,
      'dull-tin-plating': prisma.dullTinPlatingContent,
      'rack-barrel-plating': prisma.rackBarrelPlatingContent,
      'zinc-flake-coating': prisma.zincFlakeCoatingContent,
      'molykote': prisma.molykoteContent
    }

    const model = processModelMap[processSlug]
    if (!model) {
      console.error('Invalid process slug:', processSlug)
      return NextResponse.json(
        { error: 'Invalid process slug' },
        { status: 400 }
      )
    }

    console.log('Found model for process:', processSlug)

    // Update the first record (there should only be one per process)
    const updatedProcess = await model.updateMany({
      where: {},
      data: { isMenuActive }
    })

    console.log('Process updated successfully:', updatedProcess)
    return NextResponse.json({ success: true, updatedProcess })
  } catch (error) {
    console.error('Error updating process activation status:', error)
    return NextResponse.json(
      { error: 'Failed to update process activation status' },
      { status: 500 }
    )
  }
} 
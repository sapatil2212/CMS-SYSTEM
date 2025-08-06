import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';

// Handle all HTTP methods
export async function GET() {
  return handleGet()
}

export async function POST(request: NextRequest) {
  return handleUpdate(request)
}

export async function PUT(request: NextRequest) {
  return handleUpdate(request)
}

export async function PATCH(request: NextRequest) {
  return handleUpdate(request)
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

async function handleGet() {
  try {
    logger.log('GET request received for base-metal-activation')
    
    // Get all base metal settings from database
    const baseMetalSettings = await prisma.baseMetalSettings.findMany({
      orderBy: { name: 'asc' }
    })
    
    // For each base metal setting, try to get its content from BaseMetalContent
    const baseMetals = await Promise.all(
      baseMetalSettings.map(async (setting) => {
        try {
          // Try to get content from BaseMetalContent table
          const baseMetalContent = await prisma.baseMetalContent.findUnique({
            where: { slug: setting.slug },
            select: { content: true }
          })
          
          // Extract isMenuActive from the content JSON if it exists
          let isMenuActive = true
          if (baseMetalContent?.content && typeof baseMetalContent.content === 'object') {
            const content = baseMetalContent.content as any
            isMenuActive = content.isMenuActive ?? true
          }
          
          return {
            id: setting.id,
            name: setting.name,
            slug: setting.slug,
            href: `/basemetals/${setting.slug}`,
            isMenuActive
          }
        } catch (error) {
          logger.error(`Error fetching content for ${setting.slug}:`, error)
          // Return with default isMenuActive if there's an error
          return {
            id: setting.id,
            name: setting.name,
            slug: setting.slug,
            href: `/basemetals/${setting.slug}`,
            isMenuActive: true
          }
        }
      })
    )

    logger.log('Base metals fetched successfully:', baseMetals.length)
    return NextResponse.json(baseMetals)
  } catch (error) {
    logger.error('Error fetching base metal activation status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch base metal activation status' },
      { status: 500 }
    )
  }
}

async function handleUpdate(request: NextRequest) {
  try {
    logger.log(`${request.method} request received for base-metal-activation`)
    
    const body = await request.json()
    logger.log('Request body:', body)
    
    const { baseMetalSlug, isMenuActive } = body

    if (!baseMetalSlug || typeof isMenuActive !== 'boolean') {
      logger.error('Invalid request data:', { baseMetalSlug, isMenuActive })
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    logger.log('Updating base metal:', baseMetalSlug, 'to:', isMenuActive)

    // Check if this base metal exists in BaseMetalSettings
    const baseMetalSetting = await prisma.baseMetalSettings.findUnique({
      where: { slug: baseMetalSlug }
    })

    if (!baseMetalSetting) {
      logger.error('Base metal not found in settings:', baseMetalSlug)
      return NextResponse.json(
        { error: 'Base metal not found' },
        { status: 404 }
      )
    }

    // Try to update the content in BaseMetalContent table
    let updatedBaseMetal
    try {
      // Get existing content from BaseMetalContent
      const existingContent = await prisma.baseMetalContent.findUnique({
        where: { slug: baseMetalSlug }
      })

      if (existingContent) {
        // Update existing content with the new isMenuActive value
        const currentContent = existingContent.content as any
        const updatedContent = {
          ...currentContent,
          isMenuActive
        }

        updatedBaseMetal = await prisma.baseMetalContent.update({
          where: { slug: baseMetalSlug },
          data: { content: updatedContent }
        })
      } else {
        // Create new content entry with default content and isMenuActive
        const defaultContent = {
          heroTitle: `${baseMetalSetting.name} Plating Services`,
          heroSubtitle: `Professional ${baseMetalSetting.name} Plating Solutions`,
          heroDescription: `High-quality ${baseMetalSetting.name.toLowerCase()} plating services for industrial applications`,
          isMenuActive
        }

        updatedBaseMetal = await prisma.baseMetalContent.create({
          data: {
            slug: baseMetalSlug,
            content: defaultContent
          }
        })
      }

      logger.log('Update result for BaseMetalContent:', updatedBaseMetal)
      return NextResponse.json({ success: true, updatedBaseMetal })

    } catch (contentError) {
      logger.log('BaseMetalContent update failed, trying legacy models:', contentError)
      
      // Fallback to legacy hardcoded models for backwards compatibility
      const baseMetalModelMap: { [key: string]: any } = {
        'aluminium': prisma.aluminiumContent,
        'copper': prisma.copperContent,
        'stainless-steel': prisma.stainlessSteelContent,
        'carbon-steel': prisma.carbonSteelContent,
        'brass': prisma.brassContent
      }

      const model = baseMetalModelMap[baseMetalSlug]
      if (model) {
        // Update the first record (there should only be one per base metal)
        updatedBaseMetal = await model.updateMany({
          where: {},
          data: { isMenuActive }
        })

        logger.log('Update result for legacy model:', updatedBaseMetal)
        return NextResponse.json({ success: true, updatedBaseMetal })
      } else {
        throw new Error(`No model found for base metal: ${baseMetalSlug}`)
      }
    }
  } catch (error) {
    logger.error('Error updating base metal activation status:', error)
    return NextResponse.json(
      { error: 'Failed to update base metal activation status' },
      { status: 500 }
    )
  }
} 
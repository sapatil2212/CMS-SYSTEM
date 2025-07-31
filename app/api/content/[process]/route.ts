import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { process: string } }
) {
  try {
    const { process } = params
    
    // Map process slug to Prisma model
    const processModelMap: { [key: string]: string } = {
      'copper-plating': 'copperPlatingContent',
      'silver-plating': 'silverPlatingContent',
      'gold-plating': 'goldPlatingContent',
      'nickel-plating': 'nickelPlatingContent',
      'electroless-nickel-plating': 'electrolessNickelPlatingContent',
      'zinc-plating': 'zincPlatingContent',
      'bright-tin-plating': 'brightTinPlatingContent',
      'dull-tin-plating': 'dullTinPlatingContent',
      'busbar-plating': 'busbarPlatingContent',
      'rack-barrel-plating': 'rackBarrelPlatingContent',
      'zinc-flake-coating': 'zincFlakeCoatingContent',
      'molykote': 'molykoteContent'
    }

    const modelName = processModelMap[process]
    if (!modelName) {
      return NextResponse.json({ error: 'Process not found' }, { status: 404 })
    }

    // Use dynamic Prisma query
    const content = await (prisma as any)[modelName].findFirst({
      include: {
        benefits: {
          orderBy: { order: 'asc' }
        },
        processSteps: {
          orderBy: { order: 'asc' }
        },
        applications: {
          orderBy: { order: 'asc' }
        },
        industries: {
          orderBy: { order: 'asc' }
        },
        qualityChecks: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Parse JSON strings back to arrays for frontend consumption
    const parsedContent = {
      ...content,
      applications: content.applications?.map((app: any) => ({
        ...app,
        items: typeof app.items === 'string' ? JSON.parse(app.items) : app.items
      })) || [],
      industries: content.industries?.map((industry: any) => ({
        ...industry,
        examples: typeof industry.examples === 'string' ? JSON.parse(industry.examples) : industry.examples
      })) || []
    }

    return NextResponse.json(parsedContent)
  } catch (error) {
    console.error(`Error fetching ${params.process} content:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { process: string } }
) {
  try {
    const { process } = params
    const body = await request.json()
    
    // Map process slug to Prisma model
    const processModelMap: { [key: string]: string } = {
      'copper-plating': 'copperPlatingContent',
      'silver-plating': 'silverPlatingContent',
      'gold-plating': 'goldPlatingContent',
      'nickel-plating': 'nickelPlatingContent',
      'electroless-nickel-plating': 'electrolessNickelPlatingContent',
      'zinc-plating': 'zincPlatingContent',
      'bright-tin-plating': 'brightTinPlatingContent',
      'dull-tin-plating': 'dullTinPlatingContent',
      'busbar-plating': 'busbarPlatingContent',
      'rack-barrel-plating': 'rackBarrelPlatingContent',
      'zinc-flake-coating': 'zincFlakeCoatingContent',
      'molykote': 'molykoteContent'
    }

    const modelName = processModelMap[process]
    if (!modelName) {
      return NextResponse.json({ error: 'Process not found' }, { status: 404 })
    }

    // Check if content exists
    const existingContent = await (prisma as any)[modelName].findFirst()
    
    const contentData = {
      heroTitle: body.heroTitle,
      heroSubtitle: body.heroSubtitle,
      heroDescription: body.heroDescription,
      heroImage: body.heroImage,
      whatIsTitle: body.whatIsTitle,
      whatIsDescription: body.whatIsDescription,
      whatIsImage: body.whatIsImage,
      whatIsBestFor: body.whatIsBestFor,
      whatIsMaterials: body.whatIsMaterials,
      whatIsAlkalineOffers: body.whatIsAlkalineOffers,
      benefitsTitle: body.benefitsTitle,
      benefitsSubtitle: body.benefitsSubtitle,
      processTitle: body.processTitle,
      processSubtitle: body.processSubtitle,
      applicationsTitle: body.applicationsTitle,
      applicationsSubtitle: body.applicationsSubtitle,
      industriesTitle: body.industriesTitle,
      industriesSubtitle: body.industriesSubtitle,
      qualityTitle: body.qualityTitle,
      qualityDescription: body.qualityDescription,
      qualityImage: body.qualityImage,
      ctaTitle: body.ctaTitle,
      ctaDescription: body.ctaDescription,
      benefits: {
        deleteMany: {},
        create: (body.benefits || []).map((benefit: any, index: number) => ({
          icon: benefit.icon || '',
          title: benefit.title || '',
          description: benefit.description || '',
          order: index
        }))
      },
      processSteps: {
        deleteMany: {},
        create: (body.processSteps || []).map((step: any, index: number) => ({
          step: step.step || '',
          title: step.title || '',
          description: step.description || '',
          icon: step.icon || '',
          order: index
        }))
      },
      applications: {
        deleteMany: {},
        create: (body.applications || []).map((app: any, index: number) => ({
          title: app.title || '',
          image: app.image || '',
          items: JSON.stringify(app.items || []),
          order: index
        }))
      },
      industries: {
        deleteMany: {},
        create: (body.industries || []).map((industry: any, index: number) => ({
          name: industry.name || '',
          icon: industry.icon || '',
          examples: JSON.stringify(industry.examples || []),
          image: industry.image || '',
          order: index
        }))
      },
      qualityChecks: {
        deleteMany: {},
        create: (body.qualityChecks || []).map((check: any, index: number) => ({
          title: check.title || '',
          description: check.description || '',
          order: index
        }))
      }
    }

    if (existingContent) {
      // Update existing content
      const updatedContent = await (prisma as any)[modelName].update({
        where: { id: existingContent.id },
        data: contentData,
        include: {
          benefits: { orderBy: { order: 'asc' } },
          processSteps: { orderBy: { order: 'asc' } },
          applications: { orderBy: { order: 'asc' } },
          industries: { orderBy: { order: 'asc' } },
          qualityChecks: { orderBy: { order: 'asc' } }
        }
      })
      
      return NextResponse.json(updatedContent)
    } else {
      // Create new content
      const newContent = await (prisma as any)[modelName].create({
        data: contentData,
        include: {
          benefits: { orderBy: { order: 'asc' } },
          processSteps: { orderBy: { order: 'asc' } },
          applications: { orderBy: { order: 'asc' } },
          industries: { orderBy: { order: 'asc' } },
          qualityChecks: { orderBy: { order: 'asc' } }
        }
      })
      
      return NextResponse.json(newContent)
    }
  } catch (error) {
    console.error(`Error saving ${params.process} content:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
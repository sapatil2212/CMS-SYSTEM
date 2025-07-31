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
    
    console.log(`Processing ${process} content update...`)
    
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
      console.log(`Process not found: ${process}`)
      return NextResponse.json({ error: 'Process not found' }, { status: 404 })
    }

    console.log(`Using model: ${modelName}`)

    // Check if content exists
    const existingContent = await (prisma as any)[modelName].findFirst()
    console.log(`Existing content found: ${!!existingContent}`)

    // Use Prisma transaction for better Railway database handling
    const result = await prisma.$transaction(async (tx) => {
      // Prepare main content data (without relationships)
      const mainContentData = {
        heroTitle: body.heroTitle || '',
        heroSubtitle: body.heroSubtitle || '',
        heroDescription: body.heroDescription || '',
        heroImage: body.heroImage || '',
        whatIsTitle: body.whatIsTitle || '',
        whatIsDescription: body.whatIsDescription || '',
        whatIsImage: body.whatIsImage || '',
        whatIsBestFor: body.whatIsBestFor || '',
        whatIsMaterials: body.whatIsMaterials || '',
        whatIsAlkalineOffers: body.whatIsAlkalineOffers || '',
        benefitsTitle: body.benefitsTitle || '',
        benefitsSubtitle: body.benefitsSubtitle || '',
        processTitle: body.processTitle || '',
        processSubtitle: body.processSubtitle || '',
        applicationsTitle: body.applicationsTitle || '',
        applicationsSubtitle: body.applicationsSubtitle || '',
        industriesTitle: body.industriesTitle || '',
        industriesSubtitle: body.industriesSubtitle || '',
        qualityTitle: body.qualityTitle || '',
        qualityDescription: body.qualityDescription || '',
        qualityImage: body.qualityImage || '',
        ctaTitle: body.ctaTitle || '',
        ctaDescription: body.ctaDescription || ''
      }

      let content
      if (existingContent) {
        // Update main content first
        content = await (tx as any)[modelName].update({
          where: { id: existingContent.id },
          data: mainContentData
        })
        console.log(`Updated existing content for ${process}`)
      } else {
        // Create main content first
        content = await (tx as any)[modelName].create({
          data: mainContentData
        })
        console.log(`Created new content for ${process}`)
      }

      // Handle related data separately to avoid Railway connection issues
      if (body.benefits && body.benefits.length > 0) {
        // Delete existing benefits
        await (tx as any)[`${modelName.replace('Content', 'Benefit')}`].deleteMany({
          where: { contentId: content.id }
        })
        
        // Create new benefits
        const benefitModel = `${modelName.replace('Content', 'Benefit')}`
        for (const [index, benefit] of body.benefits.entries()) {
          await (tx as any)[benefitModel].create({
            data: {
              contentId: content.id,
              icon: benefit.icon || '',
              title: benefit.title || '',
              description: benefit.description || '',
              order: index
            }
          })
        }
        console.log(`Updated ${body.benefits.length} benefits`)
      }

      // Handle process steps
      if (body.processSteps && body.processSteps.length > 0) {
        await (tx as any)[`${modelName.replace('Content', 'ProcessStep')}`].deleteMany({
          where: { contentId: content.id }
        })
        
        const stepModel = `${modelName.replace('Content', 'ProcessStep')}`
        for (const [index, step] of body.processSteps.entries()) {
          await (tx as any)[stepModel].create({
            data: {
              contentId: content.id,
              step: step.step || '',
              title: step.title || '',
              description: step.description || '',
              icon: step.icon || '',
              order: index
            }
          })
        }
        console.log(`Updated ${body.processSteps.length} process steps`)
      }

      // Handle applications
      if (body.applications && body.applications.length > 0) {
        await (tx as any)[`${modelName.replace('Content', 'Application')}`].deleteMany({
          where: { contentId: content.id }
        })
        
        const appModel = `${modelName.replace('Content', 'Application')}`
        for (const [index, app] of body.applications.entries()) {
          await (tx as any)[appModel].create({
            data: {
              contentId: content.id,
              title: app.title || '',
              image: app.image || '',
              items: JSON.stringify(app.items || []),
              order: index
            }
          })
        }
        console.log(`Updated ${body.applications.length} applications`)
      }

      // Handle industries
      if (body.industries && body.industries.length > 0) {
        await (tx as any)[`${modelName.replace('Content', 'Industry')}`].deleteMany({
          where: { contentId: content.id }
        })
        
        const industryModel = `${modelName.replace('Content', 'Industry')}`
        for (const [index, industry] of body.industries.entries()) {
          await (tx as any)[industryModel].create({
            data: {
              contentId: content.id,
              name: industry.name || '',
              icon: industry.icon || '',
              examples: JSON.stringify(industry.examples || []),
              image: industry.image || '',
              order: index
            }
          })
        }
        console.log(`Updated ${body.industries.length} industries`)
      }

      // Handle quality checks
      if (body.qualityChecks && body.qualityChecks.length > 0) {
        await (tx as any)[`${modelName.replace('Content', 'QualityCheck')}`].deleteMany({
          where: { contentId: content.id }
        })
        
        const qualityModel = `${modelName.replace('Content', 'QualityCheck')}`
        for (const [index, check] of body.qualityChecks.entries()) {
          await (tx as any)[qualityModel].create({
            data: {
              contentId: content.id,
              title: check.title || '',
              description: check.description || '',
              order: index
            }
          })
        }
        console.log(`Updated ${body.qualityChecks.length} quality checks`)
      }

      return content
    }, {
      maxWait: 10000, // 10 seconds
      timeout: 15000, // 15 seconds
    })

    // Fetch complete content with relationships for response
    const finalContent = await (prisma as any)[modelName].findFirst({
      where: { id: result.id },
      include: {
        benefits: { orderBy: { order: 'asc' } },
        processSteps: { orderBy: { order: 'asc' } },
        applications: { orderBy: { order: 'asc' } },
        industries: { orderBy: { order: 'asc' } },
        qualityChecks: { orderBy: { order: 'asc' } }
      }
    })

    console.log(`Successfully saved ${process} content`)
    return NextResponse.json(finalContent)

  } catch (error) {
    console.error(`Error saving ${params.process} content:`, error)
    
    // Provide more specific error information
    let errorMessage = 'Internal server error'
    if (error instanceof Error) {
      if (error.message.includes('P2002')) {
        errorMessage = 'Duplicate content detected'
      } else if (error.message.includes('P2025')) {
        errorMessage = 'Content not found'
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Database operation timed out'
      } else if (error.message.includes('connect')) {
        errorMessage = 'Database connection failed'
      }
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 
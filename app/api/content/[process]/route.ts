import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function GET(
  request: NextRequest,
  { params }: { params: { process: string } }
) {
  try {
    const { process } = params

    // For now, we only have copper-plating implemented
    // You can extend this to handle other processes
    if (process === 'copper-plating') {
      const content = await prisma.copperPlatingContent.findFirst({
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

      return NextResponse.json(content)
    }

    // For other processes, return empty content structure
    return NextResponse.json({
      heroTitle: '',
      heroSubtitle: '',
      heroDescription: '',
      heroImage: '',
      whatIsTitle: '',
      whatIsDescription: '',
      whatIsImage: '',
      whatIsBestFor: '',
      whatIsMaterials: '',
      benefitsTitle: '',
      benefitsSubtitle: '',
      processTitle: '',
      processSubtitle: '',
      applicationsTitle: '',
      applicationsSubtitle: '',
      industriesTitle: '',
      industriesSubtitle: '',
      qualityTitle: '',
      qualityDescription: '',
      ctaTitle: '',
      ctaDescription: '',
      benefits: [],
      processSteps: [],
      applications: [],
      industries: [],
      qualityChecks: []
    })
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
    
    console.log('API: Received request for process:', process)
    console.log('API: Request body:', JSON.stringify(body, null, 2))

    if (process === 'copper-plating') {
      // Check if content already exists
      const existingContent = await prisma.copperPlatingContent.findFirst()

      // Extract content fields from the body (they might be nested in a content object)
      const contentData = body.content || body
      
      console.log('API: Extracted content data:', JSON.stringify(contentData, null, 2))

      if (existingContent) {
        console.log('API: Updating existing content with ID:', existingContent.id)
        // Update existing content
        const updatedContent = await prisma.copperPlatingContent.update({
          where: { id: existingContent.id },
          data: {
            heroTitle: contentData.heroTitle || '',
            heroSubtitle: contentData.heroSubtitle || '',
            heroDescription: contentData.heroDescription || '',
            heroImage: contentData.heroImage || '',
            whatIsTitle: contentData.whatIsTitle || '',
            whatIsDescription: contentData.whatIsDescription || '',
            whatIsImage: contentData.whatIsImage || '',
            whatIsBestFor: contentData.whatIsBestFor || '',
            whatIsMaterials: contentData.whatIsMaterials || '',
            whatIsAlkalineOffers: contentData.whatIsAlkalineOffers || '',
            benefitsTitle: contentData.benefitsTitle || '',
            benefitsSubtitle: contentData.benefitsSubtitle || '',
            processTitle: contentData.processTitle || '',
            processSubtitle: contentData.processSubtitle || '',
            applicationsTitle: contentData.applicationsTitle || '',
            applicationsSubtitle: contentData.applicationsSubtitle || '',
            industriesTitle: contentData.industriesTitle || '',
            industriesSubtitle: contentData.industriesSubtitle || '',
            qualityTitle: contentData.qualityTitle || '',
            qualityDescription: contentData.qualityDescription || '',
            qualityImage: contentData.qualityImage || '',
            ctaTitle: contentData.ctaTitle || '',
            ctaDescription: contentData.ctaDescription || '',
            benefits: {
              deleteMany: {},
              create: (contentData.benefits || []).map((benefit: any, index: number) => ({
                icon: benefit.icon || '',
                title: benefit.title || '',
                description: benefit.description || '',
                order: index
              }))
            },
            processSteps: {
              deleteMany: {},
              create: (contentData.processSteps || []).map((step: any, index: number) => ({
                step: step.step || '',
                title: step.title || '',
                description: step.description || '',
                icon: step.icon || '',
                order: index
              }))
            },
            applications: {
              deleteMany: {},
              create: (contentData.applications || []).map((app: any, index: number) => ({
                title: app.title || '',
                image: app.image || '',
                items: JSON.stringify(app.items || []),
                order: index
              }))
            },
            industries: {
              deleteMany: {},
              create: (contentData.industries || []).map((industry: any, index: number) => ({
                name: industry.name || '',
                icon: industry.icon || '',
                examples: JSON.stringify(industry.examples || []),
                image: industry.image || '',
                order: index
              }))
            },
            qualityChecks: {
              deleteMany: {},
              create: (contentData.qualityChecks || []).map((check: any, index: number) => ({
                title: check.title || '',
                description: check.description || '',
                order: index
              }))
            }
          },
          include: {
            benefits: { orderBy: { order: 'asc' } },
            processSteps: { orderBy: { order: 'asc' } },
            applications: { orderBy: { order: 'asc' } },
            industries: { orderBy: { order: 'asc' } },
            qualityChecks: { orderBy: { order: 'asc' } }
          }
        })
        
        console.log('API: Content updated successfully')
        
        // Revalidate the process page to ensure frontend updates
        revalidatePath(`/processes/${process}`)
        revalidatePath('/processes')
        
        return NextResponse.json(updatedContent)
      } else {
        console.log('API: Creating new content')
        // Create new content with default values for all required fields
        const newContent = await prisma.copperPlatingContent.create({
          data: {
            heroTitle: contentData.heroTitle || '',
            heroSubtitle: contentData.heroSubtitle || '',
            heroDescription: contentData.heroDescription || '',
            heroImage: contentData.heroImage || '',
            whatIsTitle: contentData.whatIsTitle || '',
            whatIsDescription: contentData.whatIsDescription || '',
            whatIsImage: contentData.whatIsImage || '',
            whatIsBestFor: contentData.whatIsBestFor || '',
            whatIsMaterials: contentData.whatIsMaterials || '',
            whatIsAlkalineOffers: contentData.whatIsAlkalineOffers || '',
            benefitsTitle: contentData.benefitsTitle || '',
            benefitsSubtitle: contentData.benefitsSubtitle || '',
            processTitle: contentData.processTitle || '',
            processSubtitle: contentData.processSubtitle || '',
            applicationsTitle: contentData.applicationsTitle || '',
            applicationsSubtitle: contentData.applicationsSubtitle || '',
            industriesTitle: contentData.industriesTitle || '',
            industriesSubtitle: contentData.industriesSubtitle || '',
            qualityTitle: contentData.qualityTitle || '',
            qualityDescription: contentData.qualityDescription || '',
            qualityImage: contentData.qualityImage || '',
            ctaTitle: contentData.ctaTitle || '',
            ctaDescription: contentData.ctaDescription || '',
            benefits: {
              create: (contentData.benefits || []).map((benefit: any, index: number) => ({
                icon: benefit.icon || '',
                title: benefit.title || '',
                description: benefit.description || '',
                order: index
              }))
            },
            processSteps: {
              create: (contentData.processSteps || []).map((step: any, index: number) => ({
                step: step.step || '',
                title: step.title || '',
                description: step.description || '',
                icon: step.icon || '',
                order: index
              }))
            },
            applications: {
              create: (contentData.applications || []).map((app: any, index: number) => ({
                title: app.title || '',
                image: app.image || '',
                items: JSON.stringify(app.items || []),
                order: index
              }))
            },
            industries: {
              create: (contentData.industries || []).map((industry: any, index: number) => ({
                name: industry.name || '',
                icon: industry.icon || '',
                examples: JSON.stringify(industry.examples || []),
                image: industry.image || '',
                order: index
              }))
            },
            qualityChecks: {
              create: (contentData.qualityChecks || []).map((check: any, index: number) => ({
                title: check.title || '',
                description: check.description || '',
                order: index
              }))
            }
          },
          include: {
            benefits: { orderBy: { order: 'asc' } },
            processSteps: { orderBy: { order: 'asc' } },
            applications: { orderBy: { order: 'asc' } },
            industries: { orderBy: { order: 'asc' } },
            qualityChecks: { orderBy: { order: 'asc' } }
          }
        })
        
        console.log('API: Content created successfully')
        
        // Revalidate the process page to ensure frontend updates
        revalidatePath(`/processes/${process}`)
        revalidatePath('/processes')
        
        return NextResponse.json(newContent)
      }
    }

    return NextResponse.json(
      { error: 'Process not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Error saving copper plating content:', error)
    return NextResponse.json(
      { error: 'Failed to save content' },
      { status: 500 }
    )
  }
} 
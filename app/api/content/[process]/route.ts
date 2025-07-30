import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

    // For now, we only have copper-plating implemented
    if (process === 'copper-plating') {
      // Check if content exists
      const existingContent = await prisma.copperPlatingContent.findFirst()
      
      if (existingContent) {
        // Update existing content
        const updatedContent = await prisma.copperPlatingContent.update({
          where: { id: existingContent.id },
          data: {
            heroTitle: body.heroTitle,
            heroSubtitle: body.heroSubtitle,
            heroDescription: body.heroDescription,
            heroImage: body.heroImage,
            whatIsTitle: body.whatIsTitle,
            whatIsDescription: body.whatIsDescription,
            whatIsImage: body.whatIsImage,
            whatIsBestFor: body.whatIsBestFor,
            whatIsMaterials: body.whatIsMaterials,
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
          },
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
        const newContent = await prisma.copperPlatingContent.create({
          data: {
            heroTitle: body.heroTitle,
            heroSubtitle: body.heroSubtitle,
            heroDescription: body.heroDescription,
            heroImage: body.heroImage,
            whatIsTitle: body.whatIsTitle,
            whatIsDescription: body.whatIsDescription,
            whatIsImage: body.whatIsImage,
            whatIsBestFor: body.whatIsBestFor,
            whatIsMaterials: body.whatIsMaterials,
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
            ctaTitle: body.ctaTitle,
            ctaDescription: body.ctaDescription,
            benefits: {
              create: (body.benefits || []).map((benefit: any, index: number) => ({
                icon: benefit.icon || '',
                title: benefit.title || '',
                description: benefit.description || '',
                order: index
              }))
            },
            processSteps: {
              create: (body.processSteps || []).map((step: any, index: number) => ({
                step: step.step || '',
                title: step.title || '',
                description: step.description || '',
                icon: step.icon || '',
                order: index
              }))
            },
            applications: {
              create: (body.applications || []).map((app: any, index: number) => ({
                title: app.title || '',
                image: app.image || '',
                items: JSON.stringify(app.items || []),
                order: index
              }))
            },
            industries: {
              create: (body.industries || []).map((industry: any, index: number) => ({
                name: industry.name || '',
                icon: industry.icon || '',
                examples: JSON.stringify(industry.examples || []),
                image: industry.image || '',
                order: index
              }))
            },
            qualityChecks: {
              create: (body.qualityChecks || []).map((check: any, index: number) => ({
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
        
        return NextResponse.json(newContent)
      }
    }

    // For other processes, return success but don't save (placeholder)
    return NextResponse.json({ message: 'Process not implemented yet' })
  } catch (error) {
    console.error(`Error saving ${params.process} content:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
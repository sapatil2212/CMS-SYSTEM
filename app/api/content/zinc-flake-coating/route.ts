import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const content = await prisma.zincFlakeCoatingContent.findFirst({
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
      applications: content.applications.map(app => ({
        ...app,
        items: typeof app.items === 'string' ? JSON.parse(app.items) : app.items
      })),
      industries: content.industries.map(industry => ({
        ...industry,
        examples: typeof industry.examples === 'string' ? JSON.parse(industry.examples) : industry.examples
      }))
    }

    return NextResponse.json(parsedContent)
  } catch (error) {
    console.error('Error fetching zinc flake coating content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Check if content exists
    const existingContent = await prisma.zincFlakeCoatingContent.findFirst()
    
    if (existingContent) {
      // Update existing content
      const updatedContent = await prisma.zincFlakeCoatingContent.update({
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
      const newContent = await prisma.zincFlakeCoatingContent.create({
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
  } catch (error) {
    console.error('Error saving zinc flake coating content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
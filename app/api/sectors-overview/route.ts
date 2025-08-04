import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET sectors overview content
export async function GET() {
  try {
    let content = await prisma.sectorsOverviewContent.findFirst({
      where: {
        isActive: true
      }
    })

    // If no content exists, create default content
    if (!content) {
      content = await prisma.sectorsOverviewContent.create({
        data: {
          title: "Industries We Serve",
          subtitle: "Choose the Best Coatings Based on Your Application Needs",
          description: "At Alkalyne Surface Technologies, we understand that every industry has unique challenges, operational conditions, and performance demands. With decades of experience in advanced coating solutions, we've developed high-quality, industry-specific treatments that improve durability, performance, hygiene, aesthetics, and operational efficiency.",
          whyChooseTitle: "Why Choose Alkalyne?",
          whyChooseDescription: "At Alkalyne, we bring decades of hands-on expertise in the coatings industry, offering custom-engineered surface treatments designed to meet the unique needs of each sector. Our mission is to optimize your production performance, extend the lifespan of your equipment, and reduce maintenance and downtime—all with high-quality, industry-specific coating solutions.",
          whyChooseFeatures: JSON.stringify([
            "Industry-specific coating solutions",
            "Customised surface treatments based on usage and environment",
            "High-volume processing with consistency and quality",
            "Trusted partner to aerospace, food, automotive, and more",
            "In-house R&D and application expertise",
            "Efficiency-focused partnership approach"
          ]),
          ctaText: "Get Free Consultation",
          ctaLink: "/contact",
          isActive: true
        }
      })
    }

    // Parse JSON strings back to arrays
    const parsedContent = {
      ...content,
      whyChooseFeatures: JSON.parse(content.whyChooseFeatures || '[]')
    }

    return NextResponse.json(parsedContent)
  } catch (error) {
    console.error('Error fetching sectors overview content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sectors overview content' },
      { status: 500 }
    )
  }
}

// POST/UPDATE sectors overview content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, 
      subtitle, 
      description, 
      whyChooseTitle, 
      whyChooseDescription, 
      whyChooseFeatures, 
      ctaText, 
      ctaLink 
    } = body

    // Validate required fields
    if (!title || !subtitle || !description || !whyChooseTitle || !whyChooseDescription) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if content exists
    let existingContent = await prisma.sectorsOverviewContent.findFirst({
      where: {
        isActive: true
      }
    })

    let content
    if (existingContent) {
      // Update existing content
      content = await prisma.sectorsOverviewContent.update({
        where: {
          id: existingContent.id
        },
        data: {
          title,
          subtitle,
          description,
          whyChooseTitle,
          whyChooseDescription,
          whyChooseFeatures: JSON.stringify(whyChooseFeatures || []),
          ctaText: ctaText || "Get Free Consultation",
          ctaLink: ctaLink || "/contact"
        }
      })
    } else {
      // Create new content
      content = await prisma.sectorsOverviewContent.create({
        data: {
          title,
          subtitle,
          description,
          whyChooseTitle,
          whyChooseDescription,
          whyChooseFeatures: JSON.stringify(whyChooseFeatures || []),
          ctaText: ctaText || "Get Free Consultation",
          ctaLink: ctaLink || "/contact",
          isActive: true
        }
      })
    }

    return NextResponse.json(content, { status: 200 })
  } catch (error) {
    console.error('Error updating sectors overview content:', error)
    return NextResponse.json(
      { error: 'Failed to update sectors overview content' },
      { status: 500 }
    )
  }
} 
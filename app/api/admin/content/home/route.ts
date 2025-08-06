import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Fetch home content from database
    const homeContent = await prisma.page.findUnique({
      where: { slug: 'home' },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            images: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    })

    if (!homeContent) {
      // Return default content if none exists
      return NextResponse.json({
        heroTitle: 'Welcome to Our Company',
        heroSubtitle: 'Leading the way in innovation',
        heroDescription: 'We are dedicated to providing the best solutions for our clients.',
        heroImage: '',
        features: [
          {
            id: '1',
            title: 'Quality Service',
            description: 'We provide high-quality services to all our clients.',
            icon: 'fas fa-star'
          },
          {
            id: '2',
            title: 'Innovation',
            description: 'Constantly innovating to meet changing needs.',
            icon: 'fas fa-lightbulb'
          },
          {
            id: '3',
            title: 'Reliability',
            description: 'You can count on us to deliver on our promises.',
            icon: 'fas fa-shield-alt'
          }
        ]
      })
    }

    // Transform database data to frontend format
    const heroSection = homeContent.sections.find(s => s.type === 'HERO')
    const featuresSection = homeContent.sections.find(s => s.type === 'CONTENT')

    const content = {
      heroTitle: heroSection?.title || 'Welcome to Our Company',
      heroSubtitle: heroSection?.content?.split('\n')[0] || 'Leading the way in innovation',
      heroDescription: heroSection?.content || 'We are dedicated to providing the best solutions for our clients.',
      heroImage: heroSection?.images[0]?.path || '',
      features: featuresSection ? [
        {
          id: '1',
          title: 'Quality Service',
          description: 'We provide high-quality services to all our clients.',
          icon: 'fas fa-star'
        },
        {
          id: '2',
          title: 'Innovation',
          description: 'Constantly innovating to meet changing needs.',
          icon: 'fas fa-lightbulb'
        },
        {
          id: '3',
          title: 'Reliability',
          description: 'You can count on us to deliver on our promises.',
          icon: 'fas fa-shield-alt'
        }
      ] : []
    }

    return NextResponse.json(content)
  } catch (error) {
    logger.error('Error fetching home content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch home content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const content = await request.json()

    // Save home content to database
    let page = await prisma.page.findUnique({
      where: { slug: 'home' },
    })

    if (!page) {
      page = await prisma.page.create({
        data: {
          title: 'Home',
          slug: 'home',
          content: content.heroDescription,
          isPublished: true,
        },
      })
    }

    // Update or create hero section
    let heroSection = await prisma.section.findFirst({
      where: {
        pageId: page.id,
        type: 'HERO',
      },
    })

    if (!heroSection) {
      heroSection = await prisma.section.create({
        data: {
          pageId: page.id,
          title: content.heroTitle,
          content: `${content.heroSubtitle}\n${content.heroDescription}`,
          type: 'HERO',
          order: 1,
        },
      })
    } else {
      await prisma.section.update({
        where: { id: heroSection.id },
        data: {
          title: content.heroTitle,
          content: `${content.heroSubtitle}\n${content.heroDescription}`,
        },
      })
    }

    // Handle hero image
    if (content.heroImage) {
      const existingImage = await prisma.image.findFirst({
        where: { sectionId: heroSection.id },
      })

      if (existingImage) {
        await prisma.image.update({
          where: { id: existingImage.id },
          data: { path: content.heroImage },
        })
      } else {
        await prisma.image.create({
          data: {
            sectionId: heroSection.id,
            filename: content.heroImage.split('/').pop() || 'hero.jpg',
            originalName: 'hero.jpg',
            path: content.heroImage,
            order: 1,
          },
        })
      }
    }

    return NextResponse.json({ message: 'Home content saved successfully' })
  } catch (error) {
    logger.error('Error saving home content:', error)
    return NextResponse.json(
      { error: 'Failed to save home content' },
      { status: 500 }
    )
  }
} 
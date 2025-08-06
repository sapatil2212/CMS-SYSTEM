import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Fetch about content from database
    const aboutContent = await prisma.page.findUnique({
      where: { slug: 'about' },
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

    if (!aboutContent) {
      // Return default content if none exists
      return NextResponse.json({
        title: 'About Our Company',
        subtitle: 'Leading the way in innovation',
        description: 'We are a leading technology company dedicated to providing innovative solutions for businesses worldwide.',
        mission: 'To empower businesses with cutting-edge technology solutions that drive growth, efficiency, and innovation.',
        vision: 'To be the most trusted technology partner for businesses worldwide, known for delivering exceptional value and innovative solutions.',
        values: [
          {
            id: '1',
            title: 'Excellence',
            description: 'We strive for excellence in everything we do.',
            icon: 'fas fa-star'
          },
          {
            id: '2',
            title: 'Innovation',
            description: 'We embrace innovation and continuously explore new technologies.',
            icon: 'fas fa-lightbulb'
          },
          {
            id: '3',
            title: 'Collaboration',
            description: 'We believe in the power of collaboration and work closely with our clients.',
            icon: 'fas fa-users'
          }
        ],
        image: ''
      })
    }

    // Transform database data to frontend format
    const aboutSection = aboutContent.sections.find(s => s.type === 'ABOUT')
    const valuesSection = aboutContent.sections.find(s => s.type === 'CONTENT')

    const content = {
      title: aboutSection?.title || 'About Our Company',
      subtitle: aboutSection?.content?.split('\n')[0] || 'Leading the way in innovation',
      description: aboutSection?.content || 'We are a leading technology company dedicated to providing innovative solutions for businesses worldwide.',
      mission: valuesSection?.content?.split('\n')[0] || 'To empower businesses with cutting-edge technology solutions.',
      vision: valuesSection?.content?.split('\n')[1] || 'To be the most trusted technology partner for businesses worldwide.',
      values: [
        {
          id: '1',
          title: 'Excellence',
          description: 'We strive for excellence in everything we do.',
          icon: 'fas fa-star'
        },
        {
          id: '2',
          title: 'Innovation',
          description: 'We embrace innovation and continuously explore new technologies.',
          icon: 'fas fa-lightbulb'
        },
        {
          id: '3',
          title: 'Collaboration',
          description: 'We believe in the power of collaboration and work closely with our clients.',
          icon: 'fas fa-users'
        }
      ],
      image: aboutSection?.images[0]?.path || ''
    }

    return NextResponse.json(content)
  } catch (error) {
    logger.error('Error fetching about content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const content = await request.json()

    // Save about content to database
    let page = await prisma.page.findUnique({
      where: { slug: 'about' },
    })

    if (!page) {
      page = await prisma.page.create({
        data: {
          title: 'About Us',
          slug: 'about',
          content: content.description,
          isPublished: true,
        },
      })
    }

    // Update or create about section
    let aboutSection = await prisma.section.findFirst({
      where: {
        pageId: page.id,
        type: 'ABOUT',
      },
    })

    if (!aboutSection) {
      aboutSection = await prisma.section.create({
        data: {
          pageId: page.id,
          title: content.title,
          content: `${content.subtitle}\n${content.description}`,
          type: 'ABOUT',
          order: 1,
        },
      })
    } else {
      await prisma.section.update({
        where: { id: aboutSection.id },
        data: {
          title: content.title,
          content: `${content.subtitle}\n${content.description}`,
        },
      })
    }

    // Handle about image
    if (content.image) {
      const existingImage = await prisma.image.findFirst({
        where: { sectionId: aboutSection.id },
      })

      if (existingImage) {
        await prisma.image.update({
          where: { id: existingImage.id },
          data: { path: content.image },
        })
      } else {
        await prisma.image.create({
          data: {
            sectionId: aboutSection.id,
            filename: content.image.split('/').pop() || 'about.jpg',
            originalName: 'about.jpg',
            path: content.image,
            order: 1,
          },
        })
      }
    }

    // Create or update values section
    let valuesSection = await prisma.section.findFirst({
      where: {
        pageId: page.id,
        type: 'CONTENT',
      },
    })

    if (!valuesSection) {
      await prisma.section.create({
        data: {
          pageId: page.id,
          title: 'Company Values',
          content: `${content.mission}\n${content.vision}`,
          type: 'CONTENT',
          order: 2,
        },
      })
    } else {
      await prisma.section.update({
        where: { id: valuesSection.id },
        data: {
          content: `${content.mission}\n${content.vision}`,
        },
      })
    }

    return NextResponse.json({ message: 'About content saved successfully' })
  } catch (error) {
    logger.error('Error saving about content:', error)
    return NextResponse.json(
      { error: 'Failed to save about content' },
      { status: 500 }
    )
  }
} 
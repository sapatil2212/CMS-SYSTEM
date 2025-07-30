import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'about' },
      include: {
        sections: {
          where: { type: 'ABOUT' },
          orderBy: { order: 'asc' },
          include: {
            images: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    })

    if (!page) {
      return NextResponse.json({
        title: 'About Our Company',
        content: 'We are a leading technology company dedicated to providing innovative solutions for businesses worldwide.',
      })
    }

    const section = page.sections[0]
    const content = {
      title: section?.title || 'About Our Company',
      content: section?.content || 'We are a leading technology company dedicated to providing innovative solutions for businesses worldwide.',
      image: section?.images[0]?.path || null,
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching about content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    )
  }
} 
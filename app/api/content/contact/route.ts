import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'contact' },
      include: {
        sections: {
          where: { type: 'CONTACT' },
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!page) {
      return NextResponse.json({
        title: 'Get In Touch',
        description: 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
        email: 'contact@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Business Street, City, State 12345',
      })
    }

    const section = page.sections[0]
    const content = {
      title: section?.title || 'Get In Touch',
      description: section?.content || 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
      email: 'contact@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business Street, City, State 12345',
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching contact content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact content' },
      { status: 500 }
    )
  }
} 
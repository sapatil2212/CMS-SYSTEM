import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Get only active base metals from the database
    const activeBaseMetals = await prisma.baseMetalSettings.findMany({
      where: {
        isActive: true
      },
      select: {
        slug: true,
        name: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Transform the data to include href
    const baseMetalsWithHref = activeBaseMetals.map(metal => ({
      slug: metal.slug,
      name: metal.name,
      href: `/basemetals/${metal.slug}`,
      isActive: true
    }))

    return NextResponse.json(baseMetalsWithHref)
  } catch (error) {
    console.error('Error fetching active base metals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
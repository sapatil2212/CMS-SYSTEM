import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get the first header settings record (we'll only have one)
    let headerSettings = await prisma.headerSettings.findFirst()

    // If no settings exist, create default ones
    if (!headerSettings) {
      headerSettings = await prisma.headerSettings.create({
        data: {
          logoUrl: '/logo/logo.svg', // Default logo path
          logoAlt: 'CMS System Logo',
          phoneNumber: '+91 93731 02887',
          email: 'info@example.com'
        }
      })
    }

    return NextResponse.json(headerSettings)
  } catch (error) {
    console.error('Error fetching header settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch header settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { logoUrl, logoAlt, phoneNumber, email } = body

    // Get the first header settings record
    let headerSettings = await prisma.headerSettings.findFirst()

    if (headerSettings) {
      // Update existing settings
      headerSettings = await prisma.headerSettings.update({
        where: { id: headerSettings.id },
        data: {
          logoUrl: logoUrl || headerSettings.logoUrl,
          logoAlt: logoAlt || headerSettings.logoAlt,
          phoneNumber: phoneNumber || headerSettings.phoneNumber,
          email: email || headerSettings.email
        }
      })
    } else {
      // Create new settings
      headerSettings = await prisma.headerSettings.create({
        data: {
          logoUrl: logoUrl || '/logo/logo.svg',
          logoAlt: logoAlt || 'CMS System Logo',
          phoneNumber: phoneNumber || '+91 93731 02887',
          email: email || 'info@example.com'
        }
      })
    }

    return NextResponse.json(headerSettings)
  } catch (error) {
    console.error('Error updating header settings:', error)
    return NextResponse.json(
      { error: 'Failed to update header settings' },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Add OPTIONS method for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function GET() {
  try {
    const footerSettings = await prisma.footerSettings.findFirst()
    
    if (!footerSettings) {
      // Create default footer settings if none exist
      const defaultSettings = await prisma.footerSettings.create({
        data: {
          logoUrl: '/logo/logo.png',
          logoAlt: 'Alkalyne Logo',
          description: 'Precision busbar plating solutions for power distribution, EVs, and industrial applications. Enhancing performance and durability through advanced metal finishing.',
          phoneNumber: '+91 93731 02887',
          email: 'asgoals0494@gmail.com',
          address: 'Industrial Area\nNashik, Maharashtra\n422101'
        }
      })
      return NextResponse.json(defaultSettings)
    }
    
    return NextResponse.json(footerSettings)
  } catch (error) {
    console.error('Error fetching footer settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch footer settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('Footer settings PUT request received')
    const body = await request.json()
    const { logoUrl, logoAlt, description, phoneNumber, email, address } = body

    console.log('Updating footer settings with:', { logoUrl, logoAlt, description, phoneNumber, email, address })

    const footerSettings = await prisma.footerSettings.findFirst()
    
    if (footerSettings) {
      const updatedSettings = await prisma.footerSettings.update({
        where: { id: footerSettings.id },
        data: {
          logoUrl,
          logoAlt,
          description,
          phoneNumber,
          email,
          address
        }
      })
      console.log('Footer settings updated successfully:', updatedSettings)
      return NextResponse.json(updatedSettings)
    } else {
      const newSettings = await prisma.footerSettings.create({
        data: {
          logoUrl,
          logoAlt,
          description,
          phoneNumber,
          email,
          address
        }
      })
      console.log('New footer settings created:', newSettings)
      return NextResponse.json(newSettings)
    }
  } catch (error) {
    console.error('Error updating footer settings:', error)
    return NextResponse.json(
      { error: 'Failed to update footer settings' },
      { status: 500 }
    )
  }
}

// Add POST method as fallback for debugging
export async function POST(request: NextRequest) {
  try {
    console.log('Footer settings POST request received (fallback)')
    const body = await request.json()
    const { logoUrl, logoAlt, description, phoneNumber, email, address } = body

    console.log('Updating footer settings with:', { logoUrl, logoAlt, description, phoneNumber, email, address })

    const footerSettings = await prisma.footerSettings.findFirst()
    
    if (footerSettings) {
      const updatedSettings = await prisma.footerSettings.update({
        where: { id: footerSettings.id },
        data: {
          logoUrl,
          logoAlt,
          description,
          phoneNumber,
          email,
          address
        }
      })
      console.log('Footer settings updated successfully:', updatedSettings)
      return NextResponse.json(updatedSettings)
    } else {
      const newSettings = await prisma.footerSettings.create({
        data: {
          logoUrl,
          logoAlt,
          description,
          phoneNumber,
          email,
          address
        }
      })
      console.log('New footer settings created:', newSettings)
      return NextResponse.json(newSettings)
    }
  } catch (error) {
    console.error('Error updating footer settings:', error)
    return NextResponse.json(
      { error: 'Failed to update footer settings' },
      { status: 500 }
    )
  }
} 
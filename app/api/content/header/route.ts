import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('Header GET request received')
    
    // Get the first header settings record (we'll only have one)
    let headerSettings = await prisma.headerSettings.findFirst()
    console.log('Found header settings:', headerSettings)

    // If no settings exist, create default ones
    if (!headerSettings) {
      console.log('No header settings found, creating default settings')
      headerSettings = await prisma.headerSettings.create({
        data: {
          logoUrl: '/logo/logo.svg', // Default logo path
          logoAlt: 'CMS System Logo',
          phoneNumber: '+91 93731 02887',
          email: 'info@example.com'
        }
      })
      console.log('Created default header settings:', headerSettings)
    }

    return NextResponse.json(headerSettings)
  } catch (error) {
    console.error('Error fetching header settings:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch header settings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('Header PUT request received')
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { logoUrl, logoAlt, phoneNumber, email } = body

    // Validate required fields
    if (!logoUrl && !logoAlt && !phoneNumber && !email) {
      return NextResponse.json(
        { error: 'At least one field must be provided' },
        { status: 400 }
      )
    }

    // Get the first header settings record
    let headerSettings = await prisma.headerSettings.findFirst()
    console.log('Existing header settings:', headerSettings)

    if (headerSettings) {
      // Update existing settings
      const updateData: any = {}
      if (logoUrl !== undefined) updateData.logoUrl = logoUrl
      if (logoAlt !== undefined) updateData.logoAlt = logoAlt
      if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber
      if (email !== undefined) updateData.email = email

      console.log('Updating with data:', updateData)
      
      headerSettings = await prisma.headerSettings.update({
        where: { id: headerSettings.id },
        data: updateData
      })
    } else {
      // Create new settings
      const createData = {
        logoUrl: logoUrl || '/logo/logo.svg',
        logoAlt: logoAlt || 'CMS System Logo',
        phoneNumber: phoneNumber || '+91 93731 02887',
        email: email || 'info@example.com'
      }
      
      console.log('Creating new settings with data:', createData)
      
      headerSettings = await prisma.headerSettings.create({
        data: createData
      })
    }

    console.log('Successfully updated header settings:', headerSettings)
    return NextResponse.json(headerSettings)
  } catch (error) {
    console.error('Error updating header settings:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update header settings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 
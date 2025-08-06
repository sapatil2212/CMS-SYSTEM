import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';



export async function GET() {
  try {
    const homeAbout = await prisma.homeAbout.findFirst()
    
    if (!homeAbout) {
      // Return default content if no data exists
      return NextResponse.json({
        title: 'What Alkalyne Surface Technologies Can Do for You',
        description: 'Alkalyne is your trusted partner for high-performance metal plating, surface coating, and advanced finishing solutions. Every process is executed by certified professionals with years of experience, ensuring compliance with the highest industry standards — from aerospace and automotive to defense and electronics.',
        image: ''
      })
    }

    return NextResponse.json(homeAbout)
  } catch (error) {
    logger.error('Error fetching home about data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch home about data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, image } = body

    // Check if record exists
    const existingRecord = await prisma.homeAbout.findFirst()

    let result
    if (existingRecord) {
      // Update existing record
      result = await prisma.homeAbout.update({
        where: { id: existingRecord.id },
        data: {
          title,
          description,
          image
        }
      })
    } else {
      // Create new record
      result = await prisma.homeAbout.create({
        data: {
          title,
          description,
          image
        }
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    logger.error('Error saving home about data:', error)
    return NextResponse.json(
      { error: 'Failed to save home about data' },
      { status: 500 }
    )
  }
} 
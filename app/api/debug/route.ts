import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    console.log('Debug API: Starting database connection test...')
    
    // Test database connection
    await prisma.$connect()
    console.log('Debug API: Database connected successfully')
    
    // Test a simple query that should work (hero slider)
    const heroSlides = await prisma.heroSlider.findMany()
    console.log('Debug API: Hero slides query successful:', heroSlides.length)
    
    // Test if process models exist
    let processModelsStatus = {}
    try {
      const copperContent = await prisma.copperPlatingContent.findFirst()
      processModelsStatus.copperPlatingContent = 'accessible'
    } catch (error) {
      processModelsStatus.copperPlatingContent = `error: ${error.message}`
    }
    
    try {
      const silverContent = await prisma.silverPlatingContent.findFirst()
      processModelsStatus.silverPlatingContent = 'accessible'
    } catch (error) {
      processModelsStatus.silverPlatingContent = `error: ${error.message}`
    }
    
    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        heroSlidesCount: heroSlides.length
      },
      processModels: processModelsStatus,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? `set (${process.env.DATABASE_URL.substring(0, 30)}...)` : 'missing',
        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'missing',
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'set' : 'missing',
        CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'set' : 'missing',
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'missing'
      },
      prismaVersion: '5.x',
      nodeVersion: process.version
    })
  } catch (error) {
    console.error('Debug API Error:', error)
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        name: error.name,
        code: error.code || 'unknown',
        stack: error.stack?.split('\n').slice(0, 5) // First 5 lines only
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'missing',
        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'missing'
      }
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
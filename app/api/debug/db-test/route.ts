import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Helper function to safely get error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

export async function GET() {
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('Database connected successfully')
    
    // Test if critical tables exist
    const tests = []
    
    try {
      const userCount = await prisma.user.count()
      tests.push({ table: 'User', count: userCount, status: 'OK' })
    } catch (error) {
      tests.push({ table: 'User', error: getErrorMessage(error), status: 'ERROR' })
    }
    
    try {
      const aboutContentCount = await prisma.aboutContent.count()
      tests.push({ table: 'AboutContent', count: aboutContentCount, status: 'OK' })
    } catch (error) {
      tests.push({ table: 'AboutContent', error: getErrorMessage(error), status: 'ERROR' })
    }
    
    try {
      const aboutValueCount = await prisma.aboutValue.count()
      tests.push({ table: 'AboutValue', count: aboutValueCount, status: 'OK' })
    } catch (error) {
      tests.push({ table: 'AboutValue', error: getErrorMessage(error), status: 'ERROR' })
    }
    
    try {
      const copperCount = await prisma.copperPlatingContent.count()
      tests.push({ table: 'CopperPlatingContent', count: copperCount, status: 'OK' })
    } catch (error) {
      tests.push({ table: 'CopperPlatingContent', error: getErrorMessage(error), status: 'ERROR' })
    }
    
    try {
      const zincCount = await prisma.zincPlatingContent.count()
      tests.push({ table: 'ZincPlatingContent', count: zincCount, status: 'OK' })
    } catch (error) {
      tests.push({ table: 'ZincPlatingContent', error: getErrorMessage(error), status: 'ERROR' })
    }
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      status: 'success',
      message: 'Database diagnostic complete',
      tests,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
      environment: process.env.NODE_ENV
    })
    
  } catch (error) {
    console.error('Database test failed:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Database test failed',
      error: getErrorMessage(error),
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    }, { status: 500 })
  }
}
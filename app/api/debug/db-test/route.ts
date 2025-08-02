import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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
      tests.push({ table: 'User', error: error.message, status: 'ERROR' })
    }
    
    try {
      const aboutContentCount = await prisma.aboutContent.count()
      tests.push({ table: 'AboutContent', count: aboutContentCount, status: 'OK' })
    } catch (error) {
      tests.push({ table: 'AboutContent', error: error.message, status: 'ERROR' })
    }
    
    try {
      const aboutValueCount = await prisma.aboutValue.count()
      tests.push({ table: 'AboutValue', count: aboutValueCount, status: 'OK' })
    } catch (error) {
      tests.push({ table: 'AboutValue', error: error.message, status: 'ERROR' })
    }
    
    try {
      const copperCount = await prisma.copperPlatingContent.count()
      tests.push({ table: 'CopperPlatingContent', count: copperCount, status: 'OK' })
    } catch (error) {
      tests.push({ table: 'CopperPlatingContent', error: error.message, status: 'ERROR' })
    }
    
    try {
      const zincCount = await prisma.zincPlatingContent.count()
      tests.push({ table: 'ZincPlatingContent', count: zincCount, status: 'OK' })
    } catch (error) {
      tests.push({ table: 'ZincPlatingContent', error: error.message, status: 'ERROR' })
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
      error: error.message,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    }, { status: 500 })
  }
}
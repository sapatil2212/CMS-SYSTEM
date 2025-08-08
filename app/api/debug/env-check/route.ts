import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    // Check critical environment variables
    const envCheck = {
      // Database
      DATABASE_URL: {
        exists: !!process.env.DATABASE_URL,
        length: process.env.DATABASE_URL?.length || 0,
        isLocalhost: process.env.DATABASE_URL?.includes('localhost') || false
      },
      
      // JWT Authentication
      JWT_SECRET: {
        exists: !!process.env.JWT_SECRET,
        length: process.env.JWT_SECRET?.length || 0,
        isStrong: (process.env.JWT_SECRET?.length || 0) >= 32
      },
      
      // Cloudinary Configuration
      CLOUDINARY_CLOUD_NAME: {
        exists: !!process.env.CLOUDINARY_CLOUD_NAME,
        value: process.env.CLOUDINARY_CLOUD_NAME ? '***' : null
      },
      CLOUDINARY_API_KEY: {
        exists: !!process.env.CLOUDINARY_API_KEY,
        length: process.env.CLOUDINARY_API_KEY?.length || 0
      },
      CLOUDINARY_API_SECRET: {
        exists: !!process.env.CLOUDINARY_API_SECRET,
        length: process.env.CLOUDINARY_API_SECRET?.length || 0
      },
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: {
        exists: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        value: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '***' : null
      },
      
      // Email Configuration
      EMAIL_HOST: {
        exists: !!process.env.EMAIL_HOST,
        value: process.env.EMAIL_HOST
      },
      EMAIL_USERNAME: {
        exists: !!process.env.EMAIL_USERNAME,
        value: process.env.EMAIL_USERNAME ? '***' : null
      },
      
      // Environment
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.VERCEL_URL
    }

    // Check for critical issues
    const issues = []
    
    if (!process.env.DATABASE_URL) {
      issues.push('DATABASE_URL is missing')
    } else if (process.env.DATABASE_URL.includes('localhost')) {
      issues.push('DATABASE_URL points to localhost (should be production database)')
    }
    
    if (!process.env.JWT_SECRET) {
      issues.push('JWT_SECRET is missing')
    } else if ((process.env.JWT_SECRET?.length || 0) < 32) {
      issues.push('JWT_SECRET is too short (should be at least 32 characters)')
    }
    
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      issues.push('Cloudinary credentials are missing')
    }

    const response = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercelEnvironment: process.env.VERCEL_ENV,
      environmentVariables: envCheck,
      issues,
      criticalIssues: issues.length > 0,
      recommendations: issues.length > 0 ? [
        'Add missing environment variables to Vercel dashboard',
        'Ensure DATABASE_URL points to production database (not localhost)',
        'Set a strong JWT_SECRET (at least 32 characters)',
        'Configure all Cloudinary credentials for file uploads'
      ] : ['Environment variables look good!']
    }

    logger.log('Environment check completed:', response)
    
    return NextResponse.json(response)
  } catch (error) {
    logger.error('Environment check failed:', error)
    return NextResponse.json(
      { 
        error: 'Failed to check environment variables',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

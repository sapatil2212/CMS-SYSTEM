import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 
        `set (${process.env.DATABASE_URL.substring(0, 50)}...)` : 'missing',
      DATABASE_URL_FULL: process.env.DATABASE_URL || 'NOT_SET',
      JWT_SECRET: process.env.JWT_SECRET ? 'set' : 'missing',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'missing',
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'missing',
      EMAIL_USERNAME: process.env.EMAIL_USERNAME || 'missing',
      MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 'missing'
    },
    deployment: {
      platform: 'vercel',
      url: process.env.VERCEL_URL || 'unknown'
    }
  })
} 
import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { logger } from '@/lib/logger';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'uploads', ...params.path)
    
    // Check if file exists
    try {
      await fs.access(filePath)
    } catch {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Read the file
    const fileBuffer = await fs.readFile(filePath)
    
    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase()
    let contentType = 'application/octet-stream'
    
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
    else if (ext === '.png') contentType = 'image/png'
    else if (ext === '.gif') contentType = 'image/gif'
    else if (ext === '.webp') contentType = 'image/webp'
    else if (ext === '.svg') contentType = 'image/svg+xml'

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    logger.error('Error serving file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(buffer, 'sectors')

    if (!cloudinaryUrl) {
      return NextResponse.json(
        { error: 'Failed to upload to cloud storage' },
        { status: 500 }
      )
    }

    logger.log('File uploaded successfully:', {
      filename: file.name,
      size: file.size,
      type: file.type,
      url: cloudinaryUrl
    })

    return NextResponse.json({
      success: true,
      url: cloudinaryUrl,
      filename: file.name
    })
  } catch (error) {
    logger.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
} 
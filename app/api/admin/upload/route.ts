import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger';
import {  uploadToCloudinary  } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(buffer, 'cms-uploads')

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

    const responseData = {
      url: cloudinaryUrl,
      filename: file.name,
      originalName: file.name,
      size: file.size,
      type: file.type
    }

    logger.log('Returning upload response:', responseData)

    return NextResponse.json(responseData)
  } catch (error) {
    logger.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
} 
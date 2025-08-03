import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    console.log('Upload request received')
    const formData = await request.formData()
    const file = formData.get('image') as File

    console.log('File details:', {
      name: file?.name,
      size: file?.size,
      type: file?.type
    })

    if (!file) {
      console.error('No file provided in upload request')
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
    console.log('Uploading to Cloudinary...')
    const cloudinaryUrl = await uploadToCloudinary(buffer, 'cms-uploads')

    if (!cloudinaryUrl) {
      console.error('Cloudinary upload failed - no URL returned')
      return NextResponse.json(
        { error: 'Failed to upload to cloud storage' },
        { status: 500 }
      )
    }

    console.log('File uploaded successfully:', {
      filename: file.name,
      size: file.size,
      type: file.type,
      url: cloudinaryUrl
    })

    return NextResponse.json({
      url: cloudinaryUrl,
      filename: file.name,
      originalName: file.name,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
} 
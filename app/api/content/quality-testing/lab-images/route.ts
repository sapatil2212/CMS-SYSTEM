import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';;

export async function GET() {
  try {
    const labImages = await prisma.qualityTestingLabImage.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(labImages);
  } catch (error) {
    logger.error('Error fetching lab images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lab images' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const content = await prisma.qualityTestingContent.findFirst();
    if (!content) {
      return NextResponse.json(
        { error: 'Quality testing content not found' },
        { status: 404 }
      );
    }

    // Check if the request is multipart/form-data (file upload)
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload - only image file is required
      const formData = await request.formData();
      const imageFile = formData.get('image') as File;

      if (!imageFile) {
        return NextResponse.json(
          { error: 'Image file is required' },
          { status: 400 }
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `lab-image-${timestamp}.${fileExtension}`;
      
      // Save file to public/uploads directory
      const uploadDir = './public/uploads';
      const fs = require('fs');
      const path = require('path');
      
      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      fs.writeFileSync(filePath, buffer);
      
      const imagePath = `/uploads/${fileName}`;

      const labImage = await prisma.qualityTestingLabImage.create({
        data: {
          contentId: content.id,
          title: '', // Default empty title
          description: '', // Default empty description
          imagePath,
          order: 0, // Default order
          isActive: true // Default active
        }
      });

      return NextResponse.json(labImage);
    } else {
      // Handle regular JSON request (fallback)
      const body = await request.json();
      const { imagePath } = body;

      const labImage = await prisma.qualityTestingLabImage.create({
        data: {
          contentId: content.id,
          title: '', // Default empty title
          description: '', // Default empty description
          imagePath: imagePath || '',
          order: 0, // Default order
          isActive: true // Default active
        }
      });

      return NextResponse.json(labImage);
    }
  } catch (error) {
    logger.error('Error creating lab image:', error);
    return NextResponse.json(
      { error: 'Failed to create lab image' },
      { status: 500 }
    );
  }
} 
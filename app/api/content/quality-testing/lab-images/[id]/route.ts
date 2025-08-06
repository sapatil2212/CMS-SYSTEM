import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';;

// GET - Fetch a single lab image by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const labImage = await prisma.qualityTestingLabImage.findUnique({
      where: { id: params.id },
    });

    if (!labImage) {
      return NextResponse.json(
        { error: 'Lab image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(labImage);
  } catch (error) {
    logger.error('Error fetching lab image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lab image' },
      { status: 500 }
    );
  }
}

// PUT - Update a lab image
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, imagePath, order, isActive } = body;

    const updatedLabImage = await prisma.qualityTestingLabImage.update({
      where: { id: params.id },
      data: {
        title,
        description,
        imagePath,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(updatedLabImage);
  } catch (error) {
    logger.error('Error updating lab image:', error);
    return NextResponse.json(
      { error: 'Failed to update lab image' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a lab image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.qualityTestingLabImage.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Lab image deleted successfully' });
  } catch (error) {
    logger.error('Error deleting lab image:', error);
    return NextResponse.json(
      { error: 'Failed to delete lab image' },
      { status: 500 }
    );
  }
} 
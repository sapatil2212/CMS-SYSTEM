import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';;

// GET - Fetch a single standard by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const standard = await prisma.qualityTestingStandard.findUnique({
      where: { id: params.id },
    });

    if (!standard) {
      return NextResponse.json(
        { error: 'Standard not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(standard);
  } catch (error) {
    logger.error('Error fetching standard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch standard' },
      { status: 500 }
    );
  }
}

// PUT - Update a standard
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, category, order, isActive } = body;

    const updatedStandard = await prisma.qualityTestingStandard.update({
      where: { id: params.id },
      data: {
        name,
        description,
        category,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(updatedStandard);
  } catch (error) {
    logger.error('Error updating standard:', error);
    return NextResponse.json(
      { error: 'Failed to update standard' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a standard
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.qualityTestingStandard.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Standard deleted successfully' });
  } catch (error) {
    logger.error('Error deleting standard:', error);
    return NextResponse.json(
      { error: 'Failed to delete standard' },
      { status: 500 }
    );
  }
} 
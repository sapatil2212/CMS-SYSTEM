import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';;

// GET - Fetch a single industry by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const industry = await prisma.qualityTestingIndustry.findUnique({
      where: { id: params.id },
    });

    if (!industry) {
      return NextResponse.json(
        { error: 'Industry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(industry);
  } catch (error) {
    logger.error('Error fetching industry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch industry' },
      { status: 500 }
    );
  }
}

// PUT - Update an industry
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, icon, order, isActive } = body;

    const updatedIndustry = await prisma.qualityTestingIndustry.update({
      where: { id: params.id },
      data: {
        name,
        description,
        icon,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(updatedIndustry);
  } catch (error) {
    logger.error('Error updating industry:', error);
    return NextResponse.json(
      { error: 'Failed to update industry' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an industry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.qualityTestingIndustry.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Industry deleted successfully' });
  } catch (error) {
    logger.error('Error deleting industry:', error);
    return NextResponse.json(
      { error: 'Failed to delete industry' },
      { status: 500 }
    );
  }
} 
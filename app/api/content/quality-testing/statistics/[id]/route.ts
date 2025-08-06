import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';;

// GET - Fetch a single statistic by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const statistic = await prisma.qualityTestingStatistic.findUnique({
      where: { id: params.id },
    });

    if (!statistic) {
      return NextResponse.json(
        { error: 'Statistic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(statistic);
  } catch (error) {
    logger.error('Error fetching statistic:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistic' },
      { status: 500 }
    );
  }
}

// PUT - Update a statistic
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { number, label, icon, order, isActive } = body;

    const updatedStatistic = await prisma.qualityTestingStatistic.update({
      where: { id: params.id },
      data: {
        number,
        label,
        icon,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(updatedStatistic);
  } catch (error) {
    logger.error('Error updating statistic:', error);
    return NextResponse.json(
      { error: 'Failed to update statistic' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a statistic
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.qualityTestingStatistic.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Statistic deleted successfully' });
  } catch (error) {
    logger.error('Error deleting statistic:', error);
    return NextResponse.json(
      { error: 'Failed to delete statistic' },
      { status: 500 }
    );
  }
} 
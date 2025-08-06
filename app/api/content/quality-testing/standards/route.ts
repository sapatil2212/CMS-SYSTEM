import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';;

export async function GET() {
  try {
    const standards = await prisma.qualityTestingStandard.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(standards);
  } catch (error) {
    logger.error('Error fetching standards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch standards' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, category, order } = body;

    const content = await prisma.qualityTestingContent.findFirst();
    if (!content) {
      return NextResponse.json(
        { error: 'Quality testing content not found' },
        { status: 404 }
      );
    }

    const standard = await prisma.qualityTestingStandard.create({
      data: {
        contentId: content.id,
        name: name || '',
        description: description || '',
        category: category || '',
        order: order || 0
      }
    });

    return NextResponse.json(standard);
  } catch (error) {
    logger.error('Error creating standard:', error);
    return NextResponse.json(
      { error: 'Failed to create standard' },
      { status: 500 }
    );
  }
} 
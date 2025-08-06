import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';;

export async function GET() {
  try {
    const capabilities = await prisma.qualityTestingCapability.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(capabilities);
  } catch (error) {
    logger.error('Error fetching capabilities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch capabilities' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, details, icon, order } = body;

    const content = await prisma.qualityTestingContent.findFirst();
    if (!content) {
      return NextResponse.json(
        { error: 'Quality testing content not found' },
        { status: 404 }
      );
    }

    const capability = await prisma.qualityTestingCapability.create({
      data: {
        contentId: content.id,
        title: title || '',
        description: description || '',
        details: details || '',
        icon: icon || '',
        order: order || 0
      }
    });

    return NextResponse.json(capability);
  } catch (error) {
    logger.error('Error creating capability:', error);
    return NextResponse.json(
      { error: 'Failed to create capability' },
      { status: 500 }
    );
  }
} 
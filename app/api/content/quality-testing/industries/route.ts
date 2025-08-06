import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';;

export async function GET() {
  try {
    const industries = await prisma.qualityTestingIndustry.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(industries);
  } catch (error) {
    logger.error('Error fetching industries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch industries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, icon, order } = body;

    const content = await prisma.qualityTestingContent.findFirst();
    if (!content) {
      return NextResponse.json(
        { error: 'Quality testing content not found' },
        { status: 404 }
      );
    }

    const industry = await prisma.qualityTestingIndustry.create({
      data: {
        contentId: content.id,
        name: name || '',
        description: description || '',
        icon: icon || '',
        order: order || 0
      }
    });

    return NextResponse.json(industry);
  } catch (error) {
    logger.error('Error creating industry:', error);
    return NextResponse.json(
      { error: 'Failed to create industry' },
      { status: 500 }
    );
  }
} 
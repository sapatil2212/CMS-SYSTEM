import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const statistics = await prisma.qualityTestingStatistic.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { number, label, icon, order } = body;

    const content = await prisma.qualityTestingContent.findFirst();
    if (!content) {
      return NextResponse.json(
        { error: 'Quality testing content not found' },
        { status: 404 }
      );
    }

    const statistic = await prisma.qualityTestingStatistic.create({
      data: {
        contentId: content.id,
        number: number || '',
        label: label || '',
        icon: icon || '',
        order: order || 0
      }
    });

    return NextResponse.json(statistic);
  } catch (error) {
    console.error('Error creating statistic:', error);
    return NextResponse.json(
      { error: 'Failed to create statistic' },
      { status: 500 }
    );
  }
} 
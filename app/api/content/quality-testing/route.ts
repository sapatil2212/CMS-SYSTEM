import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';;

export async function GET() {
  try {
    const content = await prisma.qualityTestingContent.findFirst({
      include: {
        capabilities: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        },
        standards: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        },
        statistics: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        },
        industries: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        },
        labImages: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!content) {
      // Create default content if none exists
      const defaultContent = await prisma.qualityTestingContent.create({
        data: {
          heroTitle: 'Quality Testing',
          heroSubtitle: 'Ensuring Excellence at Every Stage',
          heroDescription: 'At Alkalyne, quality is not just a checkpoint — it\'s the foundation of everything we do. Our rigorous quality testing protocols ensure that every component meets or exceeds the industry standards for performance, durability, and reliability.',
          commitmentTitle: 'Our Commitment to Quality',
          commitmentDescription: 'We follow stringent testing procedures across all stages — from raw material inspection to final component approval. Our goal is to ensure zero-defect delivery with measurable performance results.',
          capabilitiesTitle: 'Quality Testing Capabilities',
          capabilitiesDescription: 'Our comprehensive testing capabilities ensure every component meets the highest standards',
          statisticsTitle: 'Quality by the Numbers',
          statisticsDescription: 'Our commitment to excellence is reflected in our performance metrics',
          standardsTitle: 'Industry Standards We Follow',
          standardsDescription: 'Our testing procedures are aligned with globally recognized standards',
          labTitle: 'In-House Lab Facilities',
          labDescription: 'Alkalyne\'s in-house quality lab is equipped with modern instrumentation and operated by certified professionals who continuously monitor and calibrate equipment to maintain accuracy.',
          trustedTitle: 'Trusted by Industry Leaders',
          trustedDescription: 'From automotive and aerospace to electronics and medical equipment — our clients rely on our quality commitment for the most demanding applications.',
          ctaTitle: 'Precision. Performance. Proven Results.',
          ctaDescription: 'Let our testing standards be the reason behind your product reliability.'
        },
        include: {
          capabilities: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          },
          standards: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          },
          statistics: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          },
          industries: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          },
          labImages: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          }
        }
      });

      return NextResponse.json(defaultContent);
    }

    return NextResponse.json(content);
  } catch (error) {
    logger.error('Error fetching quality testing content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quality testing content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      heroTitle,
      heroSubtitle,
      heroDescription,
      commitmentTitle,
      commitmentDescription,
      capabilitiesTitle,
      capabilitiesDescription,
      statisticsTitle,
      statisticsDescription,
      standardsTitle,
      standardsDescription,
      labTitle,
      labDescription,
      trustedTitle,
      trustedDescription,
      ctaTitle,
      ctaDescription
    } = body;

    const content = await prisma.qualityTestingContent.upsert({
      where: { id: (await prisma.qualityTestingContent.findFirst())?.id || 'default' },
      update: {
        heroTitle,
        heroSubtitle,
        heroDescription,
        commitmentTitle,
        commitmentDescription,
        capabilitiesTitle,
        capabilitiesDescription,
        statisticsTitle,
        statisticsDescription,
        standardsTitle,
        standardsDescription,
        labTitle,
        labDescription,
        trustedTitle,
        trustedDescription,
        ctaTitle,
        ctaDescription
      },
      create: {
        heroTitle,
        heroSubtitle,
        heroDescription,
        commitmentTitle,
        commitmentDescription,
        capabilitiesTitle,
        capabilitiesDescription,
        statisticsTitle,
        statisticsDescription,
        standardsTitle,
        standardsDescription,
        labTitle,
        labDescription,
        trustedTitle,
        trustedDescription,
        ctaTitle,
        ctaDescription
      }
    });

    return NextResponse.json(content);
  } catch (error) {
    logger.error('Error updating quality testing content:', error);
    return NextResponse.json(
      { error: 'Failed to update quality testing content' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { mobile: { contains: search, mode: 'insensitive' } },
        { processType: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get submissions with pagination
    const submissions = await prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const total = await prisma.contactSubmission.count({ where });

    // Get status counts
    const statusCounts = await prisma.contactSubmission.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    return NextResponse.json({
      submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      statusCounts: statusCounts.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>)
    });
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact submissions' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    const updatedSubmission = await prisma.contactSubmission.update({
      where: { id },
      data: {
        status: status || undefined,
        notes: notes || undefined,
      }
    });

    return NextResponse.json({
      success: true,
      submission: updatedSubmission
    });
  } catch (error) {
    console.error('Error updating contact submission:', error);
    return NextResponse.json(
      { error: 'Failed to update contact submission' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    await prisma.contactSubmission.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Contact submission deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact submission' },
      { status: 500 }
    );
  }
} 
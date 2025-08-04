import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const capability = await prisma.qualityTestingCapability.findUnique({
      where: { id: params.id }
    });

    if (!capability) {
      return NextResponse.json(
        { error: 'Capability not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(capability);
  } catch (error) {
    console.error('Error fetching capability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch capability' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, details, icon, order, isActive } = body;

    const capability = await prisma.qualityTestingCapability.update({
      where: { id: params.id },
      data: {
        title,
        description,
        details,
        icon,
        order,
        isActive
      }
    });

    return NextResponse.json(capability);
  } catch (error) {
    console.error('Error updating capability:', error);
    return NextResponse.json(
      { error: 'Failed to update capability' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.qualityTestingCapability.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Capability deleted successfully' });
  } catch (error) {
    console.error('Error deleting capability:', error);
    return NextResponse.json(
      { error: 'Failed to delete capability' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch contact content
export async function GET() {
  try {
    const contactContent = await prisma.contactContent.findFirst({
      where: { isActive: true }
    });

    if (!contactContent) {
      // Return default content if none exists
      return NextResponse.json({
        id: null,
        title: "Contact Us",
        subtitle: "Get in touch with us",
        description: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
        phone: "+91 93731 02887",
        email: "asgoals0494@gmail.com",
        address: "123 Industrial Area, Nashik, Maharashtra - 422009",
        mapLink: "https://maps.app.goo.gl/example",
        image: "/uploads/9ea6ded4-4ad0-4ff5-9eb4-83c6cdbb593d.webp",
        isActive: true
      });
    }

    return NextResponse.json(contactContent);
  } catch (error) {
    console.error('Error fetching contact content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact content' },
      { status: 500 }
    );
  }
}

// POST - Create new contact content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, description, phone, email, address, mapLink, image } = body;

    // Validate required fields
    if (!title || !phone || !email || !address) {
      return NextResponse.json(
        { error: 'Title, phone, email, and address are required' },
        { status: 400 }
      );
    }

    // Deactivate existing content
    await prisma.contactContent.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });

    // Create new content
    const newContactContent = await prisma.contactContent.create({
      data: {
        title,
        subtitle,
        description,
        phone,
        email,
        address,
        mapLink,
        image,
        isActive: true
      }
    });

    return NextResponse.json(newContactContent);
  } catch (error) {
    console.error('Error creating contact content:', error);
    return NextResponse.json(
      { error: 'Failed to create contact content' },
      { status: 500 }
    );
  }
}

// PUT - Update contact content
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, subtitle, description, phone, email, address, mapLink, image } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Contact content ID is required' },
        { status: 400 }
      );
    }

    const updatedContactContent = await prisma.contactContent.update({
      where: { id },
      data: {
        title,
        subtitle,
        description,
        phone,
        email,
        address,
        mapLink,
        image
      }
    });

    return NextResponse.json(updatedContactContent);
  } catch (error) {
    console.error('Error updating contact content:', error);
    return NextResponse.json(
      { error: 'Failed to update contact content' },
      { status: 500 }
    );
  }
}

// DELETE - Delete contact content
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Contact content ID is required' },
        { status: 400 }
      );
    }

    await prisma.contactContent.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact content:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact content' },
      { status: 500 }
    );
  }
} 
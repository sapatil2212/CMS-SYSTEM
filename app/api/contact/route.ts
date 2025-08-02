import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET method to fetch contact information
export async function GET(request: NextRequest) {
  try {
    const contactContent = await prisma.contactContent.findFirst({
      where: { isActive: true }
    });

    if (!contactContent) {
      return NextResponse.json({
        address: 'Address not configured',
        email: 'Email not configured',
        phone: 'Phone not configured',
        workingHours: 'Working hours not configured'
      });
    }

    return NextResponse.json({
      address: contactContent.address || 'Address not configured',
      email: contactContent.email || 'Email not configured',
      phone: contactContent.phone || 'Phone not configured',
      workingHours: contactContent.workingHours || 'Working hours not configured'
    });
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact information' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Here you would typically send an email or save to database
    // For now, we'll just log the message
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    })

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send confirmation email to user

    return NextResponse.json({
      message: 'Message sent successfully',
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
} 
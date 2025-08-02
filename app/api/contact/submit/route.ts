import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendContactFormEmails } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, mobile, processType, message } = body;

    // Validate required fields
    if (!fullName || !email || !mobile || !processType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Store submission in database
    const submission = await prisma.contactSubmission.create({
      data: {
        fullName,
        email,
        mobile,
        processType,
        message: message || '',
      }
    });

    // Fetch contact content to get admin email
    let adminEmail = process.env.EMAIL_USERNAME || 'asgoals0494@gmail.com';
    try {
      const contactContent = await prisma.contactContent.findFirst({
        where: { isActive: true }
      });
      if (contactContent && contactContent.email) {
        adminEmail = contactContent.email;
      }
    } catch (error) {
      console.error('Error fetching contact content for admin email:', error);
    }

    // Fetch header settings for logo
    let logoUrl: string | undefined;
    let logoAlt: string | undefined;
    
    try {
      const headerSettings = await prisma.headerSettings.findFirst();
      if (headerSettings) {
        logoUrl = headerSettings.logoUrl || undefined;
        logoAlt = headerSettings.logoAlt || undefined;
      }
    } catch (error) {
      console.error('Error fetching header settings for logo:', error);
    }

    // Send emails
    const timestamp = new Date().toLocaleString();
    const emailData = {
      fullName,
      email,
      mobile,
      processType,
      message: message || '',
      timestamp,
      adminEmail,
      logoUrl,
      logoAlt
    };

    const emailResult = await sendContactFormEmails(emailData);

    return NextResponse.json({
      success: true,
      submission,
      emailSent: emailResult.success,
      message: 'Contact form submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
} 
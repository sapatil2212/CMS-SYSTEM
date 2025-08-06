import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger';
import nodemailer from 'nodemailer';

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME || process.env.EMAIL_USER || 'saptechnoeditors@gmail.com',
    pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS || ''
  }
})

// Verify email credentials are available
const hasEmailCredentials = (process.env.EMAIL_USERNAME || process.env.EMAIL_USER) && (process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS)

// POST - Generate and send OTP for profile update
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Remove any existing profile OTPs for this user
    await prisma.oTP.deleteMany({
      where: {
        userId,
        type: 'PROFILE_UPDATE'
      }
    })

    // Store OTP in database with type
    await prisma.oTP.create({
      data: {
        userId,
        otp,
        expiresAt,
        type: 'PROFILE_UPDATE'
      }
    })

    // Email template for profile update
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Profile Update Verification</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 450px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 20px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 10px;
          }
          .otp-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
          }
          .otp-code {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 4px;
            margin: 10px 0;
          }
          .info {
            background-color: #e3f2fd;
            border: 1px solid #bbdefb;
            color: #1565c0;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
          }
          .contact-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="color: #1976d2; margin: 0;">Profile Update Verification</h2>
          </div>
          
          <p>Dear <strong>${user.name}</strong>,</p>
          
          <p>We have received a request to update your profile information. To proceed with this action, please use the verification code below:</p>
          
          <div class="otp-container">
            <div style="margin-bottom: 10px;">Your Verification Code:</div>
            <div class="otp-code">${otp}</div>
            <div style="font-size: 14px;">Valid for 10 minutes</div>
          </div>
          
          <div class="info">
            <strong>ℹ️ Security Notice:</strong> This verification ensures that only you can update your profile information. If you did not request this change, please ignore this email and contact our support team.
          </div>
          
          <div class="contact-info">
            <strong>Need Help?</strong><br>
            📞 Contact: 8830553868<br>
            📧 Email: saptechnoeditors@gmail.com
          </div>
          
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2025 SAP TechnoEditors. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Check if email credentials are configured
    if (!hasEmailCredentials) {
      logger.log('Email credentials not configured. OTP for testing:', otp)
      return NextResponse.json({
        message: 'OTP generated successfully (email not sent - credentials not configured)',
        expiresIn: '10 minutes',
        otp: otp // Only for development/testing
      })
    }

    // Send email
    try {
      await transporter.sendMail({
        from: `"SAP TechnoEditors" <${process.env.EMAIL_USERNAME || process.env.EMAIL_USER}>`,
        to: user.email,
        subject: '🔐 Profile Update Verification',
        html: emailHtml
      })
      
      logger.log('Profile update OTP email sent successfully to:', user.email)
      
      return NextResponse.json({
        message: 'OTP sent successfully',
        expiresIn: '10 minutes'
      })
    } catch (emailError) {
      logger.error('Email sending failed:', emailError)
      return NextResponse.json({
        message: 'OTP generated but email failed to send',
        expiresIn: '10 minutes',
        otp: otp, // Provide OTP for manual entry
        error: emailError instanceof Error ? emailError.message : 'Unknown email error'
      })
    }

  } catch (error) {
    logger.error('Error sending profile update OTP:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}

// PUT - Verify OTP for profile update
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, otp } = body

    if (!userId || !otp) {
      return NextResponse.json(
        { error: 'User ID and OTP are required' },
        { status: 400 }
      )
    }

    // Get stored OTP from database
    const storedOTP = await prisma.oTP.findFirst({
      where: {
        userId,
        type: 'PROFILE_UPDATE',
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!storedOTP) {
      return NextResponse.json(
        { error: 'OTP not found or expired' },
        { status: 400 }
      )
    }

    // Verify OTP
    if (storedOTP.otp !== otp) {
      logger.log('Profile update OTP mismatch for user:', userId, 'Expected:', storedOTP.otp, 'Received:', otp)
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      )
    }

    // OTP is valid, remove it from database
    await prisma.oTP.delete({
      where: {
        id: storedOTP.id
      }
    })

    return NextResponse.json({
      message: 'OTP verified successfully',
      verified: true
    })

  } catch (error) {
    logger.error('Error verifying profile update OTP:', error)
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
} 
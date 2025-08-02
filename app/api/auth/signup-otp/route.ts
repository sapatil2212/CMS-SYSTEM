import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

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

// POST - Send signup verification OTP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Rate limiting check - prevent spam
    const recentOTP = await prisma.oTP.findFirst({
      where: {
        userId: email,
        type: 'SIGNUP_VERIFICATION',
        createdAt: {
          gt: new Date(Date.now() - 60 * 1000) // 1 minute ago
        }
      }
    })

    if (recentOTP) {
      return NextResponse.json(
        { error: 'Please wait 1 minute before requesting another OTP' },
        { status: 429 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 409 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store temporary OTP information using email as identifier
    // Remove any existing signup verification OTPs for this email
    await prisma.oTP.deleteMany({
        where: {
            userId: email, // Using email as a temporary identifier
            type: 'SIGNUP_VERIFICATION'
        }
    })

    // Create new OTP record
    const otpRecord = await prisma.oTP.create({
      data: {
        userId: email, // Using email as a temporary identifier
        otp,
        expiresAt,
        type: 'SIGNUP_VERIFICATION'
      }
    })

    console.log('OTP created for signup:', { email, otp, expiresAt, otpId: otpRecord.id })

    // Enhanced email template for signup verification
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Account</title>
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
          .otp-code {
            background-color: #007bff;
            color: white;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 4px;
            margin: 20px 0;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Welcome to Our Platform!</h2>
          </div>
          
          <p>Hello ${name},</p>
          
          <p>Thank you for signing up! Please use the following OTP to verify your email address and complete your registration:</p>
          
          <div class="otp-code">${otp}</div>
          
          <div class="warning">
            <strong>Important:</strong> This OTP will expire in 10 minutes. If you didn't request this registration, please ignore this email.
          </div>
          
          <p>After entering this OTP, your account will be created and you'll be able to access all features.</p>
          
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send email with better error handling
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USERNAME || process.env.EMAIL_USER || 'saptechnoeditors@gmail.com',
        to: email,
        subject: 'Verify Your Email Address - Account Registration',
        html: emailHtml
      })
      
      console.log('Signup OTP email sent successfully to:', email)
    } catch (emailError) {
      console.error('Failed to send signup OTP email:', emailError)
      // Delete the OTP record since email failed
      await prisma.oTP.delete({
        where: { id: otpRecord.id }
      })
      throw new Error('Failed to send verification email')
    }

    return NextResponse.json({
      message: 'Verification OTP sent to your email.'
    })

  } catch (error) {
    console.error('Error sending signup OTP:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP.' },
      { status: 500 }
    )
  }
}

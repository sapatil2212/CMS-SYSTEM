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

// POST - Send forgot password OTP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 404 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Remove any existing forgot password OTPs for this user
    await prisma.oTP.deleteMany({
      where: {
        userId: user.id,
        type: 'PASSWORD_RESET'
      }
    })

    // Store OTP in database
    await prisma.oTP.create({
      data: {
        userId: user.id,
        otp,
        expiresAt,
        type: 'PASSWORD_RESET'
      }
    })

    // Email template for forgot password
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
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
            background-color: #f8f9fa;
            border: 2px solid #dee2e6;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 3px;
            color: #495057;
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
            <h2>Password Reset Request</h2>
          </div>
          
          <p>Hello ${user.name},</p>
          
          <p>We received a request to reset your password. Use the following OTP code to complete the password reset process:</p>
          
          <div class="otp-code">${otp}</div>
          
          <div class="warning">
            <strong>Important:</strong> This OTP will expire in 10 minutes. If you didn't request this password reset, please ignore this email.
          </div>
          
          <p>If you have any questions, please contact our support team.</p>
          
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USERNAME || process.env.EMAIL_USER || 'saptechnoeditors@gmail.com',
      to: user.email,
      subject: 'Password Reset OTP',
      html: emailHtml
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      message: 'Password reset OTP sent to your email'
    })

  } catch (error) {
    console.error('Error sending forgot password OTP:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { createUser, generateToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, otp } = await request.json()

    if (!name || !email || !password || !otp) {
      return NextResponse.json(
        { error: 'Name, email, password, and OTP are required' },
        { status: 400 }
      )
    }

    // Verify OTP
    const storedOTP = await prisma.oTP.findFirst({
      where: {
        userId: email, // Using email as the identifier
        otp,
        type: 'SIGNUP_VERIFICATION',
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    console.log('OTP Verification for registration:', {
      email,
      providedOTP: otp,
      storedOTP: storedOTP ? storedOTP.otp : 'NOT_FOUND',
      hasStoredOTP: !!storedOTP,
      storedOTPId: storedOTP?.id
    });

    if (!storedOTP) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP. Please request a new verification code.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Create the user
    const user = await createUser(name, email, password)
    
    // Delete the OTP after successful registration
    await prisma.oTP.delete({
      where: { id: storedOTP.id }
    });

    console.log('User created successfully:', { userId: user.id, email: user.email, name: user.name });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return NextResponse.json({
      message: 'Registration successful! Welcome to our platform.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    
    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
} 
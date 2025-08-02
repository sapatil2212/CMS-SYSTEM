import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

// PUT - Reset password with OTP verification
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp, newPassword } = body

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'Email, OTP, and new password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get stored OTP from database
    const storedOTP = await prisma.oTP.findFirst({
      where: {
        userId: user.id,
        type: 'PASSWORD_RESET',
        expiresAt: {
          gt: new Date()
        }
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
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    // Remove OTP from database
    await prisma.oTP.delete({
      where: { id: storedOTP.id }
    })

    return NextResponse.json({
      message: 'Password reset successfully'
    })

  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
} 
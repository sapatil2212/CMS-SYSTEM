import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger';
import {  authenticateUser, generateToken  } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await authenticateUser(email, password)
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    logger.error('Login error:', error)
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }
} 
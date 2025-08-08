import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { createAPIHandler } from '@/lib/api-validation'

const testAuth = async (request: NextRequest) => {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
    
    logger.log('Auth test request', {
      hasAuthHeader: !!authHeader,
      hasToken: !!token,
      tokenLength: token?.length || 0,
      method: request.method,
      url: request.url,
      env: {
        hasJwtSecret: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL
      }
    })

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'No token provided',
        debug: {
          hasAuthHeader: !!authHeader,
          authHeaderStartsWithBearer: authHeader?.startsWith('Bearer '),
          tokenLength: 0
        }
      }, { status: 401 })
    }

    // Test token verification
    const { verifyToken } = require('@/lib/auth')
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({
        success: false,
        error: 'Invalid token',
        debug: {
          tokenLength: token.length,
          tokenPrefix: token.substring(0, 10) + '...',
          hasJwtSecret: !!process.env.JWT_SECRET
        }
      }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        userId: payload.userId,
        email: payload.email,
        role: payload.role
      },
      debug: {
        tokenLength: token.length,
        hasJwtSecret: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV
      }
    })
  } catch (error) {
    logger.error('Auth test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Authentication test failed',
      debug: {
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        hasJwtSecret: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV
      }
    }, { status: 500 })
  }
}

export const GET = createAPIHandler(testAuth, {
  methods: ['GET'],
  requireAuth: false,
  requireAdmin: false,
  cors: true
})

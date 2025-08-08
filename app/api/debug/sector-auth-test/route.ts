import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { createAPIHandler } from '@/lib/api-validation'

const testSectorAuth = async (request: NextRequest) => {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
    
    logger.log('Sector auth test request', {
      hasAuthHeader: !!authHeader,
      hasToken: !!token,
      tokenLength: token?.length || 0,
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
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
          tokenLength: 0,
          headers: {
            authorization: authHeader,
            'content-type': request.headers.get('content-type'),
            origin: request.headers.get('origin')
          }
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
          hasJwtSecret: !!process.env.JWT_SECRET,
          jwtSecretLength: process.env.JWT_SECRET?.length || 0
        }
      }, { status: 401 })
    }

    // Test admin role requirement
    if (payload.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        error: 'Admin access required',
        debug: {
          userRole: payload.role,
          requiredRole: 'ADMIN',
          userId: payload.userId,
          email: payload.email
        }
      }, { status: 403 })
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
        nodeEnv: process.env.NODE_ENV,
        userRole: payload.role,
        isAdmin: payload.role === 'ADMIN'
      }
    })
  } catch (error) {
    logger.error('Sector auth test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Authentication test failed',
      debug: {
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        hasJwtSecret: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV,
        errorType: error.constructor.name
      }
    }, { status: 500 })
  }
}

export const GET = createAPIHandler(testSectorAuth, {
  methods: ['GET'],
  requireAuth: false,
  requireAdmin: false,
  cors: true
})

export const POST = createAPIHandler(testSectorAuth, {
  methods: ['POST'],
  requireAuth: false,
  requireAdmin: false,
  cors: true
})

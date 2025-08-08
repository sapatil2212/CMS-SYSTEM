/**
 * Comprehensive API Input Validation and Error Handling
 * Production-ready validation middleware for all API endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import {  ZodError, z  } from 'zod';;

// Common validation schemas
export const commonSchemas = {
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password too long'),
  phoneNumber: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  id: z.string().cuid('Invalid ID format'),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  url: z.string().url('Invalid URL format'),
  positiveInteger: z.number().int().positive('Must be a positive integer'),
  nonEmptyString: z.string().min(1, 'Field cannot be empty'),
};

// API Error Types
export class APIError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends APIError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND_ERROR');
  }
}

export class ConflictError extends APIError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

export class RateLimitError extends APIError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_ERROR');
  }
}

// Rate limiting store (in-memory for demo, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(maxRequests: number = 100, windowMs: number = 60000) {
  return (request: NextRequest) => {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const resetTime = now + windowMs;
    
    const current = rateLimitStore.get(ip);
    
    if (!current || current.resetTime <= now) {
      rateLimitStore.set(ip, { count: 1, resetTime });
      return true;
    }
    
    if (current.count >= maxRequests) {
      throw new RateLimitError(`Rate limit exceeded. Try again in ${Math.ceil((current.resetTime - now) / 1000)} seconds`);
    }
    
    current.count++;
    return true;
  };
}

// Request validation middleware
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (request: NextRequest): Promise<T> => {
    try {
      let data: any;
      
      if (request.method === 'GET') {
        // Validate query parameters
        const url = new URL(request.url);
        const params = Object.fromEntries(url.searchParams.entries());
        data = params;
      } else {
        // Validate request body
        const contentType = request.headers.get('content-type');
        
        if (contentType?.includes('application/json')) {
          data = await request.json();
        } else if (contentType?.includes('multipart/form-data')) {
          const formData = await request.formData();
          data = Object.fromEntries(formData.entries());
        } else {
          throw new ValidationError('Unsupported content type');
        }
      }
      
      return schema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map(err => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        throw new ValidationError('Validation failed', details);
      }
      
      if (error instanceof SyntaxError) {
        throw new ValidationError('Invalid JSON format');
      }
      
      throw error;
    }
  };
}

// Authentication middleware
export function requireAuth() {
  return (request: NextRequest) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.error('Auth error: Missing or invalid authorization header', {
        hasHeader: !!authHeader,
        headerStartsWithBearer: authHeader?.startsWith('Bearer '),
        method: request.method,
        url: request.url
      });
      throw new AuthenticationError('Missing or invalid authorization header');
    }
    
    const token = authHeader.substring(7);
    
    if (!token) {
      logger.error('Auth error: Token is empty');
      throw new AuthenticationError('Token is required');
    }
    
    try {
      // Verify JWT token
      const { verifyToken } = require('@/lib/auth');
      const payload = verifyToken(token);
      
      if (!payload) {
        logger.error('Auth error: Invalid or expired token', {
          tokenLength: token.length,
          tokenPrefix: token.substring(0, 10) + '...',
          method: request.method,
          url: request.url
        });
        throw new AuthenticationError('Invalid or expired token');
      }
      
      // Additional validation for production
      if (!payload.userId || !payload.email || !payload.role) {
        logger.error('Auth error: Invalid token payload', {
          hasUserId: !!payload.userId,
          hasEmail: !!payload.email,
          hasRole: !!payload.role
        });
        throw new AuthenticationError('Invalid token payload');
      }
      
      logger.log('Auth success: Token verified', {
        userId: payload.userId,
        email: payload.email,
        role: payload.role
      });
      
      return payload;
    } catch (error) {
      logger.error('Auth error: Token verification failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        method: request.method,
        url: request.url
      });
      throw new AuthenticationError('Invalid or expired token');
    }
  };
}

// Admin role middleware
export function requireAdmin() {
  return (request: NextRequest, user?: any) => {
    if (!user || user.role !== 'ADMIN') {
      throw new AuthorizationError('Admin access required');
    }
    
    return true;
  };
}

// CORS middleware
export function corsHeaders(origin?: string) {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://cms-system-1kcb.vercel.app',
    'https://alkalyne.in',
    'https://www.alkalyne.in',
    // Add your production domains here
  ];
  
  const isAllowed = !origin || allowedOrigins.includes(origin);
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? (origin || '*') : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
  };
}

// Error response formatter
export function formatErrorResponse(error: unknown): NextResponse {
  logger.error('API Error:', error);
  
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
        },
        timestamp: new Date().toISOString(),
      },
      { status: error.statusCode }
    );
  }
  
  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
  
  return NextResponse.json(
    {
      success: false,
      error: {
        message: 'Unknown error occurred',
        code: 'UNKNOWN_ERROR',
      },
      timestamp: new Date().toISOString(),
    },
    { status: 500 }
  );
}

// Success response formatter
export function formatSuccessResponse(data: any, status: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

// API Handler wrapper
export function createAPIHandler(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
  options: {
    methods?: string[];
    rateLimit?: { maxRequests: number; windowMs: number };
    requireAuth?: boolean;
    requireAdmin?: boolean;
    cors?: boolean;
  } = {}
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      // Handle CORS preflight
      if (options.cors && request.method === 'OPTIONS') {
        return new NextResponse(null, {
          status: 200,
          headers: corsHeaders(request.headers.get('origin') || undefined),
        });
      }
      
      // Method validation
      if (options.methods && !options.methods.includes(request.method)) {
        throw new APIError(`Method ${request.method} not allowed`, 405, 'METHOD_NOT_ALLOWED');
      }
      
      // Rate limiting
      if (options.rateLimit) {
        const limiter = rateLimit(options.rateLimit.maxRequests, options.rateLimit.windowMs);
        limiter(request);
      }
      
      // Authentication
      let user: any = null;
      if (options.requireAuth) {
        const authMiddleware = requireAuth();
        user = authMiddleware(request);
      }
      
      // Authorization
      if (options.requireAdmin) {
        const adminMiddleware = requireAdmin();
        adminMiddleware(request, user);
      }
      
      // Execute handler
      const response = await handler(request, context);
      
      // Add CORS headers if enabled
      if (options.cors) {
        const corsHeadersObj = corsHeaders(request.headers.get('origin') || undefined);
        Object.entries(corsHeadersObj).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      }
      
      return response;
    } catch (error) {
      const errorResponse = formatErrorResponse(error);
      
      // Add CORS headers to error responses too
      if (options.cors) {
        const corsHeadersObj = corsHeaders(request.headers.get('origin') || undefined);
        Object.entries(corsHeadersObj).forEach(([key, value]) => {
          errorResponse.headers.set(key, value);
        });
      }
      
      return errorResponse;
    }
  };
}

// Common validation schemas for specific endpoints
export const validationSchemas = {
  // Auth schemas
  loginSchema: z.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
  }),
  
  registerSchema: z.object({
    firstName: commonSchemas.name,
    lastName: commonSchemas.name,
    email: commonSchemas.email,
    password: commonSchemas.password,
    phoneNumber: commonSchemas.phoneNumber.optional(),
  }),
  
  forgotPasswordSchema: z.object({
    email: commonSchemas.email,
  }),
  
  resetPasswordSchema: z.object({
    token: commonSchemas.nonEmptyString,
    password: commonSchemas.password,
  }),
  
  // Contact schema
  contactSchema: z.object({
    name: commonSchemas.name,
    email: commonSchemas.email,
    phone: commonSchemas.phoneNumber.optional(),
    company: z.string().max(200, 'Company name too long').optional(),
    message: z.string().min(10, 'Message too short').max(2000, 'Message too long'),
  }),
  
  // Content schemas
  updateContentSchema: z.object({
    title: z.string().min(1, 'Title required').max(200, 'Title too long').optional(),
    content: z.string().min(1, 'Content required').optional(),
    isActive: z.boolean().optional(),
  }),
  
  // Base metal schema
  baseMetalSchema: z.object({
    name: commonSchemas.name,
    slug: commonSchemas.slug,
    description: z.string().max(1000, 'Description too long').optional(),
    isActive: z.boolean().default(true),
  }),
  
  // Process schema
  processSchema: z.object({
    name: commonSchemas.name,
    slug: commonSchemas.slug,
    description: z.string().max(2000, 'Description too long').optional(),
    isActive: z.boolean().default(true),
  }),
};
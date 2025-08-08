# Vercel Deployment Troubleshooting Guide

## Issue: Sector Management 403 Errors

The sector management API endpoints are returning 403 errors on Vercel deployment while working perfectly on local machine.

## Root Causes Identified

### 1. Environment Variables
- **JWT_SECRET** might not be properly configured in Vercel
- **DATABASE_URL** might have connection issues in serverless environment

### 2. CORS Configuration
- Production domain not included in allowed origins
- Missing headers for preflight requests

### 3. Authentication Issues
- JWT token verification failing in production
- Token payload validation issues

### 4. Database Connection
- Connection pooling issues in serverless environment
- Timeout issues with database connections

## Solutions Implemented

### 1. Updated CORS Configuration
```typescript
// Added production domains to allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://cms-system-1kcb.vercel.app',
  'https://alkalyne.in',
  'https://www.alkalyne.in',
];
```

### 2. Enhanced Authentication Middleware
- Added better error logging
- Improved token payload validation
- Added request context to error messages

### 3. Database Connection Improvements
- Added connection timeout configuration
- Improved connection pooling for serverless
- Added better error handling for connection issues

### 4. API Route Updates
- Enabled CORS for all sector API routes
- Added comprehensive error handling

## Vercel Environment Variables Checklist

Ensure these environment variables are set in your Vercel project:

```bash
# Required for authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Database connection
DATABASE_URL=mysql://username:password@host:port/database_name?connection_limit=5&pool_timeout=2

# Optional but recommended
NODE_ENV=production
```

## Testing Steps

### 1. Test Authentication
Use the debug endpoint to test authentication:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://your-domain.vercel.app/api/debug/auth-test
```

### 2. Test Sector API
```bash
# Test GET (should work without auth)
curl https://your-domain.vercel.app/api/sectors

# Test PUT (requires auth)
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","description":"Test","details":"Test"}' \
  https://your-domain.vercel.app/api/sectors/SECTOR_ID
```

## Common Issues and Fixes

### Issue 1: JWT_SECRET not set
**Symptoms**: 403 errors on all authenticated endpoints
**Fix**: Set JWT_SECRET in Vercel environment variables

### Issue 2: Database connection timeout
**Symptoms**: 500 errors on database operations
**Fix**: Check DATABASE_URL and ensure it's accessible from Vercel

### Issue 3: CORS errors
**Symptoms**: Preflight request failures
**Fix**: Ensure production domain is in allowed origins

### Issue 4: Token expiration
**Symptoms**: 401 errors after some time
**Fix**: Check token expiration time and refresh logic

## Debug Endpoints

### Auth Test Endpoint
- **URL**: `/api/debug/auth-test`
- **Method**: GET
- **Purpose**: Test JWT token verification
- **Response**: Detailed authentication status and debug info

### Environment Check Endpoint
- **URL**: `/api/debug/env-check`
- **Method**: GET
- **Purpose**: Check environment variables
- **Response**: Environment variable status (without sensitive data)

## Monitoring and Logging

### Vercel Function Logs
Check Vercel function logs for detailed error information:
1. Go to your Vercel dashboard
2. Select your project
3. Go to Functions tab
4. Check logs for specific API routes

### Error Patterns to Look For
- `JWT_SECRET environment variable is not set`
- `Database connection timeout`
- `CORS preflight failed`
- `Token verification failed`

## Deployment Checklist

- [ ] JWT_SECRET is set in Vercel environment variables
- [ ] DATABASE_URL is accessible from Vercel
- [ ] Production domain is in CORS allowed origins
- [ ] All environment variables are properly configured
- [ ] Database is accessible from Vercel's serverless functions
- [ ] Test authentication with debug endpoint
- [ ] Test sector API endpoints
- [ ] Check Vercel function logs for errors

## Quick Fix Commands

### Update Environment Variables in Vercel
```bash
vercel env add JWT_SECRET
vercel env add DATABASE_URL
```

### Redeploy with Latest Changes
```bash
vercel --prod
```

### Check Function Logs
```bash
vercel logs --follow
```

## Support

If issues persist after implementing these fixes:

1. Check Vercel function logs for specific error messages
2. Use the debug endpoints to identify the exact issue
3. Verify all environment variables are set correctly
4. Test database connectivity from Vercel's environment
5. Ensure JWT tokens are being generated and verified correctly

# Vercel Deployment Troubleshooting Guide

## Issues Identified

### 1. 500 Internal Server Error on Image Upload
**Problem**: `POST https://alkalyne.in/api/upload 500 (Internal Server Error)`

**Root Cause**: The upload route was trying to write files to the local filesystem, which doesn't work on Vercel's serverless environment.

**Solution**: ✅ **FIXED** - Updated upload route to use Cloudinary instead of local filesystem.

### 2. 403 Forbidden Error on Sector Operations
**Problem**: `PUT https://alkalyne.in/api/sectors/[id] 403 (Forbidden)`

**Root Cause**: JWT token verification failing due to missing or incorrect JWT_SECRET environment variable.

**Solution**: ✅ **FIXED** - Enhanced authentication middleware with better error logging.

## Immediate Action Steps

### Step 1: Check Environment Variables
Visit: `https://alkalyne.in/api/debug/env-check`

This will show you exactly which environment variables are missing or misconfigured.

### Step 2: Set Required Environment Variables in Vercel

Go to your Vercel dashboard → Project Settings → Environment Variables and add:

#### Critical Variables:
```bash
# Database (Replace with your actual production database URL)
DATABASE_URL="mysql://username:password@host:port/database_name?connection_limit=5&pool_timeout=2"

# JWT Authentication (Generate a strong random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-2024"

# Cloudinary (Required for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

#### Optional Variables:
```bash
# Email Configuration
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USERNAME="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
```

### Step 3: Redeploy Application
1. Go to Vercel Dashboard → Deployments
2. Click "Redeploy" on the latest deployment
3. Wait for deployment to complete

### Step 4: Test Functionality
1. **Test Login**: Go to `/login` and try logging in
2. **Test Admin Access**: Go to `/admin/sectors`
3. **Test Image Upload**: Try uploading an image in the sector form
4. **Test CRUD Operations**: Try creating, editing, and deleting sectors

## Debugging Steps

### 1. Check Environment Variables
```bash
# Visit this URL in your browser
https://alkalyne.in/api/debug/env-check
```

### 2. Check Vercel Function Logs
1. Go to Vercel Dashboard → Functions
2. Look for failed function executions
3. Check the logs for specific error messages

### 3. Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Try the failing operations and look for error messages

### 4. Test Individual Endpoints
```bash
# Test upload endpoint
curl -X POST https://alkalyne.in/api/upload \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test-image.jpg"

# Test sectors endpoint (requires authentication)
curl -X GET https://alkalyne.in/api/sectors \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Common Error Messages and Solutions

### "JWT_SECRET not configured"
- **Solution**: Add JWT_SECRET to Vercel environment variables
- **Value**: Use a strong random string (at least 32 characters)

### "Cloudinary credentials not configured"
- **Solution**: Add all Cloudinary variables to Vercel
- **Required**: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

### "Database connection failed"
- **Solution**: Verify DATABASE_URL points to production database
- **Check**: Ensure database is accessible from Vercel's servers

### "403 Forbidden"
- **Solution**: Check JWT_SECRET and user authentication
- **Debug**: Check browser console for specific error messages

## Code Changes Made

### 1. Fixed Upload Route (`app/api/upload/route.ts`)
- ✅ Changed from local filesystem to Cloudinary
- ✅ Added proper error handling
- ✅ Added logging for debugging

### 2. Enhanced Authentication (`lib/api-validation.ts`)
- ✅ Added detailed error logging
- ✅ Improved token verification
- ✅ Better error messages

### 3. Enhanced Auth Library (`lib/auth.ts`)
- ✅ Added environment variable validation
- ✅ Added logging for debugging
- ✅ Better error handling

### 4. Added Debug Endpoint (`app/api/debug/env-check/route.ts`)
- ✅ Environment variable checker
- ✅ Configuration validation
- ✅ Issue identification

## Testing Checklist

After setting environment variables and redeploying:

- [ ] Environment check endpoint works (`/api/debug/env-check`)
- [ ] Can log in to admin panel
- [ ] Can access `/admin/sectors`
- [ ] Can upload images in sector form
- [ ] Can create new sectors
- [ ] Can edit existing sectors
- [ ] Can delete sectors
- [ ] No 500 errors in browser console
- [ ] No 403 errors on admin routes

## If Issues Persist

### 1. Check Vercel Logs
```bash
# Install Vercel CLI
npm i -g vercel

# Login and check logs
vercel login
vercel logs --follow
```

### 2. Test Database Connection
```bash
# Add this to any API route temporarily
console.log('Database connection test:', {
  url: process.env.DATABASE_URL?.substring(0, 50) + '...',
  exists: !!process.env.DATABASE_URL
});
```

### 3. Test JWT Token
```bash
# Add this to auth routes temporarily
console.log('JWT test:', {
  secretExists: !!process.env.JWT_SECRET,
  secretLength: process.env.JWT_SECRET?.length
});
```

## Security Notes

1. **Never commit environment variables** to version control
2. **Use different secrets** for development and production
3. **Rotate secrets regularly** in production
4. **Use strong, random JWT secrets** (at least 32 characters)
5. **Limit database user permissions** to only what's needed

## Support

If you're still experiencing issues after following this guide:

1. Check the environment check endpoint: `/api/debug/env-check`
2. Review Vercel function logs for specific error messages
3. Test individual API endpoints to isolate the problem
4. Ensure all environment variables are properly set in Vercel dashboard

# Production Environment Variables Setup for Vercel

## Critical Environment Variables Required

### 1. Database Configuration
```bash
DATABASE_URL="mysql://username:password@host:port/database_name?connection_limit=5&pool_timeout=2"
```

### 2. JWT Authentication
```bash
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### 3. Cloudinary Configuration (for file uploads)
```bash
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

### 4. Email Configuration (optional)
```bash
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USERNAME="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
```

## How to Set Environment Variables in Vercel

### Method 1: Vercel Dashboard
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with the exact names above
4. Set the environment to "Production" (and optionally "Preview" for testing)

### Method 2: Vercel CLI
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
```

## Troubleshooting Common Issues

### 1. JWT_SECRET Issues
- **Problem**: 403 Forbidden errors on admin routes
- **Solution**: Ensure JWT_SECRET is set and consistent across deployments
- **Check**: Verify token generation and verification in logs

### 2. Database Connection Issues
- **Problem**: 500 errors on database operations
- **Solution**: Verify DATABASE_URL is correct and accessible from Vercel
- **Check**: Test database connection in Vercel function logs

### 3. File Upload Issues
- **Problem**: 500 errors on image uploads
- **Solution**: Ensure all Cloudinary variables are set
- **Check**: Verify Cloudinary credentials are valid

## Testing Environment Variables

### 1. Check JWT_SECRET
```javascript
// Add this to any API route temporarily for debugging
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length);
```

### 2. Check Cloudinary Configuration
```javascript
// Add this to upload route for debugging
console.log('Cloudinary config:', {
  cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
  api_key: !!process.env.CLOUDINARY_API_KEY,
  api_secret: !!process.env.CLOUDINARY_API_SECRET
});
```

### 3. Check Database Connection
```javascript
// Add this to any database route for debugging
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
```

## Security Best Practices

1. **Never commit environment variables** to version control
2. **Use different secrets** for development and production
3. **Rotate secrets regularly** in production
4. **Use strong, random JWT secrets** (at least 32 characters)
5. **Limit database user permissions** to only what's needed

## Deployment Checklist

- [ ] DATABASE_URL configured and accessible
- [ ] JWT_SECRET set with strong random value
- [ ] Cloudinary credentials configured
- [ ] All environment variables added to Vercel
- [ ] Database migrations run successfully
- [ ] Test login functionality
- [ ] Test file upload functionality
- [ ] Test admin routes access

## Common Error Messages and Solutions

### "JWT_SECRET not configured"
- **Cause**: Missing JWT_SECRET environment variable
- **Solution**: Add JWT_SECRET to Vercel environment variables

### "Cloudinary credentials not configured"
- **Cause**: Missing Cloudinary environment variables
- **Solution**: Add all Cloudinary variables to Vercel

### "Database connection failed"
- **Cause**: Invalid DATABASE_URL or network issues
- **Solution**: Verify DATABASE_URL and ensure database is accessible from Vercel

### "403 Forbidden"
- **Cause**: Authentication/authorization issues
- **Solution**: Check JWT_SECRET and user role verification
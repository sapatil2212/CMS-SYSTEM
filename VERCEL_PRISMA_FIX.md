# Vercel Prisma Deployment Fix

## Issue
The deployment was failing with `PrismaClientInitializationError` because Prisma couldn't locate the Query Engine for the `rhel-openssl-3.0.x` runtime.

## What Was Fixed

### 1. Updated Prisma Schema (`prisma/schema.prisma`)
- Added additional binary targets to support different Vercel runtimes:
  ```prisma
  generator client {
    provider = "prisma-client-js"
    binaryTargets = ["native", "rhel-openssl-1.0.x", "rhel-openssl-3.0.x", "linux-musl", "debian-openssl-1.1.x", "debian-openssl-3.0.x"]
  }
  ```

### 2. Updated Package.json Scripts
- Removed `prisma db push` from build commands (should not run during deployment)
- Kept only `prisma generate` in build process

### 3. Updated Vercel Configuration (`vercel.json`)
- Changed build command to use `npm run vercel-build`
- Added environment variable for Prisma data proxy support
- Ensured proper function timeout settings

### 4. Updated Next.js Configuration (`next.config.js`)
- Added Prisma packages to `serverComponentsExternalPackages` to prevent bundling issues

## Deployment Steps

1. **Clean local Prisma cache:**
   ```bash
   rm -rf node_modules/.prisma
   npx prisma generate
   ```

2. **Test locally:**
   ```bash
   npm run build
   npm start
   ```

3. **Deploy to Vercel:**
   - Push changes to your repository
   - Vercel will automatically redeploy with the new configuration

## Environment Variables Required on Vercel

Make sure these environment variables are set in your Vercel dashboard:

- `DATABASE_URL` - Your MySQL database connection string
- `NEXTAUTH_SECRET` - For authentication (if using NextAuth)
- `NEXTAUTH_URL` - Your production URL
- `CLOUDINARY_CLOUD_NAME` - For image uploads
- `CLOUDINARY_API_KEY` - For image uploads  
- `CLOUDINARY_API_SECRET` - For image uploads
- Any other environment variables your app uses

## Troubleshooting

If the issue persists:

1. **Clear Vercel build cache:**
   - Go to your Vercel dashboard
   - Settings → Functions
   - Clear build cache and redeploy

2. **Force Prisma regeneration:**
   - Add this to your `vercel-build` script temporarily:
     ```bash
     "vercel-build": "rm -rf node_modules/.prisma && prisma generate && next build"
     ```

3. **Check Vercel function logs:**
   - Go to Vercel dashboard → Functions tab
   - Check the runtime logs for any remaining errors

## Why This Happens

Vercel uses different runtime environments (Node.js versions and Linux distributions) that require specific Prisma query engine binaries. By including multiple binary targets, we ensure Prisma has the correct engine available regardless of which runtime Vercel assigns.

The key binary targets for Vercel are:
- `rhel-openssl-3.0.x` - Most common Vercel runtime
- `linux-musl` - Alternative runtime  
- `debian-openssl-3.0.x` - Newer Debian-based runtimes
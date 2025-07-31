# Process Content Management & Image Upload Troubleshooting Guide

## Issues Fixed

### 1. CRUD Operations Issues

**Problem**: Users were unable to update process content from the backend.

**Root Causes**:
- Missing or incomplete API routes for some processes
- Inconsistent data handling between frontend and backend
- Poor error handling and feedback

**Solutions Implemented**:
- Created a generic `/api/content/[process]/route.ts` that handles all process types dynamically
- Added proper error handling and validation
- Improved data parsing and response formatting
- Added comprehensive logging for debugging

### 2. Image Upload Issues

**Problem**: Images were being uploaded to Cloudinary but not properly saved to the database.

**Root Causes**:
- Missing error handling in upload process
- No feedback to users about upload status
- Inconsistent URL handling between upload and save operations

**Solutions Implemented**:
- Enhanced error handling in upload API
- Added success/error toast notifications
- Improved Cloudinary configuration validation
- Added comprehensive logging for debugging upload issues

## How to Test the Fixes

### 1. Test CRUD Operations

1. **Navigate to Admin Panel**: Go to `/admin/process`
2. **Edit a Process**: Click "Edit" on any process card
3. **Make Changes**: Update content in any section (Hero, What Is, Benefits, etc.)
4. **Save Changes**: Click "Save Changes" button
5. **Verify**: Check that changes are saved and reflected in the UI

### 2. Test Image Uploads

1. **Navigate to Settings**: Go to `/admin/settings`
2. **Use Debug Tool**: Use the "Image Upload Testing" section
3. **Upload Image**: Drag and drop or browse for an image
4. **Verify Upload**: Check that the image appears in the preview
5. **Test in Process Edit**: Try uploading images in the process edit modal

### 3. Test Process Content Management

1. **Edit Process**: Open any process for editing
2. **Upload Hero Image**: Upload an image in the Hero section
3. **Upload Section Images**: Upload images in What Is, Quality Assurance sections
4. **Upload Application Images**: Upload images for industry applications
5. **Save Process**: Save the process and verify images are saved

## Debugging Tools

### 1. Image Upload Debug Component

Located at `/admin/settings`, this component allows you to:
- Test image uploads independently
- See detailed error messages
- Preview uploaded images
- Verify Cloudinary integration

### 2. Console Logging

The following components now include comprehensive logging:
- `/api/admin/upload/route.ts` - Upload API logging
- `/lib/cloudinary.ts` - Cloudinary integration logging
- `/api/content/[process]/route.ts` - Process content API logging

### 3. Error Handling

All components now include:
- Detailed error messages
- Toast notifications for success/error states
- Proper HTTP status codes
- Validation feedback

## Common Issues and Solutions

### Issue 1: "Process not found" Error

**Cause**: The process slug doesn't match the expected format.

**Solution**: Ensure process slugs match the mapping in the API route:
- `copper-plating`
- `silver-plating`
- `gold-plating`
- etc.

### Issue 2: "Cloudinary credentials not configured" Error

**Cause**: Missing environment variables.

**Solution**: Add to your `.env.local`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Issue 3: "File size too large" Error

**Cause**: Image exceeds 5MB limit.

**Solution**: Compress the image or use a smaller file.

### Issue 4: "Invalid file type" Error

**Cause**: File is not an image or has unsupported format.

**Solution**: Use PNG, JPG, GIF, or WEBP formats.

### Issue 5: Images not saving to database

**Cause**: Image URL not being properly passed to content save.

**Solution**: 
1. Check that the image upload completes successfully
2. Verify the URL is being set in the content object
3. Ensure the save operation includes the image URL

## Database Schema Requirements

Ensure your Prisma schema includes the necessary fields for all process content models:

```prisma
model CopperPlatingContent {
  id                    String   @id @default(cuid())
  heroTitle            String?
  heroSubtitle         String?
  heroDescription      String?   @db.Text
  heroImage            String?
  whatIsTitle          String?
  whatIsDescription    String?   @db.Text
  whatIsImage          String?
  whatIsBestFor        String?   @db.Text
  whatIsMaterials      String?   @db.Text
  whatIsAlkalineOffers String?   @db.Text
  benefitsTitle        String?
  benefitsSubtitle     String?
  processTitle         String?
  processSubtitle      String?
  applicationsTitle    String?
  applicationsSubtitle String?
  industriesTitle      String?
  industriesSubtitle   String?
  qualityTitle         String?
  qualityDescription   String?   @db.Text
  qualityImage         String?
  ctaTitle             String?
  ctaDescription       String?   @db.Text
  // ... related models
}
```

## Environment Variables Required

```bash
# Database
DATABASE_URL="mysql://user:password@localhost:3306/cms_db"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Next.js
NEXTAUTH_SECRET="your_secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Testing Checklist

- [ ] Process content can be loaded
- [ ] Process content can be saved
- [ ] Images can be uploaded
- [ ] Images are saved with content
- [ ] Error messages are clear and helpful
- [ ] Success messages appear after operations
- [ ] All process types work (copper-plating, silver-plating, etc.)
- [ ] Image uploads work in all sections (Hero, What Is, Quality, Applications)
- [ ] Large images are properly compressed
- [ ] Invalid files are rejected with clear messages

## Support

If you continue to experience issues:

1. Check the browser console for error messages
2. Check the server logs for API errors
3. Use the Image Upload Debug tool in `/admin/settings`
4. Verify all environment variables are set correctly
5. Ensure the database schema is up to date with `npx prisma db push` 
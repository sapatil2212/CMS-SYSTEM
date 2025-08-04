# Sector Image Upload Functionality

## Overview
The sectors overview component now supports dynamic image uploads for each sector. Users can upload images through the admin dashboard, and the frontend will display these images with proper fallbacks.

## Features Implemented

### 1. Image Upload API
- **Endpoint**: `/api/upload`
- **Method**: POST
- **Functionality**: 
  - Accepts image files (validates file type and size)
  - Saves files to `public/assets/sectors/` directory
  - Returns public URL for the uploaded image
  - File size limit: 5MB
  - Supported formats: All image types

### 2. Enhanced Sector Form
- **File**: `components/admin/SectorForm.tsx`
- **Features**:
  - File upload input for image files
  - URL input as alternative option
  - Image preview with remove functionality
  - Automatic upload to server when file is selected
  - Error handling for upload failures

### 3. Frontend Display
- **File**: `components/frontend/SectorsOverview.tsx`
- **Features**:
  - Displays uploaded sector images
  - Fallback to placeholder image if no image is set
  - Error handling for broken image links
  - Responsive image display

## Database Schema
The `Sector` model already includes an `image` field:
```prisma
model Sector {
  id          String   @id @default(cuid())
  name        String
  description String   @db.Text
  details     String   @db.Text
  image       String?  // Optional image URL
  category    String
  features    String   @db.Text
  applications String  @db.Text
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Usage Instructions

### For Administrators
1. Navigate to `/admin/sectors`
2. Create or edit a sector
3. In the "Sector Image" field:
   - **Option 1**: Click "Choose File" to upload an image
   - **Option 2**: Enter an image URL directly
4. The image will be automatically uploaded and the URL will be saved
5. You can preview the image and remove it if needed

### For Developers
- Images are stored in `public/assets/sectors/`
- File naming: `sector-{timestamp}.{extension}`
- Public URLs: `/assets/sectors/{filename}`
- Fallback image: `/assets/sectors/placeholder.svg`

## Error Handling
- Invalid file types are rejected
- Files larger than 5MB are rejected
- Upload failures show user-friendly error messages
- Broken image links fallback to placeholder

## Security Considerations
- File type validation prevents malicious uploads
- File size limits prevent abuse
- Files are stored in public directory (no sensitive data)
- Unique filenames prevent conflicts

## Future Enhancements
- Image compression and optimization
- Multiple image support per sector
- Image cropping and editing tools
- CDN integration for better performance 
# Image Upload System for Hero Slider

## Overview

This system provides a comprehensive image upload functionality for the hero slider management, allowing users to upload images from their local machine and store them in the public folder. The system includes drag-and-drop support, image preview, and automatic cleanup of old images.

## Features

### Upload Functionality
- **Drag & Drop**: Users can drag images directly onto the upload area
- **File Browser**: Traditional file selection through browse button
- **Image Preview**: Real-time preview of uploaded images
- **File Validation**: Type and size validation
- **Progress Indicator**: Visual feedback during upload
- **Error Handling**: Clear error messages for failed uploads

### Image Management
- **Local Storage**: Images stored in `public/uploads/` directory
- **Unique Naming**: UUID-based filenames to prevent conflicts
- **Automatic Cleanup**: Old images deleted when slides are updated/deleted
- **Multiple Formats**: Support for JPG, PNG, GIF, WEBP
- **Size Limits**: Configurable maximum file size (default: 10MB)

## Components

### ImageUpload Component
Located at `components/admin/ImageUpload.tsx`

**Props:**
- `label`: Field label text
- `value`: Current image URL
- `onChange`: Callback when image URL changes
- `className`: Additional CSS classes
- `required`: Whether the field is required
- `accept`: Accepted file types (default: 'image/*')
- `maxSize`: Maximum file size in MB (default: 5)

**Features:**
- Drag and drop interface
- File type validation
- Size validation
- Upload progress indicator
- Image preview with remove option
- Error message display

### ImagePreview Component
Located at `components/admin/ImagePreview.tsx`

**Props:**
- `src`: Image source URL
- `alt`: Alt text for accessibility
- `className`: Additional CSS classes
- `showFallback`: Whether to show fallback on error

**Features:**
- Loading state with spinner
- Error handling with fallback
- Smooth opacity transitions
- Responsive design

## API Endpoints

### POST `/api/admin/upload`
Handles file uploads to the public directory.

**Request:**
- FormData with 'image' field containing the file

**Response:**
```json
{
  "url": "/api/uploads/filename.jpg",
  "filename": "filename.jpg",
  "originalName": "original-name.jpg",
  "size": 123456,
  "type": "image/jpeg"
}
```

**Validation:**
- File type: Only images (JPEG, PNG, GIF, WEBP)
- File size: Maximum 5MB (configurable)
- File presence: Must provide a file

### GET `/api/uploads/[...path]`
Serves uploaded images from the public directory.

**Features:**
- Proper content-type headers
- Caching headers for performance
- Error handling for missing files

## File Storage

### Directory Structure
```
public/
  uploads/
    uuid1.jpg
    uuid2.png
    uuid3.webp
```

### File Naming
- Uses UUID v4 for unique filenames
- Preserves original file extension
- Prevents filename conflicts

### Cleanup Process
- Old images automatically deleted when slides are updated
- Images deleted when slides are removed
- Only local uploads are cleaned up (external URLs preserved)

## Usage Examples

### Basic Image Upload
```tsx
import ImageUpload from '@/components/admin/ImageUpload'

function MyForm() {
  const [imageUrl, setImageUrl] = useState('')

  return (
    <ImageUpload
      label="Hero Image"
      value={imageUrl}
      onChange={setImageUrl}
      required
    />
  )
}
```

### Custom Configuration
```tsx
<ImageUpload
  label="Mobile Image"
  value={mobileImage}
  onChange={setMobileImage}
  maxSize={2} // 2MB limit
  accept="image/jpeg,image/png" // Only JPG and PNG
  className="mb-4"
/>
```

### Image Preview
```tsx
import ImagePreview from '@/components/admin/ImagePreview'

<ImagePreview
  src="/api/uploads/image.jpg"
  alt="Hero slide"
  className="w-full h-48"
/>
```

## Error Handling

### Upload Errors
- **File too large**: Shows size limit message
- **Invalid file type**: Shows accepted formats
- **Network error**: Shows generic upload failed message
- **Server error**: Shows server error message

### Preview Errors
- **Missing image**: Shows fallback with icon
- **Loading error**: Shows loading spinner
- **Network error**: Shows error state

## Security Considerations

### File Validation
- MIME type checking
- File extension validation
- Size limits enforced
- No executable files allowed

### Path Security
- Files stored in public/uploads only
- No directory traversal possible
- Unique filenames prevent conflicts

### Access Control
- Upload endpoint protected by admin authentication
- Files served through controlled API endpoint
- No direct file system access

## Performance Optimizations

### Image Serving
- Proper cache headers for static files
- Content-type headers for browser optimization
- Efficient file reading with Node.js streams

### Upload Process
- File size validation before processing
- Efficient buffer handling
- Non-blocking file operations

## Configuration

### Environment Variables
No specific environment variables required for basic functionality.

### File Size Limits
Default: 5MB per file
Configurable via `maxSize` prop in ImageUpload component

### Accepted Formats
Default: All image types
Configurable via `accept` prop in ImageUpload component

## Troubleshooting

### Common Issues

1. **Upload Fails**
   - Check file size (max 5MB)
   - Verify file type (images only)
   - Check network connection
   - Verify server permissions

2. **Images Not Displaying**
   - Check file path in public/uploads
   - Verify file permissions
   - Check browser console for errors

3. **Old Images Not Deleted**
   - Verify image URLs start with /api/uploads/
   - Check server file permissions
   - Review server logs for errors

### Debug Steps

1. **Check File Permissions**
   ```bash
   ls -la public/uploads/
   ```

2. **Verify Upload Directory**
   ```bash
   mkdir -p public/uploads
   ```

3. **Test Upload Endpoint**
   ```bash
   curl -X POST -F "image=@test.jpg" http://localhost:3000/api/admin/upload
   ```

## Future Enhancements

### Planned Features
- [ ] Image compression and optimization
- [ ] Multiple image formats (WebP, AVIF)
- [ ] Image cropping and resizing
- [ ] Bulk upload functionality
- [ ] CDN integration
- [ ] Image metadata extraction

### Technical Improvements
- [ ] Streaming uploads for large files
- [ ] Background image processing
- [ ] Image thumbnail generation
- [ ] Advanced caching strategies
- [ ] Image analytics and usage tracking 
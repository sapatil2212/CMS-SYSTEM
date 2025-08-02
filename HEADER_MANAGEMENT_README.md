# Header Management Feature

## Overview

The Header Management feature allows administrators to upload and manage the website logo and header content through the admin dashboard. This feature provides a user-friendly interface for updating the logo and contact information that appears in the website header.

## Features

### 🖼️ Logo Upload & Management
- **Drag & Drop Upload**: Easy drag-and-drop interface for logo uploads
- **Multiple Formats**: Supports PNG, JPG, JPEG, and WEBP formats
- **Size Validation**: Maximum file size of 2MB
- **Preview**: Live preview of the uploaded logo
- **Alt Text**: Customizable alt text for accessibility and SEO
- **Instant Updates**: Changes are reflected immediately on the frontend

### 📞 Contact Information Management
- **Phone Number**: Update the phone number displayed in the header
- **Email Address**: Manage the contact email address
- **Live Preview**: See changes in real-time

### 🎨 User Interface
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with proper feedback
- **Error Handling**: Comprehensive error messages and validation
- **Loading States**: Visual feedback during uploads and saves

## Database Schema

The feature uses a new `HeaderSettings` table in the database:

```sql
model HeaderSettings {
  id          String   @id @default(cuid())
  logoUrl     String?
  logoAlt     String?
  phoneNumber String?
  email       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## API Endpoints

### GET `/api/content/header`
Retrieves the current header settings.

**Response:**
```json
{
  "id": "cmdskkfou000012u7k4zw98jq",
  "logoUrl": "/logo/logo.png",
  "logoAlt": "CMS System Logo",
  "phoneNumber": "+91 93731 02887",
  "email": "info@example.com",
  "createdAt": "2025-08-01T08:36:19.182Z",
  "updatedAt": "2025-08-01T08:36:19.182Z"
}
```

### PUT `/api/content/header`
Updates the header settings.

**Request Body:**
```json
{
  "logoUrl": "https://example.com/new-logo.png",
  "logoAlt": "New Company Logo",
  "phoneNumber": "+91 98765 43210",
  "email": "contact@example.com"
}
```

## Components

### HeaderManagement Component
Located at `components/admin/HeaderManagement.tsx`

**Features:**
- Logo upload with drag-and-drop
- Form validation
- Live preview
- Success/error messaging
- Responsive design

### Updated Header Component
Located at `components/frontend/Header.tsx`

**Changes:**
- Fetches logo URL from database
- Displays dynamic logo and contact information
- Fallback to default values if database is unavailable

## Usage Instructions

### For Administrators

1. **Access Header Management**
   - Log in to the admin dashboard
   - Navigate to "Header Content" in the sidebar
   - You'll see the Header Management interface

2. **Upload Logo**
   - Click the upload area or drag an image file
   - Supported formats: PNG, JPG, JPEG, WEBP
   - Maximum size: 2MB
   - The logo will be uploaded to Cloudinary

3. **Set Alt Text**
   - Enter descriptive alt text for accessibility
   - This text appears if the image fails to load

4. **Update Contact Information**
   - Enter the phone number to display in the header
   - Enter the email address for contact information

5. **Save Changes**
   - Click "Save Changes" to update the settings
   - Changes are immediately reflected on the frontend

### For Developers

1. **Database Migration**
   ```bash
   npx prisma db push
   ```

2. **Seed Default Data**
   ```bash
   npx tsx prisma/seed-header-settings.ts
   ```

3. **Test API Endpoints**
   ```bash
   node scripts/test-header-api.js
   ```

## File Structure

```
├── app/
│   ├── admin/header/page.tsx          # Admin header management page
│   └── api/content/header/route.ts    # Header API endpoints
├── components/
│   ├── admin/
│   │   ├── HeaderManagement.tsx       # Header management component
│   │   └── ImageUpload.tsx            # Reusable image upload component
│   └── frontend/
│       └── Header.tsx                 # Updated frontend header
├── prisma/
│   ├── schema.prisma                  # Database schema with HeaderSettings
│   └── seed-header-settings.ts        # Seed script for default data
└── scripts/
    └── test-header-api.js             # API testing script
```

## Technical Implementation

### Image Upload Flow
1. User selects/drops image file
2. File is validated (type, size)
3. Image is uploaded to Cloudinary
4. URL is returned and stored in database
5. Frontend immediately reflects the change

### Database Operations
- **GET**: Retrieves current settings or creates defaults
- **PUT**: Updates existing settings or creates new ones
- **Fallback**: Uses default values if database is unavailable

### Frontend Integration
- Header component fetches settings on mount
- Logo and contact info are dynamically displayed
- Graceful fallback to default values
- Error handling for failed image loads

## Security Considerations

- **File Validation**: Only image files are accepted
- **Size Limits**: 2MB maximum file size
- **Cloud Storage**: Images are stored securely on Cloudinary
- **Input Sanitization**: All user inputs are properly validated

## Performance Optimizations

- **Lazy Loading**: Images are loaded only when needed
- **Caching**: Cloudinary provides CDN caching
- **Compression**: Images are automatically optimized
- **Fallback**: Graceful degradation if images fail to load

## Troubleshooting

### Common Issues

1. **Image Not Uploading**
   - Check file format (PNG, JPG, JPEG, WEBP only)
   - Ensure file size is under 2MB
   - Verify Cloudinary configuration

2. **Logo Not Displaying**
   - Check if the URL is accessible
   - Verify the image exists on Cloudinary
   - Check browser console for errors

3. **Changes Not Saving**
   - Verify database connection
   - Check API endpoint accessibility
   - Review server logs for errors

### Debug Commands

```bash
# Test API endpoints
node scripts/test-header-api.js

# Check database
npx prisma studio

# View logs
npm run dev
```

## Future Enhancements

- [ ] Multiple logo variants (dark/light themes)
- [ ] Logo cropping and resizing tools
- [ ] Version history for logo changes
- [ ] Bulk upload for multiple images
- [ ] Advanced image optimization settings
- [ ] Logo placement customization
- [ ] Mobile-specific logo settings

## Support

For technical support or feature requests, please refer to the project documentation or contact the development team. 
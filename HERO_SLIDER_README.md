# Hero Slider Management System

## Overview

This CMS system includes a modern, responsive hero slider with full CRUD (Create, Read, Update, Delete) functionality. The hero slider features smooth animations, mobile-responsive design, and an intuitive admin interface for content management.

## Features

### Frontend Features
- **Responsive Design**: Optimized for desktop and mobile devices
- **Smooth Animations**: CSS transitions and keyframe animations
- **Auto-play**: Automatic slide rotation every 5 seconds
- **Manual Navigation**: Arrow buttons and dot indicators
- **Hover Effects**: Interactive elements with hover states
- **Modern UI**: Rounded corners, gradients, and modern styling

### Admin Features
- **Full CRUD Operations**: Create, read, update, and delete slides
- **Visual Management**: Card-based interface with image previews
- **Active/Inactive Toggle**: Enable/disable slides without deletion
- **Order Management**: Control slide display order
- **Image Management**: Support for desktop and mobile images
- **Content Fields**: Title, subtitle, description, CTA text, and links

## Database Schema

```prisma
model HeroSlider {
  id          String   @id @default(cuid())
  title       String
  subtitle    String?
  description String?  @db.Text
  image       String
  mobileImage  String?
  ctaText     String?  @default("Learn More")
  ctaLink     String?
  order       Int
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## API Endpoints

### GET `/api/content/hero-slider`
- Returns all active hero slides ordered by `order` field
- Used by the frontend to display slides

### POST `/api/content/hero-slider`
- Creates a new hero slide
- Required fields: `title`, `image`
- Optional fields: `subtitle`, `description`, `mobileImage`, `ctaText`, `ctaLink`, `order`, `isActive`

### PUT `/api/content/hero-slider`
- Updates an existing hero slide
- Requires `id` field in request body
- All other fields are optional

### DELETE `/api/content/hero-slider?id={slideId}`
- Deletes a hero slide by ID
- Requires slide ID as query parameter

## Admin Interface

### Access
Navigate to `/admin/hero-slider` to access the hero slider management interface.

### Features
1. **Dashboard View**: Card-based layout showing all slides with previews
2. **Add New Slide**: Modal form for creating new slides
3. **Edit Slide**: Inline editing with form validation
4. **Delete Slide**: Confirmation dialog before deletion
5. **Toggle Active Status**: Quick enable/disable without editing
6. **Image Preview**: Visual preview of slide images
7. **Order Management**: Numeric input for controlling slide order

### Form Fields
- **Title**: Main heading text (required)
- **Subtitle**: Secondary text below title
- **Description**: Detailed description (optional)
- **Desktop Image**: High-resolution image for desktop (required)
- **Mobile Image**: Optimized image for mobile devices (optional)
- **CTA Text**: Call-to-action button text
- **CTA Link**: URL for the call-to-action button
- **Order**: Numeric value for slide ordering
- **Active**: Checkbox to enable/disable slide

## Frontend Component

### Usage
```tsx
import HeroSlider from '@/components/frontend/HeroSlider'

export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      {/* Other content */}
    </div>
  )
}
```

### Features
- **Auto-fetch**: Automatically loads slides from API
- **Fallback Content**: Shows dummy content if API fails
- **Responsive Images**: Different images for desktop and mobile
- **Smooth Transitions**: CSS-based slide transitions
- **Accessibility**: ARIA labels and keyboard navigation

## Styling

### CSS Classes
- `.hero-slide-enter`: Slide entrance animation
- `.hero-slide-enter-active`: Active entrance state
- `.hero-slide-exit`: Slide exit animation
- `.hero-slide-exit-active`: Active exit state
- `.hero-text-animation`: Text animation keyframes
- `.hero-cta-hover`: CTA button hover effects

### Keyframe Animations
```css
@keyframes heroTextSlide {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Setup Instructions

### 1. Database Setup
```bash
# Push schema changes
npm run db:push

# Seed initial data
npm run db:seed
```

### 2. Dependencies
Ensure these packages are installed:
```bash
npm install tsx @prisma/client
```

### 3. Environment Variables
Make sure your `.env` file includes:
```
DATABASE_URL="mysql://username:password@localhost:3306/cms_db"
```

## Seed Data

The system includes seed data with 3 sample slides:
1. "Precision Plating, Engineered to Last"
2. "Innovation in Every Layer"
3. "Surface Perfection for Every Application"

Each slide includes:
- Professional titles and subtitles
- High-quality Unsplash images
- Call-to-action buttons
- Proper ordering

## Customization

### Adding New Fields
1. Update the Prisma schema
2. Modify the API endpoints
3. Update the admin form
4. Update the frontend component interface

### Styling Changes
1. Modify CSS classes in `globals.css`
2. Update component styles in `HeroSlider.tsx`
3. Adjust admin interface styles

### Animation Timing
- Auto-play interval: 5 seconds
- Slide transition duration: 1 second
- Text animation delay: 500ms

## Troubleshooting

### Common Issues
1. **Images not loading**: Check image URLs and CORS settings
2. **Database connection**: Verify DATABASE_URL in .env
3. **API errors**: Check server logs for detailed error messages
4. **Styling issues**: Ensure Tailwind CSS is properly configured

### Performance Tips
1. Optimize images for web use
2. Use CDN for image hosting
3. Implement lazy loading for non-critical images
4. Cache API responses where appropriate

## Future Enhancements

### Planned Features
- [ ] Image upload functionality
- [ ] Drag-and-drop reordering
- [ ] Bulk operations
- [ ] Analytics tracking
- [ ] A/B testing support
- [ ] Video support
- [ ] Advanced animations

### Technical Improvements
- [ ] Image optimization
- [ ] Caching strategies
- [ ] Performance monitoring
- [ ] SEO optimization
- [ ] Accessibility improvements 
# Offer Popup Feature

## Overview

The Offer Popup feature allows administrators to create and manage promotional popup modals that appear on the home page when users visit. This feature includes a complete CRUD interface in the admin dashboard and a beautiful modal display on the frontend.

## Features

### Frontend Features
- **Automatic Display**: Popup appears when users visit the home page (once per session)
- **Beautiful Design**: Modern modal with backdrop blur and smooth animations
- **Responsive**: Works perfectly on all device sizes
- **Interactive Elements**:
  - Close button (X) in the top-right corner
  - "Learn More" button with right arrow icon
  - Clickable backdrop to close
- **Session Management**: Only shows once per browser session
- **Fallback Design**: Graceful fallback if image fails to load

### Admin Dashboard Features
- **Complete CRUD Operations**:
  - Create new offer popups
  - Edit existing popups
  - Delete popups
  - Activate/deactivate popups
- **Image Upload**: Integrated with Cloudinary for image management
- **Form Validation**: Required fields and proper validation
- **Success Notifications**: User-friendly success messages
- **Confirmation Modals**: Safe delete operations with confirmation

## Database Schema

```prisma
model OfferPopup {
  id          String   @id @default(cuid())
  title       String
  description String   @db.Text
  image       String
  ctaText     String   @default("Learn More")
  ctaLink     String?
  isActive    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## API Endpoints

### GET `/api/content/offer-popup`
- Returns the currently active offer popup
- Used by the frontend to fetch popup data

### POST `/api/content/offer-popup`
- Creates a new offer popup
- Automatically deactivates all existing popups
- Sets the new popup as active

### PUT `/api/content/offer-popup`
- Updates an existing offer popup
- Allows activation/deactivation

### DELETE `/api/content/offer-popup?id={id}`
- Deletes an offer popup by ID

## File Structure

```
├── app/
│   ├── api/content/offer-popup/
│   │   └── route.ts                    # API endpoints
│   └── admin/offer-popup/
│       └── page.tsx                    # Admin management page
├── components/
│   └── frontend/
│       └── OfferPopup.tsx              # Frontend popup component
├── prisma/
│   ├── schema.prisma                   # Database schema
│   └── seed-offer-popup.ts            # Sample data
└── OFFER_POPUP_README.md              # This documentation
```

## Usage

### For Administrators

1. **Access the Management Page**:
   - Go to Admin Dashboard
   - Click on "Offer Popup" in the sidebar
   - Use the megaphone icon to identify the section

2. **Create a New Offer Popup**:
   - Click "Create New Offer Popup" button
   - Fill in the required fields:
     - Title: The popup headline
     - Description: Detailed offer description
     - Image: Upload via Cloudinary
     - CTA Text: Button text (default: "Learn More")
     - CTA Link: Optional URL for the button
   - Click "Create" to save

3. **Manage Existing Popups**:
   - **Activate/Deactivate**: Use the eye/eye-slash icon
   - **Edit**: Click the pencil icon to modify
   - **Delete**: Click the trash icon (with confirmation)

### For Users

- **Automatic Display**: Popup appears automatically on home page visit
- **One-time Display**: Only shows once per browser session
- **Easy Dismissal**: Click X button or backdrop to close
- **Action Button**: Click "Learn More" to visit the specified link

## Technical Implementation

### Frontend Component (`OfferPopup.tsx`)
- Uses React hooks for state management
- Fetches data from API on component mount
- Implements session storage to prevent repeated displays
- Responsive design with Tailwind CSS
- Smooth animations and transitions

### Admin Management (`page.tsx`)
- Complete CRUD interface
- Form validation and error handling
- Modal-based editing and creation
- Integration with Cloudinary for image uploads
- Success/error notifications

### API Implementation (`route.ts`)
- RESTful endpoints for all operations
- Proper error handling and validation
- Database operations with Prisma
- Automatic activation management

## Styling

The popup uses a modern design with:
- **Backdrop**: Semi-transparent black with blur effect
- **Modal**: White background with rounded corners and shadow
- **Gradient Buttons**: Blue to purple gradient for CTA
- **Hover Effects**: Smooth transitions and scale effects
- **Responsive**: Adapts to all screen sizes

## Security Features

- **Session Management**: Prevents spam by limiting to once per session
- **Admin Authentication**: Only authenticated admins can manage
- **Input Validation**: Server-side validation for all inputs
- **Safe Operations**: Confirmation modals for destructive actions

## Customization

### Styling Customization
- Modify `OfferPopup.tsx` for frontend appearance
- Update Tailwind classes for different themes
- Adjust animation durations and effects

### Functionality Customization
- Modify session storage behavior
- Add additional fields to the database schema
- Implement different display triggers
- Add analytics tracking

## Troubleshooting

### Common Issues

1. **Popup Not Showing**:
   - Check if an active popup exists in database
   - Verify session storage is working
   - Check browser console for errors

2. **Image Not Loading**:
   - Verify Cloudinary URL is correct
   - Check image permissions
   - Fallback gradient will display if image fails

3. **Admin Access Issues**:
   - Ensure user is authenticated
   - Check user role permissions
   - Verify API endpoints are accessible

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify API responses in Network tab
3. Check database for active popup records
4. Test session storage functionality

## Future Enhancements

- **Multiple Popups**: Support for multiple active popups
- **Scheduling**: Time-based activation/deactivation
- **A/B Testing**: Different popups for different user segments
- **Analytics**: Track popup interactions and conversions
- **Templates**: Pre-designed popup templates
- **Conditional Display**: Show based on user behavior or preferences

## Dependencies

- **Frontend**: React, Tailwind CSS, Heroicons
- **Backend**: Next.js API routes, Prisma ORM
- **Image Storage**: Cloudinary integration
- **Database**: MySQL (via Prisma)

## Installation

1. Database migration: `npx prisma db push`
2. Seed sample data: `npx tsx prisma/seed-offer-popup.ts`
3. Restart development server: `npm run dev`

The feature is now ready to use! 
# React Email System Setup

This document describes the new React Email system that replaces the plain HTML email templates with modern, responsive React components.

## Overview

The new email system uses [@react-email/components](https://react.email/) to create professional, responsive email templates that work consistently across all email clients and devices.

## Features

✅ **Responsive Design** - Works on mobile, desktop, and all email clients
✅ **Consistent Styling** - Inline styles for reliable rendering
✅ **Accessibility** - Proper semantic HTML and ARIA attributes
✅ **Dark Mode Support** - Fallback styles for dark mode email clients
✅ **Professional UI** - Modern design with gradients, shadows, and proper spacing
✅ **Brand Integration** - Logo support and consistent branding
✅ **Timestamp Display** - Formatted timestamps in footer
✅ **Call-to-Action Buttons** - Clickable buttons for better UX

## Components

### 1. AdminNotificationEmail
- **Purpose**: Sent to admin when a user submits the contact form
- **Features**:
  - Action required alert
  - Complete contact details
  - Service type badge
  - Client message (if provided)
  - Reply button with pre-filled subject
  - Timestamp in footer

### 2. UserConfirmationEmail
- **Purpose**: Sent to user as confirmation of their inquiry
- **Features**:
  - Personalized greeting
  - Success confirmation
  - Inquiry details summary
  - Next steps process
  - Contact information
  - Call-to-action button

## Usage

### Basic Usage

```typescript
import { 
  renderAdminNotificationEmail, 
  renderUserConfirmationEmail,
  createEmailData 
} from './lib/react-email-templates';

// Create email data
const emailData = createEmailData({
  fullName: 'John Doe',
  email: 'john@example.com',
  mobile: '+1234567890',
  processType: 'Zinc Plating',
  message: 'I need a quote for zinc plating services.',
  logoUrl: 'https://your-domain.com/logo.png',
  logoAlt: 'Your Company Name',
});

// Generate HTML for admin email
const adminEmailHtml = renderAdminNotificationEmail(emailData);

// Generate HTML for user email
const userEmailHtml = renderUserConfirmationEmail(emailData);
```

### Using with Nodemailer

```typescript
import nodemailer from 'nodemailer';
import { generateContactFormEmails } from './lib/react-email-templates';

const transporter = nodemailer.createTransporter({
  // Your email configuration
});

// Generate emails
const { adminEmailHtml, userEmailHtml } = generateContactFormEmails({
  fullName: 'John Doe',
  email: 'john@example.com',
  mobile: '+1234567890',
  processType: 'Zinc Plating',
  message: 'I need a quote for zinc plating services.',
});

// Send admin notification
await transporter.sendMail({
  from: 'noreply@yourdomain.com',
  to: 'admin@yourdomain.com',
  subject: 'New Contact Form Submission',
  html: adminEmailHtml,
});

// Send user confirmation
await transporter.sendMail({
  from: 'noreply@yourdomain.com',
  to: 'john@example.com',
  subject: 'Thank you for your inquiry',
  html: userEmailHtml,
});
```

## File Structure

```
components/
  emails/
    AdminNotificationEmail.tsx    # Admin notification email component
    UserConfirmationEmail.tsx     # User confirmation email component

lib/
  react-email-templates.ts        # Email rendering utilities
  email-templates.ts              # Legacy templates (deprecated)
```

## Migration from Legacy Templates

The old email templates in `lib/email-templates.ts` are now deprecated but still functional for backward compatibility. The new React Email templates provide:

1. **Better Maintainability** - TypeScript components instead of string templates
2. **Consistent Rendering** - React Email handles email client quirks
3. **Responsive Design** - Mobile-first approach
4. **Accessibility** - Proper semantic structure
5. **Modern Styling** - CSS-in-JS with inline styles

## Email Client Compatibility

The React Email components are designed to work with:

- ✅ Gmail (Web & Mobile)
- ✅ Outlook (Desktop & Web)
- ✅ Apple Mail
- ✅ Yahoo Mail
- ✅ Thunderbird
- ✅ Mobile email clients
- ✅ Dark mode email clients

## Customization

### Adding Your Logo

Update the `logoUrl` and `logoAlt` in your email data:

```typescript
const emailData = createEmailData({
  // ... other data
  logoUrl: 'https://your-domain.com/logo.png',
  logoAlt: 'Your Company Name',
});
```

### Customizing Colors

The email components use a consistent color scheme. To customize:

1. Edit the style objects in each component
2. Update the gradient backgrounds
3. Modify the color variables

### Adding New Email Types

To create a new email template:

1. Create a new component in `components/emails/`
2. Use the existing components as a template
3. Add a render function in `lib/react-email-templates.ts`
4. Export the new function

## Testing

You can test the email templates by:

1. Using the `generateContactFormEmails` function
2. Saving the HTML output to a file
3. Opening in a web browser to preview
4. Sending test emails to yourself

## Dependencies

The React Email system requires:

```json
{
  "@react-email/components": "^0.0.15",
  "@react-email/render": "^0.0.12"
}
```

## Best Practices

1. **Always use inline styles** - Email clients strip external CSS
2. **Test on multiple email clients** - Rendering varies significantly
3. **Keep images small** - Many email clients block large images
4. **Use web-safe fonts** - Fallback to system fonts
5. **Include alt text** - For accessibility and when images are blocked
6. **Test dark mode** - Many users prefer dark mode

## Troubleshooting

### Common Issues

1. **Images not displaying**: Ensure images are hosted on HTTPS
2. **Styles not applying**: Use inline styles only
3. **Layout breaking**: Test on mobile devices
4. **Buttons not working**: Some email clients block JavaScript

### Debug Mode

To debug email rendering:

```typescript
import { render } from '@react-email/render';

// Enable debug mode
const html = render(emailComponent, {
  pretty: true,
});
```

## Support

For issues with React Email components, refer to the [official documentation](https://react.email/).

For custom email client issues, test on [Email on Acid](https://www.emailonacid.com/) or similar services. 
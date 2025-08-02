# Profile Management System

## Overview

The Profile Management System provides comprehensive user profile management capabilities with OTP (One-Time Password) verification for sensitive operations like email changes and password resets.

## Features

### 🔐 Personal Information Management
- **Name Updates**: Users can update their full name without verification
- **Email Changes**: Email changes require OTP verification sent to the current email
- **Role Display**: Shows user role (read-only)

### 🔑 Password Management
- **Password Change**: Users can change password with current password verification
- **Password Reset**: Users can reset password via OTP sent to their email
- **Password Validation**: Ensures password strength and confirmation match

### 📧 OTP Verification System
- **Email Change OTP**: Sent to current email when changing email address
- **Password Reset OTP**: Sent to user's email for password reset
- **OTP Expiration**: OTPs expire after 10 minutes for security
- **Automatic Cleanup**: Expired OTPs are automatically cleaned up

## API Endpoints

### Profile Management (`/api/auth/profile`)

#### POST - Update Profile
```javascript
POST /api/auth/profile
{
  "userId": "user_id",
  "name": "New Name",
  "email": "newemail@example.com",
  "currentPassword": "current_password",
  "newPassword": "new_password"
}
```

**Response for Email Change:**
```javascript
{
  "message": "OTP sent to your current email for verification",
  "requiresOTP": true,
  "newEmail": "newemail@example.com"
}
```

**Response for Direct Update:**
```javascript
{
  "message": "Profile updated successfully"
}
```

#### PUT - Verify Email Change OTP
```javascript
PUT /api/auth/profile
{
  "userId": "user_id",
  "otp": "123456",
  "newEmail": "newemail@example.com"
}
```

**Response:**
```javascript
{
  "message": "Email updated successfully"
}
```

#### DELETE - Request Password Reset
```javascript
DELETE /api/auth/profile
{
  "email": "user@example.com"
}
```

**Response:**
```javascript
{
  "message": "Password reset OTP sent to your email"
}
```

### Password Reset (`/api/auth/reset-password`)

#### PUT - Reset Password with OTP
```javascript
PUT /api/auth/reset-password
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "new_password"
}
```

**Response:**
```javascript
{
  "message": "Password reset successfully"
}
```

## Frontend Components

### ProfileManagement Component

The main component that handles all profile management functionality:

```tsx
import ProfileManagement from '@/components/admin/ProfileManagement'

// Usage in profile page
<ProfileManagement />
```

#### Features:
- **Form Validation**: Client-side validation for all inputs
- **OTP Modal**: Modal dialog for OTP verification
- **Loading States**: Loading indicators for all operations
- **Error Handling**: Comprehensive error messages
- **Success Feedback**: Success messages for completed operations

## Security Features

### 🔒 OTP Security
- **6-digit OTP**: Random 6-digit codes for verification
- **10-minute Expiration**: OTPs expire after 10 minutes
- **Single Use**: OTPs are deleted after successful verification
- **Email Verification**: OTPs are sent to verified email addresses

### 🔐 Password Security
- **Bcrypt Hashing**: Passwords are hashed using bcrypt with salt rounds of 12
- **Current Password Verification**: Required for password changes
- **Password Strength**: Minimum 6 characters required
- **Password Confirmation**: Must match new password

### 🛡️ Data Protection
- **Email Uniqueness**: Prevents duplicate email addresses
- **User Verification**: All operations verify user existence
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Secure error messages without exposing sensitive data

## Email Templates

### Email Change Verification
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">Email Change Verification</h2>
  <p>You have requested to change your email address. Please use the following OTP to verify your current email:</p>
  <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
    <h1 style="color: #007bff; font-size: 32px; margin: 0;">123456</h1>
  </div>
  <p>This OTP will expire in 10 minutes.</p>
  <p>If you didn't request this change, please ignore this email.</p>
</div>
```

### Password Reset
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">Password Reset Request</h2>
  <p>You have requested to reset your password. Please use the following OTP to verify your identity:</p>
  <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
    <h1 style="color: #007bff; font-size: 32px; margin: 0;">123456</h1>
  </div>
  <p>This OTP will expire in 10 minutes.</p>
  <p>If you didn't request this reset, please ignore this email.</p>
</div>
```

## Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### OTP Model
```prisma
model OTP {
  id        String   @id @default(cuid())
  userId    String
  otp       String
  expiresAt DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Testing

Run the profile management test:

```bash
node scripts/test-profile-management.js
```

This will test:
- User creation
- OTP generation and storage
- OTP retrieval
- Profile updates
- OTP cleanup
- Data cleanup

## Environment Variables

Ensure these environment variables are set for email functionality:

```env
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
DATABASE_URL=your-database-url
```

## Usage Examples

### 1. Update Name Only
```javascript
// User fills form with only name changed
// No OTP required
// Direct update to database
```

### 2. Change Email
```javascript
// User enters new email
// System sends OTP to current email
// User enters OTP in modal
// Email is updated after verification
```

### 3. Change Password
```javascript
// User enters current password + new password
// System verifies current password
// Password is updated immediately
```

### 4. Reset Password
```javascript
// User clicks "Reset Password"
// System sends OTP to user's email
// User enters OTP + new password in modal
// Password is updated after verification
```

## Error Handling

### Common Error Messages
- `"User ID is required"` - Missing user ID
- `"User not found"` - Invalid user ID
- `"Email is already taken"` - Email already exists
- `"Current password is incorrect"` - Wrong current password
- `"OTP not found or expired"` - Invalid or expired OTP
- `"Invalid OTP"` - Wrong OTP code
- `"Failed to send verification email"` - Email sending failed

### Validation Rules
- **Name**: Required, any length
- **Email**: Required, valid email format, unique
- **Current Password**: Required when changing password
- **New Password**: Minimum 6 characters, must match confirmation
- **OTP**: 6 digits, must match stored OTP

## Security Best Practices

1. **OTP Expiration**: All OTPs expire after 10 minutes
2. **Single Use**: OTPs are deleted after successful verification
3. **Email Verification**: OTPs are sent to verified email addresses
4. **Password Hashing**: All passwords are hashed using bcrypt
5. **Input Validation**: Server-side validation for all inputs
6. **Error Messages**: Secure error messages without exposing sensitive data
7. **Rate Limiting**: Consider implementing rate limiting for OTP requests
8. **Audit Logging**: Consider logging sensitive operations for security

## Future Enhancements

1. **Rate Limiting**: Implement rate limiting for OTP requests
2. **Audit Logging**: Log all profile changes for security
3. **Two-Factor Authentication**: Add 2FA support
4. **Password Strength**: Enhanced password strength requirements
5. **Email Templates**: Customizable email templates
6. **SMS OTP**: Add SMS OTP as an alternative to email
7. **Backup Codes**: Generate backup codes for account recovery
8. **Session Management**: Handle active sessions after email changes 
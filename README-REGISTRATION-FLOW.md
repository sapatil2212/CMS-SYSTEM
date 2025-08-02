# User Registration Flow with OTP Verification

## Overview

This document describes the complete user registration flow with OTP (One-Time Password) verification that has been implemented in the CMS system.

## Flow Summary

1. **User enters registration details** (name, email, password)
2. **System sends OTP to email** 
3. **User enters OTP**
4. **System verifies OTP and creates account**
5. **User is logged in and redirected**

## API Endpoints

### 1. Send Registration OTP
**Endpoint:** `POST /api/auth/signup-otp`

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "Verification OTP sent to your email."
}
```

**Features:**
- Email validation
- Rate limiting (1 OTP per minute)
- Duplicate user check
- Professional email template
- Automatic cleanup on email failure

### 2. Complete Registration
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com", 
  "password": "securepassword",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Registration successful! Welcome to our platform.",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

## Database Schema

### OTP Model
```prisma
model OTP {
  id        String   @id @default(cuid())
  userId    String   // Email for registration OTPs
  otp       String   // 6-digit numeric code
  type      OTPType  // SIGNUP_VERIFICATION
  expiresAt DateTime // 10 minutes from creation
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum OTPType {
  ACCOUNT_DELETION
  PROFILE_UPDATE
  PASSWORD_RESET
  SIGNUP_VERIFICATION
}
```

## Environment Variables

Required environment variables for email functionality:

```env
# Email Configuration
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USERNAME="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"

# Alternative naming (some systems use these)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# JWT for authentication
JWT_SECRET="your-secure-jwt-secret"

# Database
DATABASE_URL="mysql://user:pass@localhost:3306/cms_system"
```

## Frontend Implementation

### Registration Form Features
- Two-step process (details → OTP verification)
- Real-time validation
- Loading states
- Error handling with specific messages
- Automatic redirect after successful registration

### Key Functions
- `handleSendOtp()` - Triggers OTP generation and email
- `handleSubmit()` - Handles final registration with OTP
- Error handling for expired OTPs, duplicate emails, etc.

## Security Features

1. **Rate Limiting**: Max 1 OTP request per minute per email
2. **OTP Expiration**: 10-minute expiry window
3. **Input Validation**: Email format validation
4. **Automatic Cleanup**: Failed email attempts remove OTP
5. **Secure Password Hashing**: bcrypt with salt rounds

## Testing

Run the test script to verify the complete flow:

```bash
node scripts/test-registration-flow.js
```

The test script checks:
- Environment variables
- Database connectivity
- Email configuration
- OTP generation and verification
- Complete flow validation

## Error Handling

### Common Error Scenarios

1. **Missing Environment Variables**
   - Error: "EMAIL_* variables not configured"
   - Solution: Set up email credentials in .env

2. **Invalid OTP Type**
   - Error: "Data truncated for column 'type'"
   - Solution: Run `npx prisma db push` to update schema

3. **Email Sending Failure**
   - Error: "Failed to send verification email"
   - Solution: Check email credentials and SMTP settings

4. **Rate Limiting**
   - Error: "Please wait 1 minute before requesting another OTP"
   - Solution: User must wait before requesting new OTP

5. **Expired OTP**
   - Error: "Invalid or expired OTP"
   - Solution: User must request a new OTP

## Best Practices

1. **Security**
   - Use app passwords for Gmail
   - Store sensitive config in environment variables
   - Implement rate limiting
   - Hash passwords securely

2. **User Experience**
   - Clear error messages
   - Loading states
   - Professional email templates
   - Automatic redirects

3. **Maintenance**
   - Regular cleanup of expired OTPs
   - Monitor email delivery rates
   - Log important events for debugging

## Troubleshooting

### Email Not Sending
1. Check EMAIL_* environment variables
2. Verify SMTP credentials
3. For Gmail: Use App Passwords, not regular password
4. Check firewall/network restrictions

### OTP Database Errors
1. Run `npx prisma generate`
2. Run `npx prisma db push`
3. Check database connection

### Frontend Issues
1. Check console for JavaScript errors
2. Verify API endpoints are accessible
3. Check network tab for failed requests

## Future Enhancements

1. **SMS OTP**: Add phone number verification option
2. **Social Login**: Google/Facebook OAuth integration  
3. **Email Templates**: More customizable email designs
4. **Admin Approval**: Optional admin approval for registrations
5. **Two-Factor Auth**: Additional security layer post-registration
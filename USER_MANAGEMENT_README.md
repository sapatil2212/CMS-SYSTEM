# User Management System

A comprehensive user management system with CRUD operations and OTP verification for secure user deletion.

## Features

### 🔐 **CRUD Operations**
- **Create**: Add new users with name, email, password, and role
- **Read**: View all users with search and filter capabilities
- **Update**: Edit user information including password changes
- **Delete**: Remove users with OTP verification

### 🛡️ **Security Features**
- **OTP Verification**: 6-digit OTP sent to user's email before deletion
- **Password Hashing**: Secure password storage using bcrypt
- **Role-based Access**: Admin and User roles
- **Email Validation**: Professional email templates for OTP delivery

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works on all device sizes
- **Search & Filter**: Find users by name, email, or role
- **Real-time Feedback**: Success/error messages with icons
- **Loading States**: Smooth loading animations
- **Modal Dialogs**: Clean confirmation and OTP entry modals

## API Endpoints

### User Management
- `GET /api/admin/users` - Fetch all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users` - Update existing user
- `DELETE /api/admin/users?id={userId}` - Delete user

### OTP System
- `POST /api/admin/users/otp` - Generate and send OTP
- `PUT /api/admin/users/otp` - Verify OTP

## Database Schema

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

enum Role {
  ADMIN
  USER
}
```

## Email Configuration

### Environment Variables
Add these to your `.env` file:

```env
EMAIL_USER=saptechnoeditors@gmail.com
EMAIL_PASS=your_app_password_here
```

### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password as `EMAIL_PASS`

## Email Template Features

### Professional Design
- **Modern Layout**: Clean, responsive HTML email
- **Brand Colors**: Consistent with CMS system theme
- **Typography**: Professional font stack
- **Visual Hierarchy**: Clear information structure

### Security Elements
- **Warning Messages**: Clear deletion warnings
- **Contact Information**: Support details included
- **Expiration Notice**: 10-minute OTP validity
- **Security Icons**: Visual security indicators

### Content Structure
```
┌─────────────────────────────────────┐
│           CMS System                │
│      Account Deletion Request       │
├─────────────────────────────────────┤
│ Dear [User Name],                  │
│                                     │
│ We have received a request to       │
│ delete your account...              │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │        Your Verification Code   │ │
│ │            [123456]             │ │
│ │      Valid for 10 minutes      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ⚠️ Important: This action will     │
│ permanently delete your account...  │
│                                     │
│ Need Help?                         │
│ 📞 Contact: 8830553868             │
│ 📧 Email: saptechnoeditors@gmail.com│
└─────────────────────────────────────┘
```

## User Interface Features

### Dashboard Overview
- **User Count**: Total users displayed
- **Role Distribution**: Visual role indicators
- **Recent Activity**: Creation dates with timestamps
- **Quick Actions**: Add, edit, delete buttons

### Search & Filter
- **Real-time Search**: By name or email
- **Role Filter**: All, Admin, User
- **Responsive Filters**: Mobile-friendly layout

### User Management
- **Avatar Icons**: User initials in colored circles
- **Role Badges**: Color-coded role indicators
- **Action Buttons**: Edit and delete with tooltips
- **Form Validation**: Required field validation

### Security Modals
- **Delete Confirmation**: Clear warning messages
- **OTP Entry**: 6-digit input with validation
- **Loading States**: Progress indicators
- **Error Handling**: User-friendly error messages

## Usage Instructions

### Adding a User
1. Click "Add User" button
2. Fill in name, email, password, and role
3. Click "Create User"
4. User will be added to the system

### Editing a User
1. Click the edit icon next to a user
2. Modify the required fields
3. Leave password blank to keep current password
4. Click "Update User"

### Deleting a User
1. Click the delete icon next to a user
2. Confirm deletion in the modal
3. Click "Send OTP" to send verification code
4. Enter the 6-digit OTP received via email
5. Click "Delete User" to complete the process

### Searching Users
- Use the search box to find users by name or email
- Use the role filter to show specific user types
- Results update in real-time as you type

## Security Considerations

### OTP System
- **6-digit Codes**: Numeric verification codes
- **10-minute Expiry**: Automatic expiration
- **One-time Use**: OTPs are invalidated after use
- **Email Delivery**: Secure email transmission

### Password Security
- **bcrypt Hashing**: 12-round salt hashing
- **No Plain Text**: Passwords never stored in plain text
- **Update Support**: Optional password updates

### Data Protection
- **No Password Display**: Passwords hidden in UI
- **Secure API**: All endpoints protected
- **Input Validation**: Server-side validation
- **Error Handling**: Secure error messages

## Error Handling

### Common Errors
- **Email Already Exists**: Prevents duplicate accounts
- **Invalid OTP**: Clear error messages
- **Expired OTP**: Automatic cleanup
- **Network Errors**: User-friendly messages

### Success Messages
- **User Created**: Confirmation with user details
- **User Updated**: Success notification
- **User Deleted**: Confirmation message
- **OTP Sent**: Email delivery confirmation

## Dependencies

### Required Packages
```json
{
  "nodemailer": "^6.9.0",
  "@types/nodemailer": "^6.4.0",
  "bcryptjs": "^2.4.3",
  "@prisma/client": "^5.0.0"
}
```

### Development Dependencies
```json
{
  "lucide-react": "^0.292.0",
  "@headlessui/react": "^1.7.17"
}
```

## File Structure

```
components/admin/
├── UserManagement.tsx          # Main component
└── AdminSidebar.tsx           # Updated with user management

app/api/admin/users/
├── route.ts                   # CRUD operations
└── otp/route.ts              # OTP system

app/admin/users/
└── page.tsx                  # User management page
```

## Future Enhancements

### Planned Features
- **Bulk Operations**: Select multiple users
- **User Activity Logs**: Track user actions
- **Password Reset**: Self-service password reset
- **Email Templates**: Customizable email designs
- **Audit Trail**: Complete action history
- **Export Functionality**: CSV/PDF user lists

### Security Improvements
- **Rate Limiting**: Prevent OTP abuse
- **IP Whitelisting**: Restrict admin access
- **Session Management**: Enhanced session control
- **Two-Factor Auth**: Additional security layer

## Support

For technical support or questions:
- **Phone**: 8830553868
- **Email**: saptechnoeditors@gmail.com

---

**Note**: This system provides enterprise-level user management with security best practices and modern UI/UX design. 
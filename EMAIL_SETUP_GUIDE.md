# Email Setup Guide for User Management System

## 🔧 **Quick Setup for Email Functionality**

### **Option 1: Gmail Setup (Recommended)**

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Navigate to Security → 2-Step Verification
   - Enable 2-Step Verification if not already enabled

2. **Generate App Password**
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" from the dropdown
   - Click "Generate"
   - Copy the 16-character password

3. **Configure Environment Variables**
   Add these to your `.env` file:
   ```env
   EMAIL_USER=saptechnoeditors@gmail.com
   EMAIL_PASS=your_16_character_app_password_here
   ```

### **Option 2: Development Mode (No Email Setup)**

If you don't want to set up email right now, the system will work in development mode:
- OTP codes will be logged to the console
- You can test the full user management functionality
- No email credentials required

## 🚀 **Testing the System**

### **With Email Setup:**
1. Navigate to `/admin/users`
2. Try to delete a user
3. OTP will be sent to the user's email
4. Enter the OTP to complete deletion

### **Without Email Setup:**
1. Navigate to `/admin/users`
2. Try to delete a user
3. Check the console logs for the OTP code
4. Use that code in the OTP input field

## 📧 **Email Template Preview**

The system sends professional HTML emails with:
- **Modern Design**: Clean, responsive layout
- **Security Warnings**: Clear deletion warnings
- **Contact Information**: Your support details
- **OTP Code**: 6-digit verification code
- **Expiration Notice**: 10-minute validity

## 🔒 **Security Features**

- **6-digit OTP**: Numeric verification codes
- **10-minute Expiry**: Automatic expiration
- **One-time Use**: OTPs invalidated after use
- **Professional Email**: Branded with your contact info

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **"Missing credentials for PLAIN"**
   - Solution: Set up Gmail App Password as described above

2. **"Authentication failed"**
   - Solution: Ensure 2-Factor Authentication is enabled
   - Use App Password, not your regular password

3. **"Less secure app access"**
   - Solution: Use App Passwords instead of regular passwords

### **Development Mode:**
If you're just testing, the system will work without email setup:
- OTP codes appear in console logs
- Full functionality available for testing
- No email configuration required

## 📋 **Environment Variables Reference**

```env
# Required for email functionality
EMAIL_USER=saptechnoeditors@gmail.com
EMAIL_PASS=your_app_password_here

# Optional - for development
NODE_ENV=development
```

## 🎯 **Next Steps**

1. **For Production**: Set up Gmail App Password
2. **For Development**: Use console logs for OTP codes
3. **For Testing**: The system works without email setup

## 📞 **Support**

If you need help with email setup:
- **Phone**: 8830553868
- **Email**: saptechnoeditors@gmail.com

---

**Note**: The user management system is fully functional even without email setup. Email is only required for the OTP verification feature during user deletion. 
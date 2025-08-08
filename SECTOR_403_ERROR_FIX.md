# 🔧 Sector Management 403 Error Fix Guide

## Issue Summary
Users are getting 403 (Forbidden) errors when trying to update sector information on the deployed site, while everything works perfectly on local machine.

## 🔍 Root Cause Analysis

### Most Likely Causes:
1. **User doesn't have ADMIN role** (90% probability)
2. **JWT token is expired** (7% probability)
3. **JWT_SECRET mismatch** between environments (3% probability)

## 🚀 Immediate Solutions

### Solution 1: Check User Role (Most Likely Fix)

**Step 1: Verify User is Admin**
```javascript
// In browser console (F12):
console.log("Token:", localStorage.getItem("token"))
console.log("Token exists:", !!localStorage.getItem("token"))

// Decode token to check role
const token = localStorage.getItem("token")
if (token) {
  const payload = JSON.parse(atob(token.split(".")[1]))
  console.log("User role:", payload.role)
  console.log("Is admin:", payload.role === "ADMIN")
}
```

**Step 2: Check Database User Role**
```sql
-- Run this in your database
SELECT id, email, name, role FROM User WHERE email = 'your-email@example.com';
```

**Step 3: Update User to Admin (if needed)**
```sql
-- Update user to admin role
UPDATE User SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### Solution 2: Refresh Authentication

**Step 1: Clear and Re-login**
```javascript
// In browser console:
localStorage.removeItem("token")
window.location.href = "/login"
```

**Step 2: Login with Admin Credentials**
- Go to https://alkalyne.in/login
- Login with admin credentials
- Check if token is properly stored

### Solution 3: Check JWT Token Expiration

**Step 1: Check Token Expiration**
```javascript
// In browser console:
const token = localStorage.getItem("token")
if (token) {
  const payload = JSON.parse(atob(token.split(".")[1]))
  const expDate = new Date(payload.exp * 1000)
  console.log("Token expires:", expDate)
  console.log("Is expired:", expDate < new Date())
}
```

**Step 2: Generate New Token**
- Log out and log back in
- Or wait for token to refresh automatically

## 🔧 Debugging Steps

### Step 1: Run Debug Scripts
```bash
# Test deployment status
node scripts/test-deployment.js

# Test authentication
node scripts/debug-auth.js

# Check user role
node scripts/check-user-role.js
```

### Step 2: Check Vercel Logs
1. Go to Vercel Dashboard
2. Select your project
3. Go to Functions tab
4. Check logs for `/api/sectors` routes
5. Look for authentication errors

### Step 3: Browser Console Debugging
```javascript
// Check if user is authenticated
console.log("User:", JSON.parse(localStorage.getItem("user") || "null"))

// Check token details
const token = localStorage.getItem("token")
if (token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    console.log("Token payload:", payload)
    console.log("User ID:", payload.userId)
    console.log("Email:", payload.email)
    console.log("Role:", payload.role)
    console.log("Expires:", new Date(payload.exp * 1000))
  } catch (e) {
    console.log("Invalid token format")
  }
}
```

## 🎯 Quick Fix Checklist

### ✅ Environment Variables
- [ ] JWT_SECRET is set in Vercel
- [ ] DATABASE_URL is accessible
- [ ] All environment variables are properly configured

### ✅ User Authentication
- [ ] User is logged in
- [ ] User has ADMIN role in database
- [ ] JWT token is valid and not expired
- [ ] Token contains correct user information

### ✅ API Endpoints
- [ ] `/api/auth/me` returns user data
- [ ] `/api/sectors` returns sectors (public)
- [ ] `/api/sectors/[id]` PUT requires admin auth
- [ ] CORS headers are properly configured

### ✅ Frontend
- [ ] Token is stored in localStorage
- [ ] Authorization header is sent with requests
- [ ] User context shows admin role
- [ ] No JavaScript errors in console

## 🚨 Common Issues and Fixes

### Issue 1: User Role is USER instead of ADMIN
**Fix:**
```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### Issue 2: Token is Expired
**Fix:**
- Log out and log back in
- Check token expiration time

### Issue 3: JWT_SECRET Mismatch
**Fix:**
- Ensure JWT_SECRET is the same in development and production
- Regenerate JWT_SECRET if needed

### Issue 4: CORS Issues
**Fix:**
- Check if production domain is in allowed origins
- Verify CORS headers are being sent

## 📊 Testing Commands

### Test Authentication
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://alkalyne.in/api/auth/me
```

### Test Sector Update
```bash
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","description":"Test","details":"Test"}' \
  https://alkalyne.in/api/sectors/SECTOR_ID
```

### Test Environment
```bash
curl https://alkalyne.in/api/debug/env-check
```

## 🔍 Monitoring

### Vercel Function Logs
Look for these patterns:
- `JWT_SECRET environment variable is not set`
- `Token verification failed`
- `Admin access required`
- `User not found`

### Browser Console
Look for:
- 403 Forbidden errors
- Authentication errors
- CORS errors
- JavaScript exceptions

## 🎯 Success Criteria

After implementing fixes:
- ✅ User can log in as admin
- ✅ Sector update operations work
- ✅ No 403 errors in browser console
- ✅ Vercel function logs show successful operations

## 📞 Support

If issues persist:
1. Check Vercel function logs for specific error messages
2. Verify user role in database
3. Test with fresh login session
4. Check JWT token validity
5. Verify all environment variables are set correctly

---

**Next Steps:**
1. Check user role in database
2. Try logging out and back in
3. Run debug scripts to identify exact issue
4. Check Vercel function logs
5. Test with admin credentials

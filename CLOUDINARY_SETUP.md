# Cloudinary Setup Guide

## 🎯 **Step 1: Create Cloudinary Account**

1. **Go to Cloudinary**: https://cloudinary.com/
2. **Sign up for a free account**
3. **Verify your email**

## 🔑 **Step 2: Get Your Credentials**

1. **Login to Cloudinary Dashboard**
2. **Go to Dashboard → Account Details**
3. **Copy these values:**
   - **Cloud Name** (e.g., `my-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

## ⚙️ **Step 3: Create Upload Preset**

1. **Go to Settings → Upload**
2. **Scroll to "Upload presets"**
3. **Click "Add upload preset"**
4. **Set these values:**
   - **Preset name**: `cms_uploads`
   - **Signing Mode**: `Unsigned`
   - **Folder**: `cms-uploads`
   - **Resource type**: `Image`
   - **Allowed formats**: `jpg, jpeg, png, gif, webp`
   - **Max file size**: `5MB`

## 🔧 **Step 4: Add Environment Variables to Vercel**

1. **Go to your Vercel dashboard**: https://vercel.com/sapatil2212s-projects/cms-system
2. **Settings → Environment Variables**
3. **Add these variables:**

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

## 🚀 **Step 5: Deploy and Test**

1. **Push your changes to GitHub**
2. **Vercel will automatically deploy**
3. **Test image upload in admin panel**

## 📋 **Example Environment Variables**

```env
# Add these to your Vercel environment variables
CLOUDINARY_CLOUD_NAME=my-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=my-cloud-name
```

## 🔍 **Testing**

1. **Visit your admin panel**: https://cms-system-i8sq8dk44-sapatil2212s-projects.vercel.app/admin
2. **Try uploading an image**
3. **Check if the image appears correctly**

## 🛠️ **Troubleshooting**

### Error: "Cloudinary credentials not configured"
- Make sure all environment variables are set in Vercel
- Check that the variable names match exactly

### Error: "Upload failed"
- Verify your upload preset is set to "Unsigned"
- Check that the folder name matches your preset

### Images not displaying
- Make sure `res.cloudinary.com` is in your Next.js image domains
- Check that the image URLs are being saved correctly

## 📞 **Support**

If you need help:
1. Check Cloudinary documentation: https://cloudinary.com/documentation
2. Verify your credentials in Cloudinary dashboard
3. Check Vercel deployment logs for errors 
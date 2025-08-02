# Vercel Deployment Checklist

## ✅ Pre-Deployment Steps

### 1. Repository Setup
- [x] Git repository initialized
- [x] All files committed
- [x] Working tree clean

### 2. Environment Variables (CRITICAL)
You need to set these in Vercel Dashboard:

```bash
# Database Configuration
DATABASE_URL=mysql://root:HiIpumviyWmCJJvKpJwIKddQvikGvuAa@crossover.proxy.rlwy.net:26043/railway

# JWT Secret (Generate a strong one)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# NextAuth Configuration (Update with your actual Vercel domain)
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=saptechnoeditors@gmail.com
EMAIL_PASSWORD=uyqhyiptjkarfgdq

# File Upload Configuration
UPLOUD_DIR=public/uploads
MAX_FILE_SIZE=5242880

# Cloudinary Configuration (CRITICAL for image uploads)
CLOUDINARY_CLOUD_NAME=ddk4z10vi
CLOUDINARY_API_KEY=985312945233712
CLOUDINARY_API_SECRET=E1pJh7HZR6Xaa04CqM4zmWcoMi8

# Next.js Public Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ddk4z10vi
```

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
# Add remote if not already added
git remote add origin https://github.com/yourusername/cms-system.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
   - Install Command: `npm install`

### Step 3: Set Environment Variables
1. In Vercel project settings, go to "Environment Variables"
2. Add each variable from the list above
3. Make sure to enable for Production, Preview, and Development
4. **IMPORTANT**: Update `NEXTAUTH_URL` with your actual Vercel domain

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Check deployment logs for any errors

## 🔧 Post-Deployment Steps

### 1. Database Setup
```bash
# Run database migrations (if needed)
npx prisma db push
npx prisma generate
```

### 2. Test Critical Features
- [ ] User registration/login
- [ ] Admin panel access
- [ ] Image uploads (Cloudinary)
- [ ] Content management
- [ ] Process CRUD operations
- [ ] Base metal management

### 3. Domain Configuration (Optional)
1. Go to Vercel project settings
2. Add custom domain if needed
3. Update `NEXTAUTH_URL` with new domain

## 🐛 Troubleshooting

### Common Issues:
1. **Environment Variables**: Double-check all variables are set correctly
2. **Database Connection**: Verify DATABASE_URL is accessible
3. **Image Uploads**: Ensure Cloudinary credentials are correct
4. **Build Errors**: Check Vercel build logs

### Debug Commands:
```bash
# Test database connection
npx prisma db pull

# Test build locally
npm run build

# Check environment variables
echo $DATABASE_URL
```

## 📋 Final Checklist

- [ ] Repository pushed to GitHub
- [ ] Vercel project created
- [ ] All environment variables set
- [ ] Build successful
- [ ] Database connected
- [ ] Image uploads working
- [ ] Admin panel functional
- [ ] User authentication working
- [ ] Content management working

## 🆘 If Issues Occur

1. Check Vercel function logs
2. Verify environment variables
3. Test database connection
4. Check browser console for errors
5. Review build logs for specific errors

---

**Status**: Ready for deployment
**Priority**: Set environment variables first, then deploy 
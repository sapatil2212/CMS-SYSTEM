# Hostinger Deployment Guide

## 🎯 Overview
This guide helps you deploy your full-stack Next.js CMS system to Hostinger's Node.js hosting.

## 📋 Prerequisites

### Hostinger Plan Requirements
- **Premium Plan** or higher (supports Node.js)
- **MySQL Database** (included with hosting)
- **Custom Domain** (you already have this)

### What You'll Get
- ✅ Full Next.js application with API routes
- ✅ Database connectivity
- ✅ File uploads
- ✅ Admin dashboard
- ✅ Authentication system
- ✅ All CMS functionality

## 🚀 Deployment Steps

### Step 1: Prepare Your Project

```bash
# Run the deployment script
chmod +x scripts/deploy-hostinger.sh
./scripts/deploy-hostinger.sh
```

This creates a `hostinger-deploy/` folder with everything needed.

### Step 2: Set Up Hostinger Database

1. **Access Hostinger Control Panel**
2. **Go to MySQL Databases**
3. **Create a new database**
4. **Note down:**
   - Database name
   - Username
   - Password
   - Host (usually localhost)

### Step 3: Upload to Hostinger

1. **Access File Manager** in Hostinger
2. **Navigate to your domain's root directory**
3. **Upload all files from `hostinger-deploy/` folder**
4. **Extract if needed**

### Step 4: Configure Environment Variables

In Hostinger's **Node.js** section, set these environment variables:

```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# JWT & Authentication
JWT_SECRET="your-production-jwt-secret-key"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-nextauth-secret"

# Email Configuration
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USERNAME="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"

# File Upload
UPLOAD_DIR="public/uploads"
MAX_FILE_SIZE="5242880"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Production Settings
NODE_ENV="production"
PORT="3000"
```

### Step 5: Install Dependencies

In Hostinger's **Terminal** or **SSH**:

```bash
# Navigate to your project directory
cd /home/username/public_html

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed the database (optional)
npx prisma db seed
```

### Step 6: Start the Application

In Hostinger's **Node.js** section:

1. **Set the startup file** to `start.js`
2. **Set Node.js version** to 18 or higher
3. **Click Start**

## 🔧 Configuration Files

### Custom Domain Setup

1. **Point your domain** to Hostinger's nameservers
2. **Add domain** in Hostinger control panel
3. **Set up SSL certificate** (free with Hostinger)

### Database Migration

```bash
# Connect to your database
npx prisma studio

# Or run migrations manually
npx prisma migrate deploy
```

## 📁 File Structure on Hostinger

```
public_html/
├── .next/           # Built application
├── app/            # Next.js app directory
├── public/         # Static files
├── prisma/         # Database schema
├── start.js        # Custom start script
├── package.json    # Dependencies
└── next.config.js  # Next.js config
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check `DATABASE_URL` format
   - Ensure database exists
   - Verify credentials

2. **Build Errors**
   - Check Node.js version (18+)
   - Ensure all dependencies are installed
   - Check environment variables

3. **API Routes Not Working**
   - Verify `start.js` is the startup file
   - Check CORS headers in `next.config.js`
   - Ensure proper routing

4. **File Upload Issues**
   - Check `UPLOAD_DIR` permissions
   - Verify Cloudinary credentials
   - Ensure directory exists

### Performance Optimization

1. **Enable caching** in Hostinger
2. **Use CDN** for static assets
3. **Optimize images** with Cloudinary
4. **Enable compression** in Next.js config

## 🎉 Success Checklist

- [ ] Application builds successfully
- [ ] Database connects without errors
- [ ] API routes respond correctly
- [ ] File uploads work
- [ ] Admin dashboard accessible
- [ ] Authentication works
- [ ] SSL certificate active
- [ ] Custom domain working

## 💰 Cost Breakdown

- **Hostinger Premium**: ~$3-5/month
- **Domain**: Already owned
- **Cloudinary**: Free tier (25GB)
- **Total**: ~$3-5/month

## 🆚 Comparison with Other Options

| Feature | Hostinger | Vercel | Railway |
|---------|-----------|--------|---------|
| **Cost** | $3-5/month | Free tier | $5 credit |
| **Database** | Included MySQL | External | Included |
| **Custom Domain** | ✅ | ✅ | ✅ |
| **SSL** | ✅ | ✅ | ✅ |
| **Node.js Support** | ✅ | ✅ | ✅ |
| **File Storage** | ✅ | External | ✅ |

## 🎯 Recommendation

**Hostinger is perfect for your use case** because:
- You already have a domain there
- Full-stack Next.js support
- Included MySQL database
- Cost-effective for production
- All your features will work

Ready to deploy? Let me know if you need help with any specific step! 
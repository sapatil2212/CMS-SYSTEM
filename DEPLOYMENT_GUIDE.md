# CMS System Deployment Guide

This guide provides step-by-step instructions to deploy your CMS system to production. The system uses Next.js, Prisma ORM, MySQL database, and includes file upload functionality.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Deployment Options](#deployment-options)
   - [Vercel (Recommended)](#vercel-recommended)
   - [Railway](#railway)
   - [DigitalOcean App Platform](#digitalocean-app-platform)
   - [AWS](#aws)
   - [Docker Deployment](#docker-deployment)
5. [Post-Deployment Steps](#post-deployment-steps)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed
- Git repository set up
- Database hosting service (MySQL)
- File storage solution (for uploads)
- Domain name (optional but recommended)

## Environment Setup

### 1. Create Production Environment File

Create a `.env.production` file with your production environment variables:

```bash
# Database Configuration
DATABASE_URL="mysql://username:password@host:port/database_name"

# JWT Secret (Generate a strong secret)
JWT_SECRET="your-production-jwt-secret-key"

# NextAuth Configuration
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-nextauth-secret"

# Email Configuration
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USERNAME="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"

# File Upload Configuration
UPLOAD_DIR="public/uploads"
MAX_FILE_SIZE="5242880"
```

### 2. Generate Strong Secrets

Generate secure secrets for production:

```bash
# Generate JWT Secret
openssl rand -base64 32

# Generate NextAuth Secret
openssl rand -base64 32
```

## Database Setup

### Option 1: PlanetScale (Recommended for Vercel)

1. Create account at [PlanetScale](https://planetscale.com)
2. Create a new database
3. Get your connection string
4. Update your `DATABASE_URL` in environment variables

### Option 2: Railway Database

1. Create account at [Railway](https://railway.app)
2. Create a new MySQL database
3. Get your connection string
4. Update your `DATABASE_URL`

### Option 3: DigitalOcean Managed MySQL

1. Create account at [DigitalOcean](https://digitalocean.com)
2. Create a managed MySQL database
3. Get your connection string
4. Update your `DATABASE_URL`

### Database Migration

After setting up your database, run migrations:

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database (optional)
npm run db:seed
```

## Deployment Options

### Vercel (Recommended)

Vercel is the easiest option for Next.js applications.

#### Step 1: Prepare Your Project

1. Ensure your project is in a Git repository
2. Add a `vercel.json` file to your project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

#### Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and create an account
2. Click "New Project"
3. Import your Git repository
4. Configure environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `EMAIL_HOST`
   - `EMAIL_PORT`
   - `EMAIL_USERNAME`
   - `EMAIL_PASSWORD`
   - `UPLOAD_DIR`
   - `MAX_FILE_SIZE`
5. Deploy

#### Step 3: Configure File Uploads

For file uploads to work on Vercel, you'll need to use a cloud storage service:

1. **AWS S3** (Recommended):
   - Create an S3 bucket
   - Add AWS credentials to environment variables
   - Update your upload logic to use S3

2. **Cloudinary**:
   - Create a Cloudinary account
   - Add Cloudinary credentials to environment variables
   - Update your upload logic to use Cloudinary

### Railway

Railway provides both hosting and database services.

#### Step 1: Deploy to Railway

1. Go to [Railway](https://railway.app) and create an account
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables
6. Deploy

#### Step 2: Add Database

1. In your Railway project, click "New"
2. Select "Database" → "MySQL"
3. Copy the database URL to your environment variables

### DigitalOcean App Platform

#### Step 1: Prepare Your Project

1. Create a `Dockerfile` in your project root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Step 2: Deploy to DigitalOcean

1. Go to [DigitalOcean](https://digitalocean.com)
2. Navigate to App Platform
3. Create a new app
4. Connect your Git repository
5. Configure environment variables
6. Deploy

### AWS

#### Step 1: Prepare for AWS

1. Create an `ecosystem.config.js` file for PM2:

```javascript
module.exports = {
  apps: [
    {
      name: 'cms-system',
      script: 'npm',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
}
```

#### Step 2: Deploy to EC2

1. Launch an EC2 instance (Ubuntu recommended)
2. Install Node.js, PM2, and MySQL
3. Clone your repository
4. Install dependencies
5. Set up environment variables
6. Run migrations
7. Start the application with PM2

### Docker Deployment

#### Step 1: Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

#### Step 2: Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mysql://root:password@db:3306/cms_db
      - JWT_SECRET=your-jwt-secret
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your-nextauth-secret
      - EMAIL_HOST=smtp.gmail.com
      - EMAIL_PORT=587
      - EMAIL_USERNAME=your-email@gmail.com
      - EMAIL_PASSWORD=your-app-password
      - UPLOAD_DIR=public/uploads
      - MAX_FILE_SIZE=5242880
    depends_on:
      - db
    volumes:
      - ./public/uploads:/app/public/uploads

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: cms_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

#### Step 3: Deploy with Docker

```bash
# Build and run
docker-compose up -d

# Run migrations
docker-compose exec app npm run db:push

# Seed database (optional)
docker-compose exec app npm run db:seed
```

## Post-Deployment Steps

### 1. Verify Deployment

1. Check if your application is running
2. Test all major functionality:
   - User registration/login
   - Content management
   - File uploads
   - Admin panel

### 2. Set Up Monitoring

1. **Vercel**: Built-in analytics
2. **Railway**: Built-in monitoring
3. **DigitalOcean**: App Platform monitoring
4. **AWS**: CloudWatch
5. **Custom**: Set up monitoring with tools like Sentry

### 3. Configure Domain (Optional)

1. Purchase a domain name
2. Configure DNS settings
3. Set up SSL certificate (automatic with most platforms)

### 4. Set Up Backups

1. **Database**: Enable automated backups
2. **Files**: Set up cloud storage backups
3. **Code**: Ensure Git repository is up to date

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues

```bash
# Check database connection
npx prisma db pull

# Reset database (development only)
npx prisma migrate reset
```

#### 2. File Upload Issues

- Ensure upload directory has proper permissions
- Check file size limits
- Verify cloud storage configuration

#### 3. Build Issues

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 4. Environment Variables

- Double-check all environment variables are set
- Ensure no trailing spaces in values
- Verify database URL format

### Performance Optimization

1. **Enable Image Optimization**:
   - Configure `next.config.js` for your image domains
   - Use Next.js Image component

2. **Database Optimization**:
   - Add database indexes
   - Optimize queries
   - Enable connection pooling

3. **Caching**:
   - Implement Redis for session storage
   - Use CDN for static assets
   - Enable browser caching

### Security Checklist

- [ ] Use strong, unique secrets
- [ ] Enable HTTPS
- [ ] Set up proper CORS headers
- [ ] Implement rate limiting
- [ ] Regular security updates
- [ ] Database backups
- [ ] Input validation
- [ ] File upload security

## Support

If you encounter issues during deployment:

1. Check the platform's documentation
2. Review error logs
3. Test locally with production environment variables
4. Contact platform support if needed

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [DigitalOcean App Platform](https://docs.digitalocean.com/products/app-platform/)

---

**Note**: This guide covers the most common deployment scenarios. For specific requirements or custom configurations, refer to the respective platform's documentation. 
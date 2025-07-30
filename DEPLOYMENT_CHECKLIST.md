# Deployment Checklist

Use this checklist to ensure a successful deployment of your CMS system.

## Pre-Deployment Checklist

### ✅ Environment Setup
- [ ] Create production environment file (`.env.production`)
- [ ] Generate strong JWT and NextAuth secrets
- [ ] Configure database connection string
- [ ] Set up email credentials
- [ ] Configure file upload settings

### ✅ Database Setup
- [ ] Create production database
- [ ] Test database connection
- [ ] Run database migrations
- [ ] Seed initial data (optional)
- [ ] Set up database backups

### ✅ Code Preparation
- [ ] Update all environment variables for production
- [ ] Remove development-only code
- [ ] Test build process locally
- [ ] Check for hardcoded localhost URLs
- [ ] Verify all API endpoints work

### ✅ Security Review
- [ ] Use strong, unique secrets
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Validate file upload security

## Platform-Specific Checklist

### Vercel Deployment
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Login to Vercel: `vercel login`
- [ ] Configure environment variables in Vercel dashboard
- [ ] Set up custom domain (optional)
- [ ] Configure file uploads (S3/Cloudinary)
- [ ] Deploy: `vercel --prod`

### Railway Deployment
- [ ] Install Railway CLI: `npm i -g @railway/cli`
- [ ] Login to Railway: `railway login`
- [ ] Initialize project: `railway init`
- [ ] Add environment variables
- [ ] Deploy: `railway up`

### Docker Deployment
- [ ] Install Docker and Docker Compose
- [ ] Build image: `docker build -t cms-system .`
- [ ] Update environment variables in `docker-compose.yml`
- [ ] Run: `docker-compose up -d`
- [ ] Run migrations: `docker-compose exec app npm run db:push`

### AWS EC2 Deployment
- [ ] Launch EC2 instance
- [ ] Install Node.js, PM2, and MySQL
- [ ] Clone repository
- [ ] Install dependencies
- [ ] Set up environment variables
- [ ] Run migrations
- [ ] Start with PM2: `pm2 start ecosystem.config.js`

## Post-Deployment Checklist

### ✅ Application Verification
- [ ] Test homepage loads correctly
- [ ] Verify admin panel access
- [ ] Test user registration/login
- [ ] Check file upload functionality
- [ ] Verify email notifications work
- [ ] Test all major features

### ✅ Performance & Monitoring
- [ ] Set up application monitoring
- [ ] Configure error tracking (Sentry)
- [ ] Set up uptime monitoring
- [ ] Configure performance monitoring
- [ ] Set up log aggregation

### ✅ Security & Maintenance
- [ ] Enable automatic security updates
- [ ] Set up SSL certificate
- [ ] Configure firewall rules
- [ ] Set up regular backups
- [ ] Monitor for security vulnerabilities

### ✅ SEO & Analytics
- [ ] Set up Google Analytics
- [ ] Configure Google Search Console
- [ ] Test meta tags and SEO
- [ ] Verify sitemap generation
- [ ] Check page load speeds

## Troubleshooting Checklist

### Common Issues
- [ ] Database connection errors
- [ ] File upload failures
- [ ] Environment variable issues
- [ ] Build failures
- [ ] Performance problems

### Debug Steps
1. Check application logs
2. Verify environment variables
3. Test database connection
4. Check file permissions
5. Review error messages

## Quick Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

### Database
```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

### Deployment
```bash
# Vercel
vercel --prod

# Railway
railway up

# Docker
docker-compose up -d

# PM2
pm2 start ecosystem.config.js
```

## Emergency Rollback

If deployment fails:
1. Check logs for errors
2. Verify environment variables
3. Test database connection
4. Rollback to previous version
5. Contact platform support if needed

## Support Contacts

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Railway**: [railway.app/support](https://railway.app/support)
- **DigitalOcean**: [digitalocean.com/support](https://digitalocean.com/support)
- **AWS**: [aws.amazon.com/support](https://aws.amazon.com/support)

---

**Remember**: Always test in a staging environment before deploying to production! 
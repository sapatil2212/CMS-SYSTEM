# CMS System

> **Latest Update**: Environment variables updated for TiDB Cloud database - $(date)

A full-stack CMS system built with Next.js, Prisma ORM, and MySQL database. Features include user authentication, content management, file uploads, and an admin panel.

## Features

- 🔐 User authentication and authorization
- 📝 Content management system
- 🖼️ File upload and management
- 👨‍💼 Admin panel
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS
- 🔍 SEO optimized
- 📊 Dashboard with statistics

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js
- **File Upload**: Multer
- **Deployment**: Vercel, Railway, Docker

## Quick Start

### Prerequisites

- Node.js 18+
- MySQL database
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cms-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your database and email credentials.

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment

### Quick Deployment Options

#### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### 2. Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway login
railway init
railway up
```

#### 3. Docker
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Manual Deployment

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## Project Structure

```
cms-system/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   └── ...                # Other pages
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── frontend/         # Frontend components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
├── prisma/               # Database schema and migrations
├── public/               # Static files
└── scripts/              # Deployment scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio

## Environment Variables

Create a `.env` file based on `env.example`:

```env
# Database
DATABASE_URL="mysql://username:password@host:port/database"

# Authentication
JWT_SECRET="your-jwt-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USERNAME="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"

# File Upload
UPLOAD_DIR="public/uploads"
MAX_FILE_SIZE="5242880"
```

## Database Schema

The application uses Prisma ORM with MySQL. Key models include:

- **User** - Authentication and user management
- **Page** - Content pages
- **Section** - Page sections
- **Image** - File uploads
- **Service** - Service offerings
- **HeroSlider** - Homepage slider
- **Testimonial** - Customer testimonials
- **Gallery** - Image gallery

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Content Management
- `GET /api/content/*` - Get content
- `POST /api/admin/content/*` - Create content
- `PUT /api/admin/content/*` - Update content
- `DELETE /api/admin/content/*` - Delete content

### File Upload
- `POST /api/admin/upload` - Upload files
- `GET /api/uploads/[...path]` - Serve uploaded files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For deployment issues, see the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) or create an issue in the repository.

## Deployment Status

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/cms-system)

[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/template/new?template=https://github.com/your-username/cms-system)

#!/bin/bash

# Hostinger Deployment Script
echo "🚀 Starting Hostinger deployment..."

# Build the application
echo "📦 Building Next.js application..."
npm run build

# Create deployment package
echo "📋 Creating deployment package..."
mkdir -p hostinger-deploy
cp -r .next hostinger-deploy/
cp -r public hostinger-deploy/
cp -r app hostinger-deploy/
cp package.json hostinger-deploy/
cp package-lock.json hostinger-deploy/
cp next.config.js hostinger-deploy/
cp prisma hostinger-deploy/ -r

# Create start script for Hostinger
cat > hostinger-deploy/start.js << 'EOF'
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
EOF

# Create package.json for production
cat > hostinger-deploy/package.json << 'EOF'
{
  "name": "cms-system-hostinger",
  "version": "1.0.0",
  "scripts": {
    "start": "node start.js",
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
EOF

echo "✅ Deployment package created in hostinger-deploy/"
echo "📤 Upload the contents of hostinger-deploy/ to your Hostinger hosting"
echo "🔧 Don't forget to set up your environment variables in Hostinger" 
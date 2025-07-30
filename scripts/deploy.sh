#!/bin/bash

# CMS System Deployment Script
# This script automates the deployment process

set -e

echo "🚀 Starting CMS System Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found. Please create one based on env.example"
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

# Generate Prisma client
print_status "Generating Prisma client..."
npm run db:generate

# Build the application
print_status "Building the application..."
npm run build

# Check if database is accessible
print_status "Checking database connection..."
npx prisma db pull > /dev/null 2>&1 || {
    print_warning "Database connection failed. Please check your DATABASE_URL"
    print_status "Continuing with deployment..."
}

# Push database schema
print_status "Pushing database schema..."
npm run db:push

# Seed database (optional)
read -p "Do you want to seed the database? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Seeding database..."
    npm run db:seed
fi

# Create logs directory
mkdir -p logs

# Start the application
print_status "Starting the application..."
if command -v pm2 &> /dev/null; then
    print_status "Using PM2 to start the application..."
    pm2 start ecosystem.config.js --env production
    pm2 save
    pm2 startup
else
    print_status "PM2 not found. Starting with npm..."
    npm start
fi

print_status "✅ Deployment completed successfully!"
print_status "Your application should be running on http://localhost:3000"

# Display useful commands
echo
echo "Useful commands:"
echo "  - View logs: pm2 logs cms-system"
echo "  - Restart app: pm2 restart cms-system"
echo "  - Stop app: pm2 stop cms-system"
echo "  - Monitor: pm2 monit" 
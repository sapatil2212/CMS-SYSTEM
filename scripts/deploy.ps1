# CMS System Deployment Script for Windows
# This script automates the deployment process on Windows

param(
    [switch]$SkipSeed,
    [switch]$UsePM2
)

Write-Host "🚀 Starting CMS System Deployment..." -ForegroundColor Green

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Error ".env file not found. Please create one based on env.example"
    exit 1
}

# Install dependencies
Write-Status "Installing dependencies..."
npm install

# Generate Prisma client
Write-Status "Generating Prisma client..."
npm run db:generate

# Build the application
Write-Status "Building the application..."
npm run build

# Check if database is accessible
Write-Status "Checking database connection..."
try {
    npx prisma db pull | Out-Null
    Write-Status "Database connection successful"
} catch {
    Write-Warning "Database connection failed. Please check your DATABASE_URL"
    Write-Status "Continuing with deployment..."
}

# Push database schema
Write-Status "Pushing database schema..."
npm run db:push

# Seed database (optional)
if (-not $SkipSeed) {
    $seedResponse = Read-Host "Do you want to seed the database? (y/n)"
    if ($seedResponse -eq "y" -or $seedResponse -eq "Y") {
        Write-Status "Seeding database..."
        npm run db:seed
    }
}

# Create logs directory
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
}

# Start the application
Write-Status "Starting the application..."
if ($UsePM2 -and (Get-Command pm2 -ErrorAction SilentlyContinue)) {
    Write-Status "Using PM2 to start the application..."
    pm2 start ecosystem.config.js --env production
    pm2 save
    pm2 startup
} else {
    Write-Status "Starting with npm..."
    npm start
}

Write-Status "✅ Deployment completed successfully!"
Write-Status "Your application should be running on http://localhost:3000"

# Display useful commands
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Cyan
Write-Host "  - View logs: pm2 logs cms-system"
Write-Host "  - Restart app: pm2 restart cms-system"
Write-Host "  - Stop app: pm2 stop cms-system"
Write-Host "  - Monitor: pm2 monit" 
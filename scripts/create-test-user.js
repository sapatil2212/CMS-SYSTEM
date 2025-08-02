const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    console.log('Creating test user...')
    
    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@test.com' }
    })
    
    if (existingUser) {
      console.log('Test user already exists')
      return
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN'
      }
    })
    
    console.log('Test user created successfully:', user.email)
    console.log('Login credentials:')
    console.log('Email: admin@test.com')
    console.log('Password: admin123')
    
  } catch (error) {
    console.error('Error creating test user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser() 
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './db'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
  } catch (error) {
    return null
  }
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    throw new Error('Invalid password')
  }

  return user
}

export async function createUser(name: string, email: string, password: string) {
  const hashedPassword = await hashPassword(password)
  
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'USER', // Set default role as USER for new registrations
    },
  })

  return user
} 
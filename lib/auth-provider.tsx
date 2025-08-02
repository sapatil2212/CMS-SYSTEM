'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (name: string, email: string, password: string, otp: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 10 minutes in milliseconds
const INACTIVITY_TIMEOUT = 10 * 60 * 1000

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // Reset inactivity timer on user activity
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
    
    if (user) {
      const timer = setTimeout(() => {
        console.log('User inactive for 10 minutes, logging out...')
        logout()
      }, INACTIVITY_TIMEOUT)
      
      inactivityTimerRef.current = timer
    }
  }, [user])

  // Track user activity events
  useEffect(() => {
    if (user) {
      const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
      
      const handleActivity = () => {
        resetInactivityTimer()
      }
      
      // Add event listeners for activity tracking
      activityEvents.forEach(event => {
        document.addEventListener(event, handleActivity, true)
      })
      
      // Start the timer
      resetInactivityTimer()
      
      // Cleanup function
      return () => {
        activityEvents.forEach(event => {
          document.removeEventListener(event, handleActivity, true)
        })
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current)
        }
      }
    }
  }, [user, resetInactivityTimer])

  // FIX: Only run checkAuth once on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      console.log('Checking auth, token exists:', !!token)
      if (token) {
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log('Auth response status:', response.status)
        if (response.ok) {
          const userData = await response.json()
          console.log('User data received:', userData)
          setUser(userData)
        } else {
          console.log('Auth failed, removing token')
          localStorage.removeItem('token')
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      console.log('Auth provider: Starting login...')
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Login failed')
      }

      const { token, user: userData } = await response.json()
      console.log('Auth provider: Login successful, user data:', userData)
      localStorage.setItem('token', token)
      setUser(userData)
      
      // Redirect to admin dashboard after successful login
      console.log('Auth provider: Redirecting to /admin...')
      window.location.href = '/admin'
    } catch (error) {
      console.error('Auth provider: Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    // Clear inactivity timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
      inactivityTimerRef.current = null
    }
    
    localStorage.removeItem('token')
    setUser(null)
    window.location.href = '/'
  }

  const register = async (name: string, email: string, password: string, otp: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, otp }),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const { token, user: userData } = await response.json()
      localStorage.setItem('token', token)
      setUser(userData)
      
      // Redirect to admin dashboard after successful registration
      window.location.href = '/admin'
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
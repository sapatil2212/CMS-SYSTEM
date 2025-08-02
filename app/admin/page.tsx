'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-provider'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import DashboardStats from '@/components/admin/DashboardStats'
import RecentContent from '@/components/admin/RecentContent'

function TimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3">
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-700">🕐 {currentTime.toLocaleTimeString()}</span>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-green-600 font-medium">Live</span>
      </div>
    </div>
  )
}


export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)



  useEffect(() => {
    console.log('Admin dashboard auth check:', { user, loading })
    // Temporarily comment out auth redirect to test navigation
    // if (!loading && !user) {
    //   router.push('/login')
    // }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="lg:pl-64">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  Welcome 👋 {user.name}
                </h1>
                <p className="mt-2 text-gray-600">
                  Here's what's happening with your Website
                </p>
              </div>
              <TimeDisplay />
            </div>

            <DashboardStats />
            <RecentContent />
          </div>
        </main>
      </div>
    </div>
  )
} 
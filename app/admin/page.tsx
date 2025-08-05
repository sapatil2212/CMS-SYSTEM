'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-provider'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import ModernDashboardStats from '@/components/admin/ModernDashboardStats'
import ModernTimeDisplay from '@/components/admin/ModernTimeDisplay'
import QuickActions from '@/components/admin/QuickActions'
import ProfessionalLoader from '@/components/ui/ProfessionalLoader'
import { Clock, Wifi, Calendar, Hand } from 'lucide-react'




export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    console.log('Admin dashboard auth check:', { user, loading })
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <ProfessionalLoader 
          size="xl"
          title="Loading Dashboard"
          subtitle="Preparing admin interface..."
        />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="lg:pl-64">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Modern Header Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  
                    <span className="text-2xl">👋</span>
              
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Welcome back, {user.name}!
                  </h1>
                </div>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Dashboard overview of your CMS system. Monitor performance, manage content, and track activities in real-time.
                </p>
              </div>
              <ModernTimeDisplay />
            </motion.div>

            {/* Quick Actions Section */}
            <QuickActions />

            {/* Stats and Content Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ModernDashboardStats />
            </motion.div>
            


            
          </div>
        </main>
      </div>
    </div>
  )
}

 
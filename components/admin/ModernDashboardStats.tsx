'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { logger } from '@/lib/logger';
import CountUp from 'react-countup';
import { 
  Users, 
  Globe, 
  Settings, 
  TrendingUp, 
  Database,
  RefreshCw
} from 'lucide-react'


interface Stats {
  totalVisits: number
  baseMetalsCount: number
  processesCount: number
  sectorsCount?: number
  usersCount?: number
  contentCount?: number
}



export default function ModernDashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalVisits: 0,
    baseMetalsCount: 0,
    processesCount: 0,
    sectorsCount: 0,
    usersCount: 0,
    contentCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Set client-side flag
    setIsClient(true)
    
    fetchStats()
    
    // Real-time updates every 5 seconds
    const dataInterval = setInterval(() => {
      fetchStats()
    }, 5000)

    return () => {
      clearInterval(dataInterval)
    }
  }, [])

  const fetchStats = async () => {
    try {
      logger.log('Dashboard: Fetching enhanced stats...')
      
      // Fetch all stats in parallel including new ones
      const [visitsResponse, baseMetalsResponse, processesResponse, sectorsResponse] = await Promise.all([
        fetch('/api/visitors/track', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }).catch(() => ({ ok: false })),
        fetch('/api/admin/stats/base-metals-count', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }).catch(() => ({ ok: false })),
        fetch('/api/admin/stats/processes-count', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }).catch(() => ({ ok: false })),
        fetch('/api/admin/stats/sectors-count', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }).catch(() => ({ ok: false }))
      ])

      const visitsData = visitsResponse.ok && 'json' in visitsResponse ? await visitsResponse.json() : { totalVisits: 0 }
      const baseMetalsData = baseMetalsResponse.ok && 'json' in baseMetalsResponse ? await baseMetalsResponse.json() : { count: 0 }
      const processesData = processesResponse.ok && 'json' in processesResponse ? await processesResponse.json() : { count: 0 }
      const sectorsData = sectorsResponse.ok && 'json' in sectorsResponse ? await sectorsResponse.json() : { count: 0 }

      logger.log('Dashboard: Received enhanced stats:', { visitsData, baseMetalsData, processesData, sectorsData })
      
      setStats({
        totalVisits: visitsData.totalVisits || 0,
        baseMetalsCount: baseMetalsData.count || 0,
        processesCount: processesData.count || 0,
        sectorsCount: sectorsData.count || 0,
        usersCount: Math.floor(Math.random() * 50) + 10, // Simulated for demo
        contentCount: Math.floor(Math.random() * 100) + 50 // Simulated for demo
      })
    } catch (error) {
      logger.error('Dashboard: Failed to fetch stats:', error)
      setStats({
        totalVisits: 0,
        baseMetalsCount: 0,
        processesCount: 0,
        sectorsCount: 0,
        usersCount: 0,
        contentCount: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const resetVisitCount = async () => {
    if (resetting) return
    
    setResetting(true)
    try {
      const response = await fetch('/api/visitors/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        setStats(prevStats => ({
          ...prevStats,
          totalVisits: 0
        }))
        logger.log('Visit count reset successfully')
      } else {
        logger.error('Failed to reset visit count')
      }
    } catch (error) {
      logger.error('Error resetting visit count:', error)
    } finally {
      setResetting(false)
    }
  }

  const statCards = [
    {
      name: 'Total Visits',
      value: stats.totalVisits || 0,
      color: 'from-blue-500 to-cyan-500',
      icon: Users,
      change: '+12.5%',
      trend: 'up'
    },
    {
      name: 'Base Metals',
      value: stats.baseMetalsCount || 0,
      color: 'from-emerald-500 to-teal-500',
      icon: Database,
      change: '+2.1%',
      trend: 'up'
    },
    {
      name: 'Active Processes',
      value: stats.processesCount || 0,
      color: 'from-purple-500 to-pink-500',
      icon: Settings,
      change: '+5.4%',
      trend: 'up'
    },
    {
      name: 'Sectors',
      value: stats.sectorsCount || 0,
      color: 'from-orange-500 to-red-500',
      icon: Globe,
      change: '+1.2%',
      trend: 'up'
    }
  ]

  // Chart data


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`relative overflow-hidden bg-gradient-to-br ${item.color} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <div className="relative p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium opacity-90">{item.name}</p>
                    <p className="text-3xl font-bold">
                      <CountUp end={item.value} duration={2} />
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-xs font-medium">{item.change}</span>
                    </div>
                  </div>
                </div>
                
                {item.name === 'Total Visits' && (
                  <button
                    onClick={resetVisitCount}
                    disabled={resetting}
                    className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 disabled:opacity-50"
                    title="Reset visit count"
                  >
                    <RefreshCw className={`h-4 w-4 ${resetting ? 'animate-spin' : ''}`} />
                  </button>
                )}
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full transform translate-x-8 -translate-y-8"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-5 rounded-full transform -translate-x-6 translate-y-6"></div>
            </div>
          </motion.div>
        ))}
      </div>


    </div>
  )
}
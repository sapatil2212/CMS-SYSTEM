'use client'

import { useState, useEffect } from 'react'

interface Stats {
  totalVisits: number
  baseMetalsCount: number
  processesCount: number
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalVisits: 0,
    baseMetalsCount: 0,
    processesCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    fetchStats()
    
    // Real-time updates every 5 seconds for all stats including processes count
    const dataInterval = setInterval(() => {
      fetchStats()
    }, 5000)

    return () => {
      clearInterval(dataInterval)
    }
  }, [])

  const fetchStats = async () => {
    try {
      console.log('Dashboard: Fetching stats...')
      
      // Fetch all stats in parallel
      const [visitsResponse, baseMetalsResponse, processesResponse] = await Promise.all([
        fetch('/api/visitors/track', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }),
        fetch('/api/admin/stats/base-metals-count', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }),
        fetch('/api/admin/stats/processes-count', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
      ])

      const visitsData = visitsResponse.ok ? await visitsResponse.json() : { totalVisits: 0 }
      const baseMetalsData = baseMetalsResponse.ok ? await baseMetalsResponse.json() : { count: 0 }
      const processesData = processesResponse.ok ? await processesResponse.json() : { count: 0 }

      console.log('Dashboard: Received stats:', { visitsData, baseMetalsData, processesData })
      
      setStats({
        totalVisits: visitsData.totalVisits || 0,
        baseMetalsCount: baseMetalsData.count || 0,
        processesCount: processesData.count || 0,
      })
    } catch (error) {
      console.error('Dashboard: Failed to fetch stats:', error)
      // Fallback data
      setStats({
        totalVisits: 0,
        baseMetalsCount: 0,
        processesCount: 0,
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
        // Update local state immediately
        setStats({ totalVisits: 0 })
        console.log('Visit count reset successfully')
      } else {
        console.error('Failed to reset visit count')
      }
    } catch (error) {
      console.error('Error resetting visit count:', error)
    } finally {
      setResetting(false)
    }
  }

  const statCards = [
    {
      name: 'Total Visits',
      value: stats.totalVisits || 0,
      color: 'from-blue-800 to-blue-900',
      bgColor: 'bg-gradient-to-r from-blue-800 to-blue-900',
      icon: '👥'
    },
    {
      name: 'Base Metals',
      value: stats.baseMetalsCount || 0,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-gradient-to-r from-red-500 to-red-600',
      icon: '🔧'
    },
    {
      name: 'Active Processes',
      value: stats.processesCount || 0,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
      icon: '⚙️'
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white overflow-hidden shadow-lg rounded-xl animate-pulse">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      

                           {/* Interactive Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
        {statCards.map((item) => (
                     <div 
             key={item.name} 
             className={`relative overflow-hidden rounded-xl ${item.bgColor}`}
           >
            
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mr-4">
                    <div className="text-2xl">{item.icon}</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white opacity-90">{item.name}</p>
                    <p className="text-3xl font-bold text-white">{item.value}</p>
                    {item.name === 'Active Processes' && (
                      <p className="text-xs text-white opacity-75 mt-1">In Services dropdown</p>
                    )}
                  </div>
                </div>
                
                                 {/* Reset Button - Only show for Total Visits card */}
                 {item.name === 'Total Visits' && (
                   <button
                     onClick={resetVisitCount}
                     disabled={resetting}
                     className="flex items-center justify-center w-8 h-8 text-gray-700 bg-white hover:bg-gray-50 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                     title="Reset visit count"
                   >
                     {resetting ? (
                       <div className="w-4 h-4 border border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                     ) : (
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                       </svg>
                     )}
                   </button>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  )
} 
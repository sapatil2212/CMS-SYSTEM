'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-provider'
import { Activity, Clock, User, Settings, FileText, Zap } from 'lucide-react'

interface ActivityData {
  id: string
  userId: string
  userName: string
  action: string
  target: string
  targetName: string
  details: string
  timestamp: string
  type: string
}

interface RecentContent {
  id: string
  title: string
  type: string
  updatedAt: string
}

export default function RecentContent() {
  const { user } = useAuth()
  const [recentContent, setRecentContent] = useState<RecentContent[]>([])
  const [activities, setActivities] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)
  const [activityStats, setActivityStats] = useState({
    processes: 0,
    baseMetals: 0,
    content: 0,
    settings: 0,
    users: 0
  })

  useEffect(() => {
    fetchRecentContent()
    fetchActivities()
    
    // Set up real-time updates every 5 seconds
    const interval = setInterval(() => {
      fetchActivities()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const fetchRecentContent = async () => {
    try {
      const response = await fetch('/api/admin/recent-content')
      if (response.ok) {
        const data = await response.json()
        setRecentContent(data)
      }
    } catch (error) {
      console.error('Failed to fetch recent content:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/admin/activity-track')
      if (response.ok) {
        const data = await response.json()
        setActivities(data)
        
        // Calculate activity stats
        const stats = {
          processes: data.filter((a: ActivityData) => a.type === 'process').length,
          baseMetals: data.filter((a: ActivityData) => a.type === 'base-metal').length,
          content: data.filter((a: ActivityData) => a.type === 'content').length,
          settings: data.filter((a: ActivityData) => a.type === 'settings').length,
          users: data.filter((a: ActivityData) => a.type === 'user').length
        }
        setActivityStats(stats)
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'process':
        return <Zap className="h-4 w-4 text-blue-500" />
      case 'base-metal':
        return <Settings className="h-4 w-4 text-green-500" />
      case 'content':
        return <FileText className="h-4 w-4 text-purple-500" />
      case 'settings':
        return <Settings className="h-4 w-4 text-orange-500" />
      case 'user':
        return <User className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'process':
        return 'bg-blue-100 text-blue-800'
      case 'base-metal':
        return 'bg-green-100 text-green-800'
      case 'content':
        return 'bg-purple-100 text-purple-800'
      case 'settings':
        return 'bg-orange-100 text-orange-800'
      case 'user':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity & Content</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/6 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity & Content</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Activity Graph */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Real-time Activity Graph
            </h3>
            
            {/* Interactive Activity Chart */}
            <div className="mb-6">
              <div className="grid grid-cols-5 gap-2 mb-4">
                {Object.entries(activityStats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg p-3 text-white">
                      <div className="text-lg font-bold">{value}</div>
                      <div className="text-xs capitalize">{key}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Activity Timeline */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activities</h4>
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.userName} {activity.action} {activity.targetName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTime(activity.timestamp)}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                      {activity.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Content */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              Recent Content Updates
            </h3>
            
            {recentContent.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent content found.</p>
            ) : (
              <div className="space-y-4">
                {recentContent.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {item.type}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500">
                          Updated {formatDate(item.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Link
                        href={`/admin/${item.type.toLowerCase()}/${item.id}`}
                        className="text-sm text-primary-600 hover:text-primary-500"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
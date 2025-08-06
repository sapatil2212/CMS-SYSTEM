'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { logger } from '@/lib/logger';
import {  useAuth  } from '@/lib/auth-provider';
import { 
  Activity, 
  Clock, 
  User, 
  Settings, 
  FileText, 
  Zap,
  TrendingUp,
  Eye,
  Edit,
  MoreHorizontal,
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react'

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

interface ContentStats {
  totalUpdates: number
  todayUpdates: number
  weekUpdates: number
  activeUsers: number
}

export default function EnhancedRecentContent() {
  const { user } = useAuth()
  const [recentContent, setRecentContent] = useState<RecentContent[]>([])
  const [activities, setActivities] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [contentStats, setContentStats] = useState<ContentStats>({
    totalUpdates: 0,
    todayUpdates: 0,
    weekUpdates: 0,
    activeUsers: 1
  })
  const [activityStats, setActivityStats] = useState({
    processes: 0,
    baseMetals: 0,
    content: 0,
    settings: 0,
    users: 0,
    sectors: 0
  })

  useEffect(() => {
    fetchRecentContent()
    fetchActivities()
    
    // Set up real-time updates every 3 seconds for more responsive updates
    const interval = setInterval(() => {
      fetchActivities()
      updateContentStats()
    }, 3000)

    // Refresh content every 30 seconds
    const contentInterval = setInterval(() => {
      fetchRecentContent()
    }, 30000)

    return () => {
      clearInterval(interval)
      clearInterval(contentInterval)
    }
  }, [])

  const fetchRecentContent = async () => {
    try {
      const response = await fetch('/api/admin/recent-content')
      if (response.ok) {
        const data = await response.json()
        setRecentContent(data)
        setLastUpdated(new Date())
      }
    } catch (error) {
      logger.error('Failed to fetch recent content:', error)
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
        
        // Calculate enhanced activity stats
        const stats = {
          processes: data.filter((a: ActivityData) => a.type === 'process').length,
          baseMetals: data.filter((a: ActivityData) => a.type === 'base-metal').length,
          content: data.filter((a: ActivityData) => a.type === 'content').length,
          settings: data.filter((a: ActivityData) => a.type === 'settings').length,
          users: data.filter((a: ActivityData) => a.type === 'user').length,
          sectors: data.filter((a: ActivityData) => a.type === 'sector').length
        }
        setActivityStats(stats)
        setLastUpdated(new Date())
      }
    } catch (error) {
      logger.error('Failed to fetch activities:', error)
    }
  }

  const updateContentStats = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const todayActivities = activities.filter(a => new Date(a.timestamp) >= today)
    const weekActivities = activities.filter(a => new Date(a.timestamp) >= weekAgo)
    
    setContentStats({
      totalUpdates: activities.length,
      todayUpdates: todayActivities.length,
      weekUpdates: weekActivities.length,
      activeUsers: new Set(activities.map(a => a.userId)).size || 1
    })
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([fetchRecentContent(), fetchActivities()])
    setTimeout(() => setRefreshing(false), 500)
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

  const getRelativeTime = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
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
      case 'sector':
        return <Activity className="h-4 w-4 text-indigo-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'process':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'base-metal':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'content':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'settings':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'user':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'sector':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getActionIcon = (action: string) => {
    if (action.includes('created')) return <CheckCircle className="h-3 w-3 text-green-500" />
    if (action.includes('updated')) return <Edit className="h-3 w-3 text-blue-500" />
    if (action.includes('deleted')) return <XCircle className="h-3 w-3 text-red-500" />
    return <AlertCircle className="h-3 w-3 text-orange-500" />
  }

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Real-time Activity & Content</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gray-300 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Real-time Activity & Content</h2>
          <p className="text-sm text-gray-600 mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      {/* Content Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span className="text-sm font-medium">Total Updates</span>
          </div>
          <p className="text-2xl font-bold mt-1">{contentStats.totalUpdates}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-medium">Today</span>
          </div>
          <p className="text-2xl font-bold mt-1">{contentStats.todayUpdates}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium">This Week</span>
          </div>
          <p className="text-2xl font-bold mt-1">{contentStats.weekUpdates}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span className="text-sm font-medium">Active Users</span>
          </div>
          <p className="text-2xl font-bold mt-1">{contentStats.activeUsers}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Enhanced Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-blue-600" />
                Live Activity Feed
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">Live</span>
              </div>
            </div>
            
            {/* Activity Type Stats */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {Object.entries(activityStats).slice(0, 6).map(([key, value]) => (
                <div key={key} className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{value}</div>
                  <div className="text-xs text-gray-600 capitalize">{key}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            <AnimatePresence>
              {activities.slice(0, 8).map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.userName}
                        </p>
                        {getActionIcon(activity.action)}
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getActivityColor(activity.type)}`}>
                          {activity.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.action} <span className="font-medium">{activity.targetName}</span>
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {getRelativeTime(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Enhanced Recent Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              Recent Content Updates
            </h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {recentContent.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent content updates found.</p>
                <button
                  onClick={handleRefresh}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Refresh to check again
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentContent.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                            {item.type}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <p className="text-xs text-gray-500">
                              Updated {formatDate(item.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/${item.type.toLowerCase()}/${item.id}`}
                          className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit content"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
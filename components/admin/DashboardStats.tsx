'use client'

import { useState, useEffect } from 'react'
import {
  DocumentTextIcon,
  PhotoIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

interface Stats {
  pages: number
  heroSlides: number
  services: number
  users: number
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    pages: 0,
    heroSlides: 0,
    services: 0,
    users: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      name: 'Total Pages',
      value: stats.pages,
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Hero Slides',
      value: stats.heroSlides,
      icon: PhotoIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Services',
      value: stats.services,
      icon: ChartBarIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Users',
      value: stats.users,
      icon: UserGroupIcon,
      color: 'bg-orange-500',
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-300 rounded-md animate-pulse"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((item) => (
        <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <item.icon className="h-8 w-8 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {item.name}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {item.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 
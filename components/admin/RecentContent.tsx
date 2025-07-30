'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface RecentContent {
  id: string
  title: string
  type: string
  updatedAt: string
}

export default function RecentContent() {
  const [recentContent, setRecentContent] = useState<RecentContent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentContent()
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Content</h2>
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
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Content</h2>
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
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
  )
} 
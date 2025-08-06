'use client'

import { logger } from '@/lib/logger';
import {  useEffect, useState  } from 'react';

interface Sector {
  id: string
  name: string
  description: string
  details: string
  image?: string
  category: string
  features: string[]
  applications: string[]
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function TestSectorsPage() {
  const [sectors, setSectors] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSectors()
  }, [])

  const fetchSectors = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/sectors')
      if (response.ok) {
        const data = await response.json()
        setSectors(data)
      } else {
        setError('Failed to fetch sectors')
      }
    } catch (error) {
      setError('Error fetching sectors')
      logger.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sectors...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchSectors}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Sectors Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Sectors ({sectors.length})</h2>
          
          {sectors.length === 0 ? (
            <p className="text-gray-500">No sectors found.</p>
          ) : (
            <div className="space-y-4">
              {sectors.map((sector) => (
                <div key={sector.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900">{sector.name}</h3>
                  <p className="text-gray-600 mt-1">{sector.description}</p>
                  <div className="mt-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {sector.category}
                    </span>
                    <span className={`ml-2 inline-block text-xs px-2 py-1 rounded ${
                      sector.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {sector.isActive ? 'Active' : 'Inactive'}
                    </span>
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
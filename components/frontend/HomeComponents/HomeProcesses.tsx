'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { logger } from '@/lib/logger';
import {  ArrowRight  } from 'lucide-react';

interface Process {
  id: string
  title: string
  description: string
  content: string
  image: string
  link: string
  order: number
  isActive: boolean
}

export default function HomeProcesses() {
  const [processes, setProcesses] = useState<Process[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now())

  useEffect(() => {
    fetchProcesses()
  }, [lastUpdate])

  const fetchProcesses = async () => {
    try {
      // Add cache-busting parameter to force fresh data
      const response = await fetch(`/api/content/home-processes?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setProcesses(data)
      }
    } catch (error) {
      logger.error('Failed to fetch processes:', error)
    } finally {
      setLoading(false)
    }
  }

  // Force refresh function that can be called externally
  const forceRefresh = () => {
    logger.log('HomeProcesses: Force refresh triggered')
    setLastUpdate(Date.now())
  }

  // Expose the refresh function globally for admin updates
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).refreshHomeProcesses = forceRefresh
      logger.log('HomeProcesses: Refresh function exposed globally')
    }
  }, [])

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-blue-900 to-blue-500 overflow-hidden">
        {/* Hero Section */}
        <section className="relative text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-white/20 rounded mb-6"></div>
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-3/4 mb-8"></div>
              <div className="h-12 bg-white/20 rounded w-48"></div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="h-8 bg-gray-200 rounded mb-12 mx-auto w-64"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-200 animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-500 overflow-hidden">
      {/* Hero Section */}
      <section className="relative text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl md:text-5xl font-bold mb-6">
              Essential Metal Finishing & Plating Services Across India
            </h1>
            <p className="text-sm lg:text-xl max-w-3xl mb-8">
              At Alkalyne Surface Technologies, we deliver precision-driven, industry-certified metal finishing solutions for clients across India and globally.
            </p>
            <div className="inline-block">
              <Link
                href="/contact"
                className="bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-all"
              >
                🎯 Get a Free Quote <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Metal Finishing Services
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processes
              .filter(process => process.isActive)
              .sort((a, b) => a.order - b.order)
              .map((process, index) => (
                <div
                  key={process.id}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 overflow-hidden">
                                         {process.image ? (
                       <img 
                         src={process.image} 
                         alt={process.title}
                         className="w-full h-full object-cover"
                         onError={(e) => {
                           // Fallback to placeholder if image fails to load
                           const target = e.target as HTMLImageElement
                           target.style.display = 'none'
                           target.nextElementSibling?.classList.remove('hidden')
                         }}
                       />
                     ) : null}
                     <div className={`w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center ${process.image ? 'hidden' : ''}`}>
                       <div className="text-center">
                         <div className="text-blue-600 text-4xl mb-2">⚙️</div>
                         <span className="text-blue-800 font-medium text-sm">{process.title}</span>
                       </div>
                     </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{process.title}</h3>
                    <p className="text-blue-600 font-medium mb-3">{process.description}</p>
                    <p className="text-gray-600 mb-4">{process.content}</p>
                    <Link
                      href={process.link}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      Read More <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
} 
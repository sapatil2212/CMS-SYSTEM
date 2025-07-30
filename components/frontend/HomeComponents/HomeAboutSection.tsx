'use client'

import { useState, useEffect } from 'react'

interface HomeAboutData {
  title: string
  description: string
  image: string
}

export default function HomeAboutSection() {
  const [aboutData, setAboutData] = useState<HomeAboutData>({
    title: '',
    description: '',
    image: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomeAboutData()
  }, [])

  const fetchHomeAboutData = async () => {
    try {
      const response = await fetch('/api/content/home-about')
      if (response.ok) {
        const data = await response.json()
        setAboutData(data)
      }
    } catch (error) {
      console.error('Failed to fetch home about data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-[40px]">
        <div className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-[40px]">
      <div className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-poppins">
              {aboutData.title || 'What Alkalyne Surface Technologies Can Do for You'}
            </h2>
            <p className="text-md md:text-lg text-gray-600 mb-4">
              {aboutData.description || 'Alkalyne is your trusted partner for high-performance metal plating, surface coating, and advanced finishing solutions. Every process is executed by certified professionals with years of experience, ensuring compliance with the highest industry standards — from aerospace and automotive to defense and electronics.'}
            </p>
          </div>
          <div className="relative">
            {aboutData.image ? (
              <img
                src={aboutData.image}
                alt="About Section"
                className="rounded-xl w-full h-auto"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
} 
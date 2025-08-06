'use client'

import { useState, useEffect } from 'react'

export default function TestBaseMetalsDashboard() {
  const [baseMetals, setBaseMetals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBaseMetals()
  }, [])

  const fetchBaseMetals = async () => {
    setLoading(true)
    try {
      console.log('🔍 Fetching base metal settings...')
      const settingsResponse = await fetch('/api/admin/base-metal-settings')
      console.log('Settings response status:', settingsResponse.status)
      
      if (!settingsResponse.ok) {
        throw new Error('Failed to fetch base metal settings')
      }
      
      const settings = await settingsResponse.json()
      console.log('📊 Base metal settings:', settings)

      // Fetch content for each base metal
      const promises = settings.map(async (setting: any) => {
        try {
          console.log(`🔍 Fetching content for ${setting.slug}...`)
          let response = await fetch(`/api/content/base-metal/${setting.slug}`)
          let data = null
          
          if (response.ok) {
            data = await response.json()
            console.log(`✅ Content for ${setting.slug}:`, data)
          } else {
            console.log(`❌ Base-metal route failed for ${setting.slug}, trying regular route`)
            response = await fetch(`/api/content/${setting.slug}`)
            if (response.ok) {
              data = await response.json()
              console.log(`✅ Content for ${setting.slug} (fallback):`, data)
            }
          }
          
          if (data) {
            return {
              id: setting.slug,
              name: setting.name,
              slug: setting.slug,
              content: data,
              isActive: setting.isActive,
              heroImage: data.heroImage || '',
              heroTitle: data.heroTitle || '',
              heroSubtitle: data.heroSubtitle || ''
            }
          }
          
          // If no content found, return with default content
          return {
            id: setting.slug,
            name: setting.name,
            slug: setting.slug,
            content: {
              heroTitle: `${setting.name} Plating Services`,
              heroSubtitle: `Professional ${setting.name} Plating Solutions`,
              heroDescription: `High-quality ${setting.name.toLowerCase()} plating services for industrial applications`
            },
            isActive: setting.isActive,
            heroImage: '',
            heroTitle: `${setting.name} Plating Services`,
            heroSubtitle: `Professional ${setting.name} Plating Solutions`
          }
        } catch (error) {
          console.error(`❌ Failed to fetch ${setting.slug} content:`, error)
          return {
            id: setting.slug,
            name: setting.name,
            slug: setting.slug,
            content: {
              heroTitle: `${setting.name} Plating Services`,
              heroSubtitle: `Professional ${setting.name} Plating Solutions`,
              heroDescription: `High-quality ${setting.name.toLowerCase()} plating services for industrial applications`
            },
            isActive: setting.isActive,
            heroImage: '',
            heroTitle: `${setting.name} Plating Services`,
            heroSubtitle: `Professional ${setting.name} Plating Solutions`
          }
        }
      })

      const updatedBaseMetals = await Promise.all(promises)
      console.log('📊 Final base metals array:', updatedBaseMetals)
      setBaseMetals(updatedBaseMetals)
    } catch (error) {
      console.error('❌ Failed to fetch base metals:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Base Metals Dashboard Test</h1>
        
        <div className="mb-6">
          <button 
            onClick={fetchBaseMetals}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh Base Metals
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading base metals...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Base Metals Found: {baseMetals.length}</h2>
            
            {baseMetals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No base metals found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {baseMetals.map((baseMetal: any) => (
                  <div key={baseMetal.id} className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{baseMetal.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">Slug: {baseMetal.slug}</p>
                    <p className="text-sm text-gray-600 mb-2">Active: {baseMetal.isActive ? 'Yes' : 'No'}</p>
                    <p className="text-sm text-gray-600 mb-2">Hero Title: {baseMetal.heroTitle}</p>
                    <p className="text-sm text-gray-600">Hero Subtitle: {baseMetal.heroSubtitle}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 
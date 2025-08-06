'use client'

import { useState, useEffect } from 'react'
import { ToggleLeft, ToggleRight, CheckCircle, AlertCircle, Package, XCircle, RefreshCw } from 'lucide-react'
import { logger } from '@/lib/logger'

interface BaseMetal {
  id: string
  name: string
  slug: string
  href: string
  isMenuActive: boolean
}

export default function BaseMetalActivationManagement() {
  const [baseMetals, setBaseMetals] = useState<BaseMetal[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    logger.log('BaseMetalActivationManagement component mounted')
    fetchBaseMetals()
  }, [])

  // Auto-hide modal after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const fetchBaseMetals = async () => {
    try {
      setLoading(true)
      setError(null)
      logger.log('Fetching base metals from API...')
      
      const response = await fetch('/api/content/base-metal-activation')
      logger.log('API response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        logger.log('Base metals data received:', data)
        setBaseMetals(data)
      } else {
        const errorText = await response.text()
        logger.error('API error:', errorText)
        throw new Error(`Failed to fetch base metals: ${response.status} ${errorText}`)
      }
    } catch (error) {
      logger.error('Error fetching base metals:', error)
      setError(error instanceof Error ? error.message : 'Failed to load base metals')
      setMessage({ type: 'error', text: 'Failed to load base metals' })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleBaseMetal = async (baseMetalSlug: string, isMenuActive: boolean) => {
    try {
      setUpdating(baseMetalSlug)
      setMessage(null)
      setError(null)

      logger.log('Toggling base metal:', baseMetalSlug, 'to:', isMenuActive)

      // Try multiple HTTP methods as fallbacks
      const methods = ['PUT', 'POST', 'PATCH']
      let response = null
      let lastError = null

      for (const method of methods) {
        try {
          logger.log(`Trying ${method} method...`)
          response = await fetch('/api/content/base-metal-activation', {
            method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ baseMetalSlug, isMenuActive }),
          })

          logger.log(`${method} response status:`, response.status)

          if (response.ok) {
            logger.log(`${method} succeeded`)
            break
          } else {
            lastError = `${method} failed with status ${response.status}`
            logger.log(lastError)
          }
        } catch (error) {
          lastError = `${method} failed: ${error}`
          logger.log(lastError)
        }
      }

      if (response && response.ok) {
        const result = await response.json()
        logger.log('Toggle API response:', result)
        setMessage({ type: 'success', text: 'Base metal activation updated successfully!' })
        // Refresh the data
        await fetchBaseMetals()
      } else {
        throw new Error(lastError || 'All HTTP methods failed')
      }
    } catch (error) {
      logger.error('Error updating base metal activation:', error)
      setError(error instanceof Error ? error.message : 'Failed to update base metal activation')
      setMessage({ type: 'error', text: 'Failed to update base metal activation' })
    } finally {
      setUpdating(null)
    }
  }

  const handleRefresh = () => {
    fetchBaseMetals()
  }

  logger.log('BaseMetalActivationManagement render - loading:', loading, 'baseMetals count:', baseMetals.length, 'error:', error)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading base metals...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-3">
          <h2 className="text-xl font-bold text-gray-900">Base Metal Pages Management</h2>
          <p className="mt-1 text-xs text-gray-600">
            Activate or deactivate individual base metal pages in the header menu. Deactivated pages will be hidden from the navigation.
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="text-sm font-semibold text-red-900">Error Loading Data</h3>
              <p className="text-xs text-red-800 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="mt-3 inline-flex items-center px-3 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <RefreshCw className="h-3 w-3 mr-1.5" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-gray-200 pb-3">
        <h2 className="text-xl font-bold text-gray-900">Base Metal Pages Management</h2>
        <p className="mt-1 text-xs text-gray-600">
          Activate or deactivate individual base metal pages in the header menu. Deactivated pages will be hidden from the navigation.
        </p>
      </div>

      {/* Pop-up Modal */}
      {message && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 transform transition-all duration-300 ease-out ${
            message ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {message.type === 'success' ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                )}
                <h3 className={`text-lg font-semibold ${
                  message.type === 'success' ? 'text-green-900' : 'text-red-900'
                }`}>
                  {message.type === 'success' ? 'Success' : 'Error'}
                </h3>
              </div>
              <button
                onClick={() => setMessage(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <p className={`text-sm ${
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message.text}
            </p>
          </div>
        </div>
      )}

      {/* Base Metals Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        {baseMetals.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Base Metals Found</h3>
            <p className="text-sm text-gray-500 mb-4">No base metal content has been created yet.</p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {baseMetals.map((baseMetal) => (
              <div key={baseMetal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-900">{baseMetal.name}</h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    baseMetal.isMenuActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {baseMetal.isMenuActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <p className="text-xs text-gray-500 mb-3">{baseMetal.href}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Menu Status:</span>
                  <button
                    onClick={() => handleToggleBaseMetal(baseMetal.slug, !baseMetal.isMenuActive)}
                    disabled={updating === baseMetal.slug}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      baseMetal.isMenuActive ? 'bg-blue-600' : 'bg-gray-200'
                    } ${updating === baseMetal.slug ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-opacity-80'}`}
                    title={`Click to ${baseMetal.isMenuActive ? 'deactivate' : 'activate'} ${baseMetal.name}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        baseMetal.isMenuActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                    {updating === baseMetal.slug && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-xs font-medium text-blue-900 mb-1">Instructions</h4>
        <ul className="text-xs text-blue-800 space-y-0.5">
          <li>• Toggle base metal pages on/off to show/hide them in the header menu</li>
          <li>• Deactivated pages will be completely hidden from the navigation</li>
          <li>• Changes are applied immediately to the frontend</li>
          <li>• This only affects menu visibility, not the actual page content</li>
          <li>• If you don't see the toggle buttons, try refreshing the page</li>
        </ul>
      </div>
    </div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { ToggleLeft, ToggleRight, CheckCircle, AlertCircle, Settings, XCircle } from 'lucide-react'

interface Process {
  id: string
  name: string
  slug: string
  href: string
  isMenuActive: boolean
}

export default function ProcessActivationManagement() {
  const [processes, setProcesses] = useState<Process[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchProcesses()
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

  const fetchProcesses = async () => {
    try {
      setLoading(true)
      console.log('Fetching processes from:', '/api/content/process-activation')
      
      const response = await fetch('/api/content/process-activation', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Processes fetched:', data)
        setProcesses(data)
      } else {
        const errorText = await response.text()
        console.error('Failed to fetch processes:', errorText)
        throw new Error(`Failed to fetch processes: ${response.status} ${errorText}`)
      }
    } catch (error) {
      console.error('Error fetching processes:', error)
      setMessage({ type: 'error', text: `Failed to load processes: ${error instanceof Error ? error.message : 'Unknown error'}` })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleProcess = async (processSlug: string, isMenuActive: boolean) => {
    try {
      setUpdating(processSlug)
      setMessage(null)

      console.log('Toggling process:', processSlug, 'isMenuActive:', isMenuActive)

      // Try PUT method first
      let response = await fetch('/api/content/process-activation', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ processSlug, isMenuActive }),
      })

      // If PUT fails, try POST as fallback
      if (!response.ok) {
        console.log('PUT failed, trying POST fallback')
        response = await fetch('/api/content/process-activation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ processSlug, isMenuActive }),
        })
      }

      console.log('Response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('Process updated successfully:', result)
        setMessage({ type: 'success', text: 'Process activation updated successfully!' })
        // Refresh the data
        await fetchProcesses()
      } else {
        const errorText = await response.text()
        console.error('Failed to update process:', errorText)
        throw new Error(`Failed to update process activation: ${response.status} ${errorText}`)
      }
    } catch (error) {
      console.error('Error updating process activation:', error)
      setMessage({ type: 'error', text: `Failed to update process activation: ${error instanceof Error ? error.message : 'Unknown error'}` })
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading processes...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-gray-200 pb-3">
        <h2 className="text-xl font-bold text-gray-900">Process Pages Management</h2>
        <p className="mt-1 text-xs text-gray-600">
          Activate or deactivate individual process pages in the header menu. Deactivated pages will be hidden from the navigation.
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

      {/* Processes Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        {processes.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Processes Found</h3>
            <p className="text-sm text-gray-500 mb-4">
              No process pages were found. This might be due to a database connection issue.
            </p>
            <button
              onClick={fetchProcesses}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Retry Loading
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processes.map((process) => (
              <div key={process.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-900">{process.name}</h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    process.isMenuActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {process.isMenuActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <p className="text-xs text-gray-500 mb-3">{process.href}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Menu Status:</span>
                  <button
                    onClick={() => handleToggleProcess(process.slug, !process.isMenuActive)}
                    disabled={updating === process.slug}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      process.isMenuActive ? 'bg-blue-600' : 'bg-gray-200'
                    } ${updating === process.slug ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        process.isMenuActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                    {updating === process.slug && (
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
          <li>• Toggle process pages on/off to show/hide them in the header menu</li>
          <li>• Deactivated pages will be completely hidden from the navigation</li>
          <li>• Changes are applied immediately to the frontend</li>
          <li>• This only affects menu visibility, not the actual page content</li>
        </ul>
      </div>
    </div>
  )
} 
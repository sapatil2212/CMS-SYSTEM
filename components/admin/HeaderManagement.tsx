'use client'

import { useState, useEffect } from 'react'
import { Save, Upload, RefreshCw, CheckCircle, AlertCircle, X } from 'lucide-react'
import ImageUpload from './ImageUpload'
import HeaderMenuManagement from './HeaderMenuManagement'
import ProfessionalLoader from '@/components/ui/ProfessionalLoader'

interface HeaderSettings {
  id: string
  logoUrl?: string
  logoAlt?: string
  phoneNumber?: string
  email?: string
}

export default function HeaderManagement() {
  const [settings, setSettings] = useState<HeaderSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [activeSection, setActiveSection] = useState<'logo-settings' | 'menu-management'>('menu-management')

  useEffect(() => {
    fetchHeaderSettings()
  }, [])

  const fetchHeaderSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/content/header')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      } else {
        throw new Error('Failed to fetch header settings')
      }
    } catch (error) {
      console.error('Error fetching header settings:', error)
      setMessage({ type: 'error', text: 'Failed to load header settings' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return

    try {
      setSaving(true)
      setMessage(null)

      // Try PUT first, fallback to POST if PUT fails
      let response = await fetch('/api/content/header', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      // If PUT fails, try POST as fallback
      if (!response.ok && response.status === 405) {
        console.log('PUT method not allowed, trying POST as fallback...')
        response = await fetch('/api/content/header', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(settings),
        })
      }

                   if (response.ok) {
        const result = await response.json()
        console.log('Header settings updated successfully:', result)
        setShowSuccessModal(true)
        // Auto-hide modal after 2 seconds
        setTimeout(() => {
          setShowSuccessModal(false)
        }, 2000)
        // Refresh the data
        await fetchHeaderSettings()
      } else {
        const errorData = await response.json()
        console.error('Server error response:', errorData)
        throw new Error(errorData.error || errorData.details || 'Failed to update header settings')
      }
    } catch (error) {
      console.error('Error updating header settings:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to update header settings'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setSaving(false)
    }
  }

  const handleLogoChange = (url: string) => {
    setSettings(prev => prev ? { ...prev, logoUrl: url } : null)
  }

  const handleInputChange = (field: keyof HeaderSettings, value: string) => {
    setSettings(prev => prev ? { ...prev, [field]: value } : null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <ProfessionalLoader 
          size="lg"
          title="Loading Header Settings"
          subtitle="Fetching header management data..."
        />
      </div>
    )
  }

  return (
    <>
      <style jsx>{`
        .compact-upload .border-2 {
          padding: 1rem !important;
          min-height: 120px;
        }
        .compact-upload .space-y-4 {
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }
        .compact-upload .h-12 {
          height: 2rem !important;
          width: 2rem !important;
        }
        .compact-upload .text-sm {
          font-size: 0.75rem !important;
        }
        .compact-upload .text-xs {
          font-size: 0.625rem !important;
        }
        .compact-upload .max-h-48 {
          max-height: 4rem !important;
        }
      `}</style>
      <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-gray-200 pb-3">
        <h2 className="text-xl font-bold text-gray-900">Header Content Management</h2>
        <p className="mt-1 text-xs text-gray-600">
          Manage your website header including logo, contact information, and navigation settings.
        </p>
      </div>

      {/* Modern Toggle Menu */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-2 shadow-lg">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSection('logo-settings')}
              className={`group relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeSection === 'logo-settings'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                  : 'text-blue-700 hover:bg-white/80 hover:shadow-md'
              }`}
            >
              <span className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeSection === 'logo-settings' ? 'bg-white' : 'bg-blue-400'
                }`} />
                Logo Settings
              </span>
              {activeSection === 'logo-settings' && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 animate-pulse" />
              )}
            </button>
            
            <button
              onClick={() => setActiveSection('menu-management')}
              className={`group relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeSection === 'menu-management'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                  : 'text-blue-700 hover:bg-white/80 hover:shadow-md'
              }`}
            >
              <span className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeSection === 'menu-management' ? 'bg-white' : 'bg-blue-400'
                }`} />
                Menu Management
              </span>
              {activeSection === 'menu-management' && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {message && message.type === 'error' && (
        <div className="p-3 rounded-md flex items-center space-x-2 bg-red-50 text-red-800 border border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-xs font-medium">{message.text}</span>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 relative">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Success!</h3>
                <p className="text-xs text-gray-600">Header settings updated successfully!</p>
              </div>
            </div>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

            {/* Logo Settings Section */}
      {activeSection === 'logo-settings' && (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Logo Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                  <Upload className="h-4 w-4 mr-2 text-blue-600" />
                  Logo Settings
                </h3>
                
                <ImageUpload
                  label="Company Logo"
                  value={settings?.logoUrl || ''}
                  onChange={handleLogoChange}
                  required={true}
                  maxSize={2}
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="compact-upload"
                />
              </div>

              {/* Contact Information Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2 text-blue-600" />
                  Contact Information
                </h3>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Logo Alt Text
                  </label>
                  <input
                    type="text"
                    value={settings?.logoAlt || ''}
                    onChange={(e) => handleInputChange('logoAlt', e.target.value)}
                    placeholder="Enter logo alt text for accessibility"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This text will be displayed if the logo fails to load and for screen readers.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={settings?.phoneNumber || ''}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="+91 93731 02887"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving || !settings}
                className="inline-flex items-center px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1.5"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-3 w-3 mr-1.5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-xs font-medium text-blue-900 mb-1">Instructions</h4>
            <ul className="text-xs text-blue-800 space-y-0.5">
              <li>• Upload your company logo (PNG, JPG, or WEBP format, max 2MB)</li>
              <li>• Provide alt text for accessibility and SEO</li>
              <li>• Update contact information that will appear in the header</li>
              <li>• Changes are saved automatically and reflected immediately on the frontend</li>
            </ul>
          </div>
        </>
      )}

      {/* Menu Management Section */}
      {activeSection === 'menu-management' && (
        <HeaderMenuManagement />
      )}
    </div>
    </>
  )
} 
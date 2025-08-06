'use client'

import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { logger } from '@/lib/logger';
import {  XMarkIcon, PhotoIcon  } from '@heroicons/react/24/outline';

interface Sector {
  id: string
  name: string
  description: string
  details: string
  image?: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface SectorFormProps {
  sector?: Sector | null
  onClose: () => void
  onSubmit: () => void
}

export default function SectorForm({ sector, onClose, onSubmit }: SectorFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    details: '',
    image: '',
    order: 0,
    isActive: true
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [imageUploading, setImageUploading] = useState(false)

  useEffect(() => {
    if (sector) {
      setFormData({
        name: sector.name,
        description: sector.description,
        details: sector.details,
        image: sector.image || '',
        order: sector.order,
        isActive: sector.isActive
      })
    }
  }, [sector])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.details.trim()) {
      newErrors.details = 'Details are required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const url = sector ? `/api/sectors/${sector.id}` : '/api/sectors'
      const method = sector ? 'PUT' : 'POST'
      const token = localStorage.getItem('token')

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSubmit()
      } else {
        const errorData = await response.json()
        setErrors({ submit: errorData.error || 'Failed to save sector' })
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred while saving the sector' })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const token = localStorage.getItem('token')

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        setFormData(prev => ({ ...prev, image: result.url }))
      } else {
        const error = await response.json()
        alert(`Upload failed: ${error.error}`)
      }
    } catch (error) {
      logger.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setImageUploading(false)
    }
  }

  const toggleActive = () => {
    setFormData(prev => ({ ...prev, isActive: !prev.isActive }))
  }

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              {sector ? 'Edit Sector' : 'Create New Sector'}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Sector Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-2 py-1.5 text-xs border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter sector name"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                {/* Enhanced Activate/Deactivate Section */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <p className="text-xs text-gray-500">
                        {formData.isActive ? 'Active - Visible to users' : 'Inactive - Hidden from users'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={toggleActive}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        formData.isActive ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      formData.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {formData.isActive ? '✓ Active' : '✗ Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className={`w-full px-2 py-1.5 text-xs border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Brief description of the sector"
                  />
                  {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Details *
                  </label>
                  <textarea
                    value={formData.details}
                    onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                    rows={4}
                    className={`w-full px-2 py-1.5 text-xs border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.details ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Detailed information about the sector"
                  />
                  {errors.details && <p className="mt-1 text-xs text-red-600">{errors.details}</p>}
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="mt-6">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Sector Image
              </label>
              <div className="space-y-2">
                {formData.image ? (
                  <div className="relative group">
                    <img
                      src={formData.image}
                      alt="Sector preview"
                      className="w-full h-32 object-cover rounded-md border border-gray-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition-colors">
                      <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="mt-1">
                        <div className="text-xs font-medium text-gray-700">
                          {imageUploading ? 'Uploading...' : 'Click to upload image'}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          PNG, JPG, GIF up to 5MB
                        </div>
                      </div>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={imageUploading}
                    />
                  </label>
                )}
                {imageUploading && (
                  <div className="flex items-center justify-center text-xs text-blue-600">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                    Uploading...
                  </div>
                )}
              </div>
            </div>

            {errors.submit && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-xs text-red-600">{errors.submit}</p>
              </div>
            )}

            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-1.5 text-xs border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Saving...' : (sector ? 'Update Sector' : 'Create Sector')}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
} 
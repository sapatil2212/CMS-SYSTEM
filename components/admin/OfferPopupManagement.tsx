'use client'

import { useState, useEffect } from 'react'
import { Save, Upload, RefreshCw, CheckCircle, AlertCircle, X, Plus, Edit, Trash, Power, PowerOff } from 'lucide-react'
import ImageUpload from './ImageUpload'
import ProfessionalLoader from '@/components/ui/ProfessionalLoader'
import { logger } from '@/lib/logger';

interface OfferPopup {
  id: string
  title: string
  description: string
  image: string
  ctaText: string
  ctaLink?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface FormData {
  image: string
  ctaText: string
  ctaLink: string
}

export default function OfferPopupManagement() {
  const [offerPopups, setOfferPopups] = useState<OfferPopup[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPopup, setSelectedPopup] = useState<OfferPopup | null>(null)
  const [formData, setFormData] = useState<FormData>({
    image: '',
    ctaText: 'Learn More',
    ctaLink: ''
  })

  useEffect(() => {
    fetchOfferPopups()
  }, [])

  const fetchOfferPopups = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/content/offer-popup')
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setOfferPopups(data)
        } else if (data) {
          setOfferPopups([data])
        } else {
          setOfferPopups([])
        }
      } else {
        throw new Error('Failed to fetch offer popups')
      }
    } catch (error) {
      logger.error('Error fetching offer popups:', error)
      setMessage({ type: 'error', text: 'Failed to load offer popups' })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!formData.image) {
      setMessage({ type: 'error', text: 'Please upload an image' })
      return
    }

    try {
      setSaving(true)
      setMessage(null)

      const response = await fetch('/api/content/offer-popup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Offer Popup',
          description: 'Special offer popup',
          ...formData,
        }),
      })

      if (response.ok) {
        setShowSuccessModal(true)
        setShowCreateModal(false)
        resetForm()
        await fetchOfferPopups()
        setTimeout(() => {
          setShowSuccessModal(false)
        }, 2000)
      } else {
        throw new Error('Failed to create offer popup')
      }
    } catch (error) {
      logger.error('Error creating offer popup:', error)
      setMessage({ type: 'error', text: 'Failed to create offer popup' })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!selectedPopup || !formData.image) {
      setMessage({ type: 'error', text: 'Please upload an image' })
      return
    }

    try {
      setSaving(true)
      setMessage(null)

      const response = await fetch('/api/content/offer-popup', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedPopup.id,
          title: selectedPopup.title,
          description: selectedPopup.description,
          ...formData,
          isActive: selectedPopup.isActive
        }),
      })

      if (response.ok) {
        setShowSuccessModal(true)
        setShowEditModal(false)
        resetForm()
        await fetchOfferPopups()
        setTimeout(() => {
          setShowSuccessModal(false)
        }, 2000)
      } else {
        throw new Error('Failed to update offer popup')
      }
    } catch (error) {
      logger.error('Error updating offer popup:', error)
      setMessage({ type: 'error', text: 'Failed to update offer popup' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedPopup) return

    try {
      setSaving(true)
      setMessage(null)

      const response = await fetch(`/api/content/offer-popup?id=${selectedPopup.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setShowSuccessModal(true)
        setShowDeleteModal(false)
        await fetchOfferPopups()
        setTimeout(() => {
          setShowSuccessModal(false)
        }, 2000)
      } else {
        throw new Error('Failed to delete offer popup')
      }
    } catch (error) {
      logger.error('Error deleting offer popup:', error)
      setMessage({ type: 'error', text: 'Failed to delete offer popup' })
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (popup: OfferPopup) => {
    try {
      setSaving(true)
      setMessage(null)

      // If activating this popup, first deactivate all others
      if (!popup.isActive) {
        await fetch('/api/content/offer-popup/deactivate-all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }

      const response = await fetch('/api/content/offer-popup', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: popup.id,
          image: popup.image,
          ctaText: popup.ctaText,
          ctaLink: popup.ctaLink,
          isActive: !popup.isActive
        }),
      })

      if (response.ok) {
        const action = !popup.isActive ? 'activated' : 'deactivated'
        setSuccessMessage(`Offer successfully ${action}!`)
        setShowSuccessModal(true)
        await fetchOfferPopups()
        setTimeout(() => {
          setShowSuccessModal(false)
        }, 3000)
      } else {
        throw new Error('Failed to update offer popup')
      }
    } catch (error) {
      logger.error('Error updating offer popup:', error)
      setMessage({ type: 'error', text: 'Failed to update offer popup' })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (popup: OfferPopup) => {
    setSelectedPopup(popup)
    setFormData({
      image: popup.image,
      ctaText: popup.ctaText,
      ctaLink: popup.ctaLink || ''
    })
    setShowEditModal(true)
  }

  const handleDeleteClick = (popup: OfferPopup) => {
    setSelectedPopup(popup)
    setShowDeleteModal(true)
  }

  const resetForm = () => {
    setFormData({
      image: '',
      ctaText: 'Learn More',
      ctaLink: ''
    })
    setSelectedPopup(null)
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <ProfessionalLoader 
          size="lg"
          title="Loading Offer Popups"
          subtitle="Fetching popup management data..."
        />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Offer Popup Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage promotional popups that appear on the home page
            </p>
          </div>
                     <button
             onClick={() => setShowCreateModal(true)}
             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
           >
             <Plus className="h-4 w-4 mr-2" />
             Create New Offer
           </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`rounded-md p-4 ${
            message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  message.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {message.text}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setMessage(null)}
                  className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

                 {/* Offer Popups List */}
         <div className="bg-white shadow rounded-lg">
           {offerPopups.length === 0 ? (
             <div className="p-8 text-center">
               <div className="mx-auto h-12 w-12 text-gray-400">
                 <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                 </svg>
               </div>
               <h3 className="mt-2 text-sm font-medium text-gray-900">No offer popups</h3>
               <p className="mt-1 text-sm text-gray-500">Get started by creating a new offer popup.</p>
               <div className="mt-6">
                                   <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Offer
                  </button>
               </div>
             </div>
           ) : (
             <div className="divide-y divide-gray-200">
               {offerPopups.map((popup) => (
                 <div key={popup.id} className="p-6">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-4">
                       <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                         <img
                           src={popup.image}
                           alt={popup.title}
                           className="w-full h-full object-cover"
                           onError={(e) => {
                             const target = e.target as HTMLImageElement
                             target.style.display = 'none'
                             target.parentElement!.classList.add('bg-gradient-to-br', 'from-blue-500', 'to-purple-600')
                           }}
                         />
                       </div>
                       <div className="flex-1 min-w-0">
                         <h3 className="text-lg font-semibold text-gray-900 truncate">Offer Popup</h3>
                         <p className="text-sm text-gray-600 line-clamp-2">Image-based promotional popup</p>
                         <div className="flex items-center gap-4 mt-2">
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                             popup.isActive 
                               ? 'bg-green-100 text-green-800' 
                               : 'bg-gray-100 text-gray-800'
                           }`}>
                             {popup.isActive ? 'Active' : 'Inactive'}
                           </span>
                           <span className="text-xs text-gray-500">
                             CTA: {popup.ctaText}
                           </span>
                           <span className="text-xs text-gray-400">
                             {new Date(popup.createdAt).toLocaleDateString()}
                           </span>
                         </div>
                       </div>
                     </div>
                     <div className="flex items-center space-x-2">
                                               <button
                          onClick={() => handleToggleActive(popup)}
                          disabled={saving}
                          className={`p-2 rounded-lg transition-colors ${
                            popup.isActive 
                              ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title={popup.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {popup.isActive ? (
                            <Power className="h-5 w-5 text-green-600" />
                          ) : (
                            <PowerOff className="h-5 w-5 text-red-600" />
                          )}
                        </button>
                       <button
                         onClick={() => handleEdit(popup)}
                         disabled={saving}
                         className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                         title="Edit"
                       >
                         <Edit className="h-5 w-5" />
                       </button>
                       <button
                         onClick={() => handleDeleteClick(popup)}
                         disabled={saving}
                         className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                         title="Delete"
                       >
                         <Trash className="h-5 w-5" />
                       </button>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           )}
         </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCreateModal(false)} />
            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-md mx-auto">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
                {/* Close Button */}
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="absolute top-3 right-3 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
                
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-base leading-6 font-medium text-gray-900 mb-3">Create New Offer Popup</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Image *</label>
                        <ImageUpload
                          label="Popup Image"
                          value={formData.image}
                          onChange={(url) => handleInputChange('image', url)}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">CTA Text</label>
                          <input
                            type="text"
                            value={formData.ctaText}
                            onChange={(e) => handleInputChange('ctaText', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Learn More"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">CTA Link (Optional)</label>
                          <input
                            type="url"
                            value={formData.ctaLink}
                            onChange={(e) => handleInputChange('ctaLink', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={saving}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-3 py-1.5 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="animate-spin -ml-1 mr-1.5 h-3 w-3" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="-ml-1 mr-1.5 h-3 w-3" />
                      Create Popup
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedPopup && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowEditModal(false)} />
            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-md mx-auto">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
                {/* Close Button */}
                <button
                  onClick={() => setShowEditModal(false)}
                  className="absolute top-3 right-3 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
                
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-base leading-6 font-medium text-gray-900 mb-3">Edit Offer Popup</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Image *</label>
                        <ImageUpload
                          label="Popup Image"
                          value={formData.image}
                          onChange={(url) => handleInputChange('image', url)}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">CTA Text</label>
                          <input
                            type="text"
                            value={formData.ctaText}
                            onChange={(e) => handleInputChange('ctaText', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Learn More"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">CTA Link (Optional)</label>
                          <input
                            type="url"
                            value={formData.ctaLink}
                            onChange={(e) => handleInputChange('ctaLink', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={saving}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-3 py-1.5 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                                     {saving ? (
                     <>
                       <RefreshCw className="animate-spin -ml-1 mr-1.5 h-3 w-3" />
                       Updating...
                     </>
                   ) : (
                     <>
                       <Save className="-ml-1 mr-1.5 h-3 w-3" />
                       Update Offer
                     </>
                   )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

             {/* Delete Confirmation Modal */}
       {showDeleteModal && selectedPopup && (
         <div className="fixed inset-0 z-50 overflow-y-auto">
           <div className="flex items-center justify-center min-h-screen px-4 py-6">
             <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteModal(false)} />
             <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-lg mx-auto">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Offer Popup</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this offer popup? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash className="-ml-1 mr-2 h-4 w-4" />
                      Delete
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-sm mx-auto">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
                {/* Close Button */}
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="absolute top-3 right-3 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
                
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Success!</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {successMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 
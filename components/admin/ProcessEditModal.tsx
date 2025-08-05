'use client'

import { useState, useEffect, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { X, Plus, Trash2, Save, Eye, Upload, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

interface ProcessData {
  id: string
  name: string
  slug: string
  content: any
  isActive: boolean
  heroImage?: string
  heroTitle?: string
  heroSubtitle?: string
}

interface ProcessEditModalProps {
  process: ProcessData
  isOpen: boolean
  onClose: () => void
  onSave: (process: ProcessData) => void
}

export default function ProcessEditModal({ process, isOpen, onClose, onSave }: ProcessEditModalProps) {
  const [editedProcess, setEditedProcess] = useState<ProcessData>(process)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('hero')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadingFor, setUploadingFor] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEditedProcess(process)
  }, [process])

  const updateContent = (field: string, value: any) => {
    setEditedProcess(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value
      }
    }))
  }

  const getCurrentContent = () => {
    return editedProcess.content || {}
  }

  const handleImageUpload = async (file: File, field: string) => {
    setError(null)
    setIsUploading(true)
    setUploadingFor(field)

    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file')
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB')
      }

      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      
      // Handle application image uploads
      if (field.startsWith('applicationImage')) {
        const appIndex = parseInt(field.replace('applicationImage', ''))
        updateApplication(appIndex, 'image', data.url)
      } else {
        updateContent(field, data.url)
      }

      // Show success message
      toast.success('Image uploaded successfully')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsUploading(false)
      setUploadingFor('')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file, field)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent, field: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleImageUpload(file, field)
    }
  }

  const addBenefit = () => {
    const currentContent = getCurrentContent()
    const newBenefits = [...(currentContent.benefits || []), { icon: 'Zap', title: '', description: '' }]
    updateContent('benefits', newBenefits)
  }

  const removeBenefit = (index: number) => {
    const currentContent = getCurrentContent()
    const newBenefits = (currentContent.benefits || []).filter((_: any, i: number) => i !== index)
    updateContent('benefits', newBenefits)
  }

  const updateBenefit = (index: number, field: string, value: string) => {
    const currentContent = getCurrentContent()
    const newBenefits = (currentContent.benefits || []).map((benefit: any, i: number) => 
      i === index ? { ...benefit, [field]: value } : benefit
    )
    updateContent('benefits', newBenefits)
  }

  const addProcessStep = () => {
    const currentContent = getCurrentContent()
    const newSteps = [...(currentContent.processSteps || []), { step: '', title: '', description: '', icon: '' }]
    updateContent('processSteps', newSteps)
  }

  const removeProcessStep = (index: number) => {
    const currentContent = getCurrentContent()
    const newSteps = (currentContent.processSteps || []).filter((_: any, i: number) => i !== index)
    updateContent('processSteps', newSteps)
  }

  const updateProcessStep = (index: number, field: string, value: string) => {
    const currentContent = getCurrentContent()
    const newSteps = (currentContent.processSteps || []).map((step: any, i: number) => 
      i === index ? { ...step, [field]: value } : step
    )
    updateContent('processSteps', newSteps)
  }

  const addQualityCheck = () => {
    const currentContent = getCurrentContent()
    const newQualityChecks = [...(currentContent.qualityChecks || []), { 
      title: '', 
      description: '', 
      icon: '',
      criteria: ''
    }]
    updateContent('qualityChecks', newQualityChecks)
  }

  const removeQualityCheck = (index: number) => {
    const currentContent = getCurrentContent()
    const newQualityChecks = (currentContent.qualityChecks || []).filter((_: any, i: number) => i !== index)
    updateContent('qualityChecks', newQualityChecks)
  }

  const updateQualityCheck = (index: number, field: string, value: string) => {
    const currentContent = getCurrentContent()
    const newQualityChecks = (currentContent.qualityChecks || []).map((check: any, i: number) => 
      i === index ? { ...check, [field]: value } : check
    )
    updateContent('qualityChecks', newQualityChecks)
  }

  const addApplication = () => {
    const currentContent = getCurrentContent()
    const newApplications = [...(currentContent.applications || []), { 
      title: '', 
      image: '', 
      items: [] 
    }]
    updateContent('applications', newApplications)
  }

  const removeApplication = (index: number) => {
    const currentContent = getCurrentContent()
    const newApplications = (currentContent.applications || []).filter((_: any, i: number) => i !== index)
    updateContent('applications', newApplications)
  }

  const updateApplication = (index: number, field: string, value: any) => {
    const currentContent = getCurrentContent()
    const newApplications = (currentContent.applications || []).map((app: any, i: number) => 
      i === index ? { ...app, [field]: value } : app
    )
    updateContent('applications', newApplications)
  }

  const addApplicationItem = (appIndex: number) => {
    const currentContent = getCurrentContent()
    const newApplications = (currentContent.applications || []).map((app: any, i: number) => {
      if (i === appIndex) {
        // Handle both array and JSON string formats
        let items = app.items || []
        if (typeof items === 'string') {
          try {
            items = JSON.parse(items)
          } catch (e) {
            items = []
          }
        }
        if (!Array.isArray(items)) {
          items = []
        }
        const newItems = [...items, '']
        return { ...app, items: newItems }
      }
      return app
    })
    updateContent('applications', newApplications)
  }

  const removeApplicationItem = (appIndex: number, itemIndex: number) => {
    const currentContent = getCurrentContent()
    const newApplications = (currentContent.applications || []).map((app: any, i: number) => {
      if (i === appIndex) {
        // Handle both array and JSON string formats
        let items = app.items || []
        if (typeof items === 'string') {
          try {
            items = JSON.parse(items)
          } catch (e) {
            items = []
          }
        }
        if (!Array.isArray(items)) {
          items = []
        }
        const newItems = items.filter((_: any, j: number) => j !== itemIndex)
        return { ...app, items: newItems }
      }
      return app
    })
    updateContent('applications', newApplications)
  }

  const updateApplicationItem = (appIndex: number, itemIndex: number, value: string) => {
    const currentContent = getCurrentContent()
    const newApplications = (currentContent.applications || []).map((app: any, i: number) => {
      if (i === appIndex) {
        // Handle both array and JSON string formats
        let items = app.items || []
        if (typeof items === 'string') {
          try {
            items = JSON.parse(items)
          } catch (e) {
            items = []
          }
        }
        if (!Array.isArray(items)) {
          items = []
        }
        const newItems = items.map((item: any, j: number) => 
          j === itemIndex ? value : item
        )
        return { ...app, items: newItems }
      }
      return app
    })
    updateContent('applications', newApplications)
  }



  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(editedProcess)
      // Success message is now handled by the parent component
    } catch (error) {
      toast.error('Failed to save process')
    } finally {
      setSaving(false)
    }
  }

  const content = getCurrentContent()

  const tabs = [
    { id: 'hero', name: 'Hero Section', icon: '🎯' },
    { id: 'whatis', name: 'What Is', icon: 'ℹ️' },
    { id: 'benefits', name: 'Benefits', icon: '⭐' },
    { id: 'process', name: 'Process Steps', icon: '⚙️' },
    { id: 'applications', name: 'Industry Applications', icon: '🏭' },
    { id: 'quality', name: 'Quality Assurance', icon: '🔍' },
    { id: 'cta', name: 'Call to Action', icon: '📞' }
  ]

  const renderImageUploadSection = (field: string, label: string, currentImage: string) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Image Upload Container */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Upload {label}
        </label>
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-4 text-center transition-colors
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${error && uploadingFor === field ? 'border-red-500 bg-red-50' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={(e) => handleDrop(e, field)}
        >
          <div className="space-y-2">
            <div className="flex justify-center">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600">
                Drag and drop an image here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                  disabled={isUploading}
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF, WEBP up to 5MB
              </p>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, field)}
            className="hidden"
            disabled={isUploading}
          />

          {/* Upload progress */}
          {isUploading && uploadingFor === field && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-1"></div>
                <p className="text-xs text-gray-600">Uploading...</p>
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && uploadingFor === field && (
          <p className="text-xs text-red-600 mt-1">{error}</p>
        )}
      </div>

      {/* Image Preview Container */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Current {label} Preview
        </label>
        <div className="border border-gray-300 rounded-lg p-4 h-full flex items-center justify-center">
          {currentImage ? (
            <div className="relative">
              <img
                src={currentImage}
                alt={`${label.toLowerCase()} preview`}
                className="max-h-32 mx-auto rounded-lg shadow-sm"
              />
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-xs">No image</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <Dialog.Title as="h3" className="text-base font-semibold text-gray-900">
                        Edit {process.name}
                      </Dialog.Title>
                      <p className="text-xs text-gray-600 mt-1">
                        Update content and settings for this process
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(`/processes/${process.slug}`, '_blank')}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </button>
                      <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6" aria-label="Tabs">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          py-3 px-1 border-b-2 font-medium text-xs
                          ${activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }
                        `}
                      >
                        <span className="mr-1">{tab.icon}</span>
                        {tab.name}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Content */}
                <div className="px-6 py-6 max-h-96 overflow-y-auto">
                  {activeTab === 'hero' && (
                    <div className="space-y-4">
                      {/* Hero Title and Subtitle side by side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Hero Title
                          </label>
                          <input
                            type="text"
                            value={content.heroTitle || ''}
                            onChange={(e) => updateContent('heroTitle', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter hero title"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Hero Subtitle
                          </label>
                          <input
                            type="text"
                            value={content.heroSubtitle || ''}
                            onChange={(e) => updateContent('heroSubtitle', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter hero subtitle"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Hero Description
                        </label>
                        <textarea
                          rows={3}
                          value={content.heroDescription || ''}
                          onChange={(e) => updateContent('heroDescription', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter hero description"
                        />
                      </div>

                      {/* Image Upload and Preview side by side */}
                      {renderImageUploadSection('heroImage', 'Hero Image', content.heroImage || '')}
                    </div>
                  )}

                  {activeTab === 'whatis' && (
                    <div className="space-y-4">
                      {/* Section Title and Description side by side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Section Title
                          </label>
                          <input
                            type="text"
                            value={content.whatIsTitle || ''}
                            onChange={(e) => updateContent('whatIsTitle', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter section title"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            rows={4}
                            value={content.whatIsDescription || ''}
                            onChange={(e) => updateContent('whatIsDescription', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter description"
                          />
                        </div>
                      </div>
                      
                      {/* Image Upload and Preview side by side */}
                      {renderImageUploadSection('whatIsImage', 'Section Image', content.whatIsImage || '')}
                      
                      {/* Best For and Materials side by side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Best For (one per line)
                          </label>
                          <textarea
                            rows={4}
                            value={content.whatIsBestFor || ''}
                            onChange={(e) => updateContent('whatIsBestFor', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter best for items, one per line"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Materials (one per line)
                          </label>
                          <textarea
                            rows={4}
                            value={content.whatIsMaterials || ''}
                            onChange={(e) => updateContent('whatIsMaterials', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter materials, one per line"
                          />
                        </div>
                      </div>

                      {/* Alkaline Offers Content */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Alkaline Offers Text
                        </label>
                        <textarea
                          rows={3}
                          value={content.whatIsAlkalineOffers || 'Alkalyne offers both acid copper (for bright finishes) and cyanide copper (for steel/zinc adhesion) plating processes.'}
                          onChange={(e) => updateContent('whatIsAlkalineOffers', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter alkaline offers text that appears in the blue highlighted box"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          This text appears in the blue highlighted box in the "What Is" section
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'benefits' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Benefits Section Title
                        </label>
                        <input
                          type="text"
                          value={content.benefitsTitle || ''}
                          onChange={(e) => updateContent('benefitsTitle', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter benefits section title"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Benefits Section Subtitle
                        </label>
                        <input
                          type="text"
                          value={content.benefitsSubtitle || ''}
                          onChange={(e) => updateContent('benefitsSubtitle', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter benefits section subtitle"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        {(content.benefits || []).map((benefit: any, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium text-xs text-gray-900">Benefit {index + 1}</h4>
                              <button
                                onClick={() => removeBenefit(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Icon
                                </label>
                                <input
                                  type="text"
                                  value={benefit.icon || ''}
                                  onChange={(e) => updateBenefit(index, 'icon', e.target.value)}
                                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="e.g., Zap, Layers, Activity"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  value={benefit.title || ''}
                                  onChange={(e) => updateBenefit(index, 'title', e.target.value)}
                                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Enter benefit title"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Description
                                </label>
                                <input
                                  type="text"
                                  value={benefit.description || ''}
                                  onChange={(e) => updateBenefit(index, 'description', e.target.value)}
                                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Enter benefit description"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={addBenefit}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Benefit
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'process' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Process Section Title
                        </label>
                        <input
                          type="text"
                          value={content.processTitle || ''}
                          onChange={(e) => updateContent('processTitle', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter process section title"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Process Section Subtitle
                        </label>
                        <input
                          type="text"
                          value={content.processSubtitle || ''}
                          onChange={(e) => updateContent('processSubtitle', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter process section subtitle"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        {(content.processSteps || []).map((step: any, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium text-xs text-gray-900">Step {index + 1}</h4>
                              <button
                                onClick={() => removeProcessStep(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Step Number
                                </label>
                                <input
                                  type="text"
                                  value={step.step || ''}
                                  onChange={(e) => updateProcessStep(index, 'step', e.target.value)}
                                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="e.g., 1, 2, 3"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  value={step.title || ''}
                                  onChange={(e) => updateProcessStep(index, 'title', e.target.value)}
                                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Enter step title"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Description
                                </label>
                                <input
                                  type="text"
                                  value={step.description || ''}
                                  onChange={(e) => updateProcessStep(index, 'description', e.target.value)}
                                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Enter step description"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Icon Path
                                </label>
                                <input
                                  type="text"
                                  value={step.icon || ''}
                                  onChange={(e) => updateProcessStep(index, 'icon', e.target.value)}
                                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="SVG path data"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={addProcessStep}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Step
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'applications' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Applications Section Title
                        </label>
                        <input
                          type="text"
                          value={content.applicationsTitle || ''}
                          onChange={(e) => updateContent('applicationsTitle', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter applications section title"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Applications Section Subtitle
                        </label>
                        <input
                          type="text"
                          value={content.applicationsSubtitle || ''}
                          onChange={(e) => updateContent('applicationsSubtitle', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter applications section subtitle"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        {(content.applications || []).map((app: any, appIndex: number) => (
                          <div key={appIndex} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium text-xs text-gray-900">Application {appIndex + 1}</h4>
                              <button
                                onClick={() => removeApplication(appIndex)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  value={app.title || ''}
                                  onChange={(e) => updateApplication(appIndex, 'title', e.target.value)}
                                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Enter application title"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Description
                                </label>
                                <textarea
                                  value={app.description || ''}
                                  onChange={(e) => updateApplication(appIndex, 'description', e.target.value)}
                                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Enter application description"
                                  rows={3}
                                />
                              </div>
                            </div>
                            
                            {/* Image Upload for this application */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Image Upload Container */}
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Upload Application Image
                                </label>
                                <div
                                  className={`
                                    relative border-2 border-dashed rounded-lg p-4 text-center transition-colors
                                    ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                                    ${error && uploadingFor === `applicationImage${appIndex}` ? 'border-red-500 bg-red-50' : ''}
                                  `}
                                  onDragEnter={handleDrag}
                                  onDragLeave={handleDrag}
                                  onDragOver={handleDrag}
                                  onDrop={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setDragActive(false)
                                    const file = e.dataTransfer.files?.[0]
                                    if (file) {
                                      handleImageUpload(file, `applicationImage${appIndex}`)
                                    }
                                  }}
                                >
                                  <div className="space-y-2">
                                    <div className="flex justify-center">
                                      <Upload className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-600">
                                        Drag and drop an image here, or{' '}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const input = document.createElement('input')
                                            input.type = 'file'
                                            input.accept = 'image/*'
                                            input.onchange = (e) => {
                                              const file = (e.target as HTMLInputElement).files?.[0]
                                              if (file) {
                                                handleImageUpload(file, `applicationImage${appIndex}`)
                                              }
                                            }
                                            input.click()
                                          }}
                                          className="text-blue-600 hover:text-blue-500 font-medium"
                                          disabled={isUploading}
                                        >
                                          browse
                                        </button>
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        PNG, JPG, GIF, WEBP up to 5MB
                                      </p>
                                    </div>
                                  </div>

                                  {/* Upload progress */}
                                  {isUploading && uploadingFor === `applicationImage${appIndex}` && (
                                    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
                                      <div className="text-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-1"></div>
                                        <p className="text-xs text-gray-600">Uploading...</p>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Error message */}
                                {error && uploadingFor === `applicationImage${appIndex}` && (
                                  <p className="text-xs text-red-600 mt-1">{error}</p>
                                )}
                              </div>

                              {/* Image Preview Container */}
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Current Image Preview
                                </label>
                                <div className="border border-gray-300 rounded-lg p-4 h-full flex items-center justify-center">
                                  {app.image ? (
                                    <div className="relative">
                                      <img
                                        src={app.image}
                                        alt={`Application ${appIndex + 1} preview`}
                                        className="max-h-32 mx-auto rounded-lg shadow-sm"
                                      />
                                    </div>
                                  ) : (
                                    <div className="text-center text-gray-500">
                                      <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                      <p className="text-xs">No image</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Application Items
                              </label>
                              <div className="space-y-2">
                                {(() => {
                                  // Handle both array and JSON string formats
                                  let items = app.items || []
                                  if (typeof items === 'string') {
                                    try {
                                      items = JSON.parse(items)
                                    } catch (e) {
                                      items = []
                                    }
                                  }
                                  if (!Array.isArray(items)) {
                                    items = []
                                  }
                                  return items
                                })().map((item: string, itemIndex: number) => (
                                  <div key={itemIndex} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={item || ''}
                                      onChange={(e) => updateApplicationItem(appIndex, itemIndex, e.target.value)}
                                      className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="Enter application item"
                                    />
                                    <button
                                      onClick={() => removeApplicationItem(appIndex, itemIndex)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addApplicationItem(appIndex)}
                                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add Item
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={addApplication}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Application
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'quality' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Quality Assurance Section Title
                        </label>
                        <input
                          type="text"
                          value={content.qualityTitle || ''}
                          onChange={(e) => updateContent('qualityTitle', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter quality assurance section title"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Quality Assurance Section Subtitle
                        </label>
                        <input
                          type="text"
                          value={content.qualitySubtitle || ''}
                          onChange={(e) => updateContent('qualitySubtitle', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter quality assurance section subtitle"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Quality Assurance Description
                        </label>
                        <textarea
                          rows={3}
                          value={content.qualityDescription || ''}
                          onChange={(e) => updateContent('qualityDescription', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter quality assurance description"
                        />
                      </div>
                      
                      {/* Image Upload and Preview side by side */}
                      {renderImageUploadSection('qualityImage', 'Quality Assurance Image', content.qualityImage || '')}
                      
                      <div className="space-y-3">
                        {(content.qualityChecks || []).map((check: any, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium text-xs text-gray-900">Quality Check {index + 1}</h4>
                              <button
                                onClick={() => removeQualityCheck(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  value={check.title || ''}
                                  onChange={(e) => updateQualityCheck(index, 'title', e.target.value)}
                                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Enter quality check title"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Icon
                                </label>
                                <input
                                  type="text"
                                  value={check.icon || ''}
                                  onChange={(e) => updateQualityCheck(index, 'icon', e.target.value)}
                                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="e.g., CheckCircle, Shield, Award"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Description
                                </label>
                                <textarea
                                  rows={2}
                                  value={check.description || ''}
                                  onChange={(e) => updateQualityCheck(index, 'description', e.target.value)}
                                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Enter quality check description"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Quality Criteria
                                </label>
                                <textarea
                                  rows={2}
                                  value={check.criteria || ''}
                                  onChange={(e) => updateQualityCheck(index, 'criteria', e.target.value)}
                                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Enter quality criteria"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={addQualityCheck}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Quality Check
                        </button>
                      </div>
                    </div>
                  )}



                  {activeTab === 'cta' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          CTA Title
                        </label>
                        <input
                          type="text"
                          value={content.ctaTitle || ''}
                          onChange={(e) => updateContent('ctaTitle', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter CTA title"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          CTA Description
                        </label>
                        <textarea
                          rows={3}
                          value={content.ctaDescription || ''}
                          onChange={(e) => updateContent('ctaDescription', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter CTA description"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={onClose}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="h-3 w-3 mr-1" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 
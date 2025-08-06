'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-provider'
import { useRouter } from 'next/navigation'
import { logger } from '@/lib/logger';
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader';
import { 
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface SectorsOverviewContent {
  id: string
  title: string
  subtitle: string
  description: string
  whyChooseTitle: string
  whyChooseDescription: string
  whyChooseFeatures: string[]
  ctaText: string
  ctaLink: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function SectorsOverviewManagement() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [content, setContent] = useState<SectorsOverviewContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [editMode, setEditMode] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    whyChooseTitle: '',
    whyChooseDescription: '',
    whyChooseFeatures: [''],
    ctaText: '',
    ctaLink: ''
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/sectors-overview')
      if (response.ok) {
        const data = await response.json()
        setContent(data)
        setFormData({
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          whyChooseTitle: data.whyChooseTitle,
          whyChooseDescription: data.whyChooseDescription,
          whyChooseFeatures: data.whyChooseFeatures,
          ctaText: data.ctaText,
          ctaLink: data.ctaLink
        })
      } else {
        logger.error('Failed to fetch sectors overview content')
      }
    } catch (error) {
      logger.error('Error fetching sectors overview content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/sectors-overview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchContent()
        setEditMode(false)
      } else {
        logger.error('Failed to save content')
      }
    } catch (error) {
      logger.error('Error saving content:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (content) {
      setFormData({
        title: content.title,
        subtitle: content.subtitle,
        description: content.description,
        whyChooseTitle: content.whyChooseTitle,
        whyChooseDescription: content.whyChooseDescription,
        whyChooseFeatures: content.whyChooseFeatures,
        ctaText: content.ctaText,
        ctaLink: content.ctaLink
      })
    }
    setEditMode(false)
  }

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      whyChooseFeatures: [...prev.whyChooseFeatures, '']
    }))
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      whyChooseFeatures: prev.whyChooseFeatures.filter((_, i) => i !== index)
    }))
  }

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      whyChooseFeatures: prev.whyChooseFeatures.map((feature, i) => 
        i === index ? value : feature
      )
    }))
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="lg:pl-72">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Sectors Overview Content Management
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  Manage the content displayed on the sectors overview page including title, description, and "Why Choose Alkalyne?" section.
                </p>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none space-x-3">
                {!editMode ? (
                  <>
                    <button
                      onClick={() => setEditMode(true)}
                      className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      <PencilIcon className="-ml-0.5 h-5 w-5" />
                      Edit Content
                    </button>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="inline-flex items-center gap-x-1.5 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                    >
                      <EyeIcon className="-ml-0.5 h-5 w-5" />
                      {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-x-1.5 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50"
                    >
                      <CheckIcon className="-ml-0.5 h-5 w-5" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center gap-x-1.5 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                    >
                      <XMarkIcon className="-ml-0.5 h-5 w-5" />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Edit Form */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                  {editMode ? 'Edit Content' : 'Content Details'}
                </h2>
                
                <div className="space-y-6">
                  {/* Main Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      disabled={!editMode}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                      disabled={!editMode}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      disabled={!editMode}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  {/* Why Choose Section */}
                  <div className="border-t pt-6">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Why Choose Alkalyne Section</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={formData.whyChooseTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, whyChooseTitle: e.target.value }))}
                        disabled={!editMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section Description
                      </label>
                      <textarea
                        value={formData.whyChooseDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, whyChooseDescription: e.target.value }))}
                        disabled={!editMode}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Features
                      </label>
                      <div className="space-y-2">
                        {formData.whyChooseFeatures.map((feature, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => updateFeature(index, e.target.value)}
                              disabled={!editMode}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                              placeholder="Enter feature description"
                            />
                            {editMode && (
                              <button
                                onClick={() => removeFeature(index)}
                                className="px-3 py-2 text-red-600 hover:text-red-800"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        ))}
                        {editMode && (
                          <button
                            onClick={addFeature}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            + Add Feature
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="border-t pt-6">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Call to Action</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CTA Text
                      </label>
                      <input
                        type="text"
                        value={formData.ctaText}
                        onChange={(e) => setFormData(prev => ({ ...prev, ctaText: e.target.value }))}
                        disabled={!editMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CTA Link
                      </label>
                      <input
                        type="text"
                        value={formData.ctaLink}
                        onChange={(e) => setFormData(prev => ({ ...prev, ctaLink: e.target.value }))}
                        disabled={!editMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              {showPreview && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Content Preview</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{formData.title}</h3>
                      <p className="text-xl text-gray-600 mb-4">{formData.subtitle}</p>
                      <p className="text-gray-700">{formData.description}</p>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{formData.whyChooseTitle}</h3>
                      <p className="text-gray-700 mb-4">{formData.whyChooseDescription}</p>
                      
                      <div className="grid grid-cols-1 gap-3">
                        {formData.whyChooseFeatures.map((feature, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-md">
                            <div className="text-blue-600 font-medium">✓ {feature}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
                        {formData.ctaText}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 
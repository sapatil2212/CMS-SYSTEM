'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-provider'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ImageUpload from '@/components/admin/ImageUpload'
import SuccessModal from '@/components/admin/SuccessModal'
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, X, Save, Crown, Shield, Zap, Cog, CheckCircle, Users, Award, Clock, Target, Eye as EyeIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface AboutContent {
  id?: string
  title: string
  subtitle: string
  description: string
  image: string
}

interface AboutValue {
  id?: string
  icon: string
  title: string
  description: string
  order: number
  isActive: boolean
}

interface AboutCapability {
  id?: string
  icon: string
  title: string
  description: string
  order: number
  isActive: boolean
}

interface AboutMissionVision {
  id?: string
  type: string
  title: string
  description: string
  icon: string
}

const iconOptions = [
  { value: 'Crown', label: 'Crown' },
  { value: 'Shield', label: 'Shield' },
  { value: 'Zap', label: 'Zap' },
  { value: 'Cog', label: 'Cog' },
  { value: 'CheckCircle', label: 'CheckCircle' },
  { value: 'Users', label: 'Users' },
  { value: 'Award', label: 'Award' },
  { value: 'Clock', label: 'Clock' },
  { value: 'Target', label: 'Target' },
  { value: 'Eye', label: 'Eye' }
]

export default function AboutPage() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<'content' | 'values' | 'capabilities' | 'mission-vision'>('content')
  
  // Content states
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    title: '',
    subtitle: '',
    description: '',
    image: ''
  })
  const [savingContent, setSavingContent] = useState(false)

  // Values states
  const [values, setValues] = useState<AboutValue[]>([])
  const [isValueModalOpen, setIsValueModalOpen] = useState(false)
  const [editingValue, setEditingValue] = useState<AboutValue | null>(null)
  const [savingValue, setSavingValue] = useState(false)

  // Capabilities states
  const [capabilities, setCapabilities] = useState<AboutCapability[]>([])
  const [isCapabilityModalOpen, setIsCapabilityModalOpen] = useState(false)
  const [editingCapability, setEditingCapability] = useState<AboutCapability | null>(null)
  const [savingCapability, setSavingCapability] = useState(false)

  // Mission/Vision states
  const [missionVision, setMissionVision] = useState<AboutMissionVision[]>([])
  const [isMissionVisionModalOpen, setIsMissionVisionModalOpen] = useState(false)
  const [editingMissionVision, setEditingMissionVision] = useState<AboutMissionVision | null>(null)
  const [savingMissionVision, setSavingMissionVision] = useState(false)

  // Success modal
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: '' })

  const showSuccessModal = (message: string) => {
    setSuccessModal({ isOpen: true, message })
  }

  const hideSuccessModal = () => {
    setSuccessModal({ isOpen: false, message: '' })
  }

  useEffect(() => {
    if (user) {
      fetchAboutData()
    }
  }, [user])

  const fetchAboutData = async () => {
    try {
      const [contentRes, valuesRes, capabilitiesRes, missionVisionRes] = await Promise.all([
        fetch('/api/content/about-content'),
        fetch('/api/content/about-values'),
        fetch('/api/content/about-capabilities'),
        fetch('/api/content/about-mission-vision')
      ])

      if (contentRes.ok) {
        const content = await contentRes.json()
        setAboutContent(content)
      }

      if (valuesRes.ok) {
        const valuesData = await valuesRes.json()
        setValues(valuesData)
      }

      if (capabilitiesRes.ok) {
        const capabilitiesData = await capabilitiesRes.json()
        setCapabilities(capabilitiesData)
      }

      if (missionVisionRes.ok) {
        const missionVisionData = await missionVisionRes.json()
        setMissionVision(missionVisionData)
      }
    } catch (error) {
      console.error('Error fetching about data:', error)
    }
  }

  // Content handlers
  const handleSaveContent = async () => {
    setSavingContent(true)
    try {
      const response = await fetch('/api/content/about-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutContent)
      })

      if (response.ok) {
        showSuccessModal('About content saved successfully!')
      } else {
        toast.error('Failed to save about content')
      }
    } catch (error) {
      console.error('Error saving about content:', error)
      toast.error('Failed to save about content')
    } finally {
      setSavingContent(false)
    }
  }

  // Values handlers
  const handleValueSubmit = async (value: AboutValue) => {
    setSavingValue(true)
    try {
      const url = editingValue ? '/api/content/about-values' : '/api/content/about-values'
      const method = editingValue ? 'PUT' : 'POST'
      const body = editingValue ? { ...value, id: editingValue.id } : value

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        showSuccessModal(editingValue ? 'Value updated successfully!' : 'Value created successfully!')
        setIsValueModalOpen(false)
        setEditingValue(null)
        fetchAboutData()
      } else {
        toast.error('Failed to save value')
      }
    } catch (error) {
      console.error('Error saving value:', error)
      toast.error('Failed to save value')
    } finally {
      setSavingValue(false)
    }
  }

  const handleEditValue = (value: AboutValue) => {
    setEditingValue(value)
    setIsValueModalOpen(true)
  }

  const handleDeleteValue = async (id: string) => {
    if (confirm('Are you sure you want to delete this value?')) {
      try {
        const response = await fetch(`/api/content/about-values?id=${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          showSuccessModal('Value deleted successfully!')
          fetchAboutData()
        } else {
          toast.error('Failed to delete value')
        }
      } catch (error) {
        console.error('Error deleting value:', error)
        toast.error('Failed to delete value')
      }
    }
  }

  const handleToggleValueActive = async (value: AboutValue) => {
    try {
      const response = await fetch('/api/content/about-values', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...value, isActive: !value.isActive })
      })

      if (response.ok) {
        showSuccessModal(`Value ${value.isActive ? 'deactivated' : 'activated'} successfully!`)
        fetchAboutData()
      } else {
        toast.error('Failed to update value')
      }
    } catch (error) {
      console.error('Error updating value:', error)
      toast.error('Failed to update value')
    }
  }

  // Capabilities handlers
  const handleCapabilitySubmit = async (capability: AboutCapability) => {
    setSavingCapability(true)
    try {
      const url = editingCapability ? '/api/content/about-capabilities' : '/api/content/about-capabilities'
      const method = editingCapability ? 'PUT' : 'POST'
      const body = editingCapability ? { ...capability, id: editingCapability.id } : capability

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        showSuccessModal(editingCapability ? 'Capability updated successfully!' : 'Capability created successfully!')
        setIsCapabilityModalOpen(false)
        setEditingCapability(null)
        fetchAboutData()
      } else {
        toast.error('Failed to save capability')
      }
    } catch (error) {
      console.error('Error saving capability:', error)
      toast.error('Failed to save capability')
    } finally {
      setSavingCapability(false)
    }
  }

  const handleEditCapability = (capability: AboutCapability) => {
    setEditingCapability(capability)
    setIsCapabilityModalOpen(true)
  }

  const handleDeleteCapability = async (id: string) => {
    if (confirm('Are you sure you want to delete this capability?')) {
      try {
        const response = await fetch(`/api/content/about-capabilities?id=${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          showSuccessModal('Capability deleted successfully!')
          fetchAboutData()
        } else {
          toast.error('Failed to delete capability')
        }
      } catch (error) {
        console.error('Error deleting capability:', error)
        toast.error('Failed to delete capability')
      }
    }
  }

  const handleToggleCapabilityActive = async (capability: AboutCapability) => {
    try {
      const response = await fetch('/api/content/about-capabilities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...capability, isActive: !capability.isActive })
      })

      if (response.ok) {
        showSuccessModal(`Capability ${capability.isActive ? 'deactivated' : 'activated'} successfully!`)
        fetchAboutData()
      } else {
        toast.error('Failed to update capability')
      }
    } catch (error) {
      console.error('Error updating capability:', error)
      toast.error('Failed to update capability')
    }
  }

  // Mission/Vision handlers
  const handleMissionVisionSubmit = async (missionVision: AboutMissionVision) => {
    setSavingMissionVision(true)
    try {
      const url = editingMissionVision ? '/api/content/about-mission-vision' : '/api/content/about-mission-vision'
      const method = editingMissionVision ? 'PUT' : 'POST'
      const body = editingMissionVision ? { ...missionVision, id: editingMissionVision.id } : missionVision

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        showSuccessModal(editingMissionVision ? 'Mission/Vision updated successfully!' : 'Mission/Vision created successfully!')
        setIsMissionVisionModalOpen(false)
        setEditingMissionVision(null)
        fetchAboutData()
      } else {
        toast.error('Failed to save mission/vision')
      }
    } catch (error) {
      console.error('Error saving mission/vision:', error)
      toast.error('Failed to save mission/vision')
    } finally {
      setSavingMissionVision(false)
    }
  }

  const handleEditMissionVision = (missionVision: AboutMissionVision) => {
    setEditingMissionVision(missionVision)
    setIsMissionVisionModalOpen(true)
  }

  const handleDeleteMissionVision = async (id: string) => {
    if (confirm('Are you sure you want to delete this mission/vision?')) {
      try {
        const response = await fetch(`/api/content/about-mission-vision?id=${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          showSuccessModal('Mission/Vision deleted successfully!')
          fetchAboutData()
        } else {
          toast.error('Failed to delete mission/vision')
        }
      } catch (error) {
        console.error('Error deleting mission/vision:', error)
        toast.error('Failed to delete mission/vision')
      }
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="lg:pl-64">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-xl font-bold text-gray-900">About Us Content Management</h1>
              <p className="text-gray-600 mt-2">Manage all content for the About Us page</p>
            </div>

            {/* Toggle Menu */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-2 shadow-lg">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveSection('content')}
                    className={`group relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                      activeSection === 'content'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                        : 'text-blue-700 hover:bg-white/80 hover:shadow-md'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeSection === 'content' ? 'bg-white' : 'bg-blue-400'
                      }`} />
                      Main Content
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('values')}
                    className={`group relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                      activeSection === 'values'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                        : 'text-blue-700 hover:bg-white/80 hover:shadow-md'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeSection === 'values' ? 'bg-white' : 'bg-blue-400'
                      }`} />
                      Our Values
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('capabilities')}
                    className={`group relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                      activeSection === 'capabilities'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                        : 'text-blue-700 hover:bg-white/80 hover:shadow-md'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeSection === 'capabilities' ? 'bg-white' : 'bg-blue-400'
                      }`} />
                      Capabilities
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('mission-vision')}
                    className={`group relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                      activeSection === 'mission-vision'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                        : 'text-blue-700 hover:bg-white/80 hover:shadow-md'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeSection === 'mission-vision' ? 'bg-white' : 'bg-blue-400'
                      }`} />
                      Mission & Vision
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Section */}
            {activeSection === 'content' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Main Content</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={aboutContent.title}
                      onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="About Alkalyne"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                    <input
                      type="text"
                      value={aboutContent.subtitle}
                      onChange={(e) => setAboutContent({ ...aboutContent, subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Precision in Every Layer. Commitment in Every Process."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={aboutContent.description}
                      onChange={(e) => setAboutContent({ ...aboutContent, description: e.target.value })}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter the main description..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex-1">
                        <ImageUpload
                          value={aboutContent.image}
                          onChange={(url) => setAboutContent({ ...aboutContent, image: url })}
                          label=""
                        />
                      </div>
                      
                      <div className="flex-1">
                        {aboutContent.image && (
                          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Image Preview</h4>
                            <div className="relative">
                              <img 
                                src={aboutContent.image} 
                                alt="Current about image" 
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                Current
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Uploading a new image will automatically replace this one
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        onClick={handleSaveContent}
                        disabled={savingContent}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        {savingContent ? 'Saving...' : 'Save Content'}
                        <Save className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Values Section */}
            {activeSection === 'values' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Our Values</h2>
                  <button
                    onClick={() => {
                      setEditingValue(null)
                      setIsValueModalOpen(true)
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Value
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {values.map((value) => (
                    <div key={value.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            value.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {value.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditValue(value)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteValue(value.id!)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleValueActive(value)}
                            className={value.isActive ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}
                          >
                            {value.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{value.description}</p>
                      <div className="text-xs text-gray-500">Icon: {value.icon}</div>
                      <div className="text-xs text-gray-500">Order: {value.order}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Capabilities Section */}
            {activeSection === 'capabilities' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Capabilities</h2>
                  <button
                    onClick={() => {
                      setEditingCapability(null)
                      setIsCapabilityModalOpen(true)
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Capability
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {capabilities.map((capability) => (
                    <div key={capability.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            capability.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {capability.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditCapability(capability)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCapability(capability.id!)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleCapabilityActive(capability)}
                            className={capability.isActive ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}
                          >
                            {capability.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{capability.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{capability.description}</p>
                      <div className="text-xs text-gray-500">Icon: {capability.icon}</div>
                      <div className="text-xs text-gray-500">Order: {capability.order}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mission & Vision Section */}
            {activeSection === 'mission-vision' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Mission & Vision</h2>
                  <button
                    onClick={() => {
                      setEditingMissionVision(null)
                      setIsMissionVisionModalOpen(true)
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Mission/Vision
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {missionVision.map((mv) => (
                    <div key={mv.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {mv.type}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditMissionVision(mv)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMissionVision(mv.id!)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{mv.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{mv.description}</p>
                      <div className="text-xs text-gray-500">Icon: {mv.icon}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Value Modal */}
      {isValueModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingValue ? 'Edit Value' : 'Add New Value'}
            </h3>
            
            <ValueForm
              value={editingValue || { icon: '', title: '', description: '', order: 0, isActive: true }}
              onSubmit={handleValueSubmit}
              onCancel={() => {
                setIsValueModalOpen(false)
                setEditingValue(null)
              }}
              saving={savingValue}
            />
          </div>
        </div>
      )}

      {/* Capability Modal */}
      {isCapabilityModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingCapability ? 'Edit Capability' : 'Add New Capability'}
            </h3>
            
            <CapabilityForm
              capability={editingCapability || { icon: '', title: '', description: '', order: 0, isActive: true }}
              onSubmit={handleCapabilitySubmit}
              onCancel={() => {
                setIsCapabilityModalOpen(false)
                setEditingCapability(null)
              }}
              saving={savingCapability}
            />
          </div>
        </div>
      )}

      {/* Mission/Vision Modal */}
      {isMissionVisionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingMissionVision ? 'Edit Mission/Vision' : 'Add New Mission/Vision'}
            </h3>
            
            <MissionVisionForm
              missionVision={editingMissionVision || { type: 'mission', title: '', description: '', icon: '' }}
              onSubmit={handleMissionVisionSubmit}
              onCancel={() => {
                setIsMissionVisionModalOpen(false)
                setEditingMissionVision(null)
              }}
              saving={savingMissionVision}
            />
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModal.isOpen}
        message={successModal.message}
        onClose={hideSuccessModal}
      />
    </div>
  )
}

// Form Components
interface ValueFormProps {
  value: AboutValue
  onSubmit: (value: AboutValue) => void
  onCancel: () => void
  saving: boolean
}

function ValueForm({ value, onSubmit, onCancel, saving }: ValueFormProps) {
  const [formData, setFormData] = useState(value)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
        <select
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select an icon</option>
          {iconOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
        <input
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Active
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

interface CapabilityFormProps {
  capability: AboutCapability
  onSubmit: (capability: AboutCapability) => void
  onCancel: () => void
  saving: boolean
}

function CapabilityForm({ capability, onSubmit, onCancel, saving }: CapabilityFormProps) {
  const [formData, setFormData] = useState(capability)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
        <select
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select an icon</option>
          {iconOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
        <input
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Active
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

interface MissionVisionFormProps {
  missionVision: AboutMissionVision
  onSubmit: (missionVision: AboutMissionVision) => void
  onCancel: () => void
  saving: boolean
}

function MissionVisionForm({ missionVision, onSubmit, onCancel, saving }: MissionVisionFormProps) {
  const [formData, setFormData] = useState(missionVision)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="mission">Mission</option>
          <option value="vision">Vision</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
        <select
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select an icon</option>
          {iconOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
} 
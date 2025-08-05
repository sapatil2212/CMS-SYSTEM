'use client'
import { useState, useEffect } from 'react'
import { 
  Settings, Share2, Link, Briefcase, Plus, Edit, Trash2, Save, X, 
  CheckCircle, AlertCircle, Upload, Eye, EyeOff, GripVertical, Copy, 
  ExternalLink, Globe, Phone, Mail, MapPin, Building2, Users, Sparkles,
  Loader2
} from 'lucide-react'
import ImageUpload from './ImageUpload'
import ProfessionalLoader from '@/components/ui/ProfessionalLoader'

interface FooterSettings {
  id: string
  logoUrl?: string
  logoAlt?: string
  description: string
  phoneNumber?: string
  email?: string
  address: string
}

interface FooterSocialMedia {
  id: string
  platform: string
  url: string
  icon: string
  isActive: boolean
  order: number
}

interface FooterQuickLink {
  id: string
  name: string
  href: string
  order: number
  isActive: boolean
}

interface FooterService {
  id: string
  name: string
  order: number
  isActive: boolean
}

export default function FooterManagement() {
  const [activeTab, setActiveTab] = useState<'settings' | 'social' | 'links' | 'services'>('settings')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [deleteType, setDeleteType] = useState<'social' | 'link' | 'service' | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Settings state
  const [settings, setSettings] = useState<FooterSettings | null>(null)
  const [editingSettings, setEditingSettings] = useState(false)
  const [settingsForm, setSettingsForm] = useState<Partial<FooterSettings>>({})

  // Social media state
  const [socialMedia, setSocialMedia] = useState<FooterSocialMedia[]>([])
  const [editingSocial, setEditingSocial] = useState<string | null>(null)
  const [socialForm, setSocialForm] = useState<Partial<FooterSocialMedia>>({})
  const [showSocialForm, setShowSocialForm] = useState(false)

  // Quick links state
  const [quickLinks, setQuickLinks] = useState<FooterQuickLink[]>([])
  const [editingLink, setEditingLink] = useState<string | null>(null)
  const [linkForm, setLinkForm] = useState<Partial<FooterQuickLink>>({})
  const [showLinkForm, setShowLinkForm] = useState(false)

  // Services state
  const [services, setServices] = useState<FooterService[]>([])
  const [editingService, setEditingService] = useState<string | null>(null)
  const [serviceForm, setServiceForm] = useState<Partial<FooterService>>({})
  const [showServiceForm, setShowServiceForm] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch all data in parallel
      const [settingsRes, socialRes, linksRes, servicesRes] = await Promise.all([
        fetch('/api/content/footer-settings'),
        fetch('/api/content/footer-social-media'),
        fetch('/api/content/footer-quick-links'),
        fetch('/api/content/footer-services')
      ])

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        setSettings(settingsData)
        setSettingsForm(settingsData)
      }

      if (socialRes.ok) {
        const socialData = await socialRes.json()
        setSocialMedia(socialData)
      }

      if (linksRes.ok) {
        const linksData = await linksRes.json()
        setQuickLinks(linksData)
      }

      if (servicesRes.ok) {
        const servicesData = await servicesRes.json()
        setServices(servicesData)
      }
    } catch (error) {
      console.error('Error fetching footer data:', error)
      setMessage({ type: 'error', text: 'Failed to load footer data' })
    } finally {
      setLoading(false)
    }
  }

  // Settings functions
  const handleSaveSettings = async () => {
    try {
      setIsProcessing(true)
      
      // Try PUT method first
      let response = await fetch('/api/content/footer-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      })

      // If PUT fails, try POST as fallback
      if (!response.ok) {
        response = await fetch('/api/content/footer-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settingsForm)
        })
      }

      if (response.ok) {
        const updatedSettings = await response.json()
        setSettings(updatedSettings)
        setEditingSettings(false)
        setSuccessMessage('Footer settings updated successfully!')
        setShowSuccessModal(true)
      } else {
        const errorText = await response.text()
        throw new Error(`Failed to update settings: ${response.status} ${errorText}`)
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      setMessage({ type: 'error', text: `Failed to update settings: ${error instanceof Error ? error.message : 'Unknown error'}` })
    } finally {
      setIsProcessing(false)
    }
  }

  // Social media functions
  const handleSaveSocial = async () => {
    try {
      setIsProcessing(true)
      const method = editingSocial ? 'PUT' : 'POST'
      const url = '/api/content/footer-social-media'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSocial ? { ...socialForm, id: editingSocial } : socialForm)
      })

      if (response.ok) {
        await fetchData()
        setEditingSocial(null)
        setSocialForm({})
        setShowSocialForm(false)
        setSuccessMessage(`Social media ${editingSocial ? 'updated' : 'created'} successfully!`)
        setShowSuccessModal(true)
      } else {
        throw new Error('Failed to save social media')
      }
    } catch (error) {
      console.error('Error saving social media:', error)
      setMessage({ type: 'error', text: 'Failed to save social media' })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteSocial = async (id: string) => {
    setIsDeleting(id)
    setDeleteType('social')
  }

  // Quick links functions
  const handleSaveLink = async () => {
    try {
      setIsProcessing(true)
      const method = editingLink ? 'PUT' : 'POST'
      const url = '/api/content/footer-quick-links'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingLink ? { ...linkForm, id: editingLink } : linkForm)
      })

      if (response.ok) {
        await fetchData()
        setEditingLink(null)
        setLinkForm({})
        setShowLinkForm(false)
        setSuccessMessage(`Quick link ${editingLink ? 'updated' : 'created'} successfully!`)
        setShowSuccessModal(true)
      } else {
        throw new Error('Failed to save quick link')
      }
    } catch (error) {
      console.error('Error saving quick link:', error)
      setMessage({ type: 'error', text: 'Failed to save quick link' })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteLink = async (id: string) => {
    setIsDeleting(id)
    setDeleteType('link')
  }

  // Services functions
  const handleSaveService = async () => {
    try {
      setIsProcessing(true)
      const method = editingService ? 'PUT' : 'POST'
      const url = '/api/content/footer-services'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService ? { ...serviceForm, id: editingService } : serviceForm)
      })

      if (response.ok) {
        await fetchData()
        setEditingService(null)
        setServiceForm({})
        setShowServiceForm(false)
        setSuccessMessage(`Service ${editingService ? 'updated' : 'created'} successfully!`)
        setShowSuccessModal(true)
      } else {
        throw new Error('Failed to save service')
      }
    } catch (error) {
      console.error('Error saving service:', error)
      setMessage({ type: 'error', text: 'Failed to save service' })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteService = async (id: string) => {
    setIsDeleting(id)
    setDeleteType('service')
  }

  const confirmDelete = async () => {
    if (!isDeleting || !deleteType) return
    
    try {
      setIsProcessing(true)
      let endpoint = ''
      
      switch(deleteType) {
        case 'social':
          endpoint = '/api/content/footer-social-media'
          break
        case 'link':
          endpoint = '/api/content/footer-quick-links'
          break
        case 'service':
          endpoint = '/api/content/footer-services'
          break
      }

      const response = await fetch(`${endpoint}?id=${isDeleting}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchData()
        setSuccessMessage(`${deleteType === 'social' ? 'Social media' : deleteType === 'link' ? 'Quick link' : 'Service'} deleted successfully!`)
        setShowSuccessModal(true)
      } else {
        throw new Error('Failed to delete')
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to delete ${deleteType}` })
    } finally {
      setIsDeleting(null)
      setDeleteType(null)
      setIsProcessing(false)
      setTimeout(() => {
        setShowSuccessModal(false)
      }, 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <ProfessionalLoader 
          size="lg"
          title="Loading Footer Content"
          subtitle="Fetching footer management data..."
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-indigo-600" />
              Footer Content Management
            </h1>
            <p className="mt-2 text-gray-600">
              Configure and manage all footer content including logo, contact information, and navigation links
            </p>
          </div>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mt-0.5 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 mt-0.5 text-red-600 flex-shrink-0" />
          )}
          <div>
            <p className="font-medium">{message.text}</p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Success!</h3>
                <p className="text-gray-600 mt-1">{successMessage}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                <p className="text-gray-600 mt-1">
                  Are you sure you want to delete this {deleteType}? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleting(null)
                  setDeleteType(null)
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Confirm Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'settings', name: 'Settings', icon: Settings },
            { id: 'social', name: 'Social Media', icon: Share2 },
            { id: 'links', name: 'Quick Links', icon: Link },
            { id: 'services', name: 'Services', icon: Briefcase }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-white shadow text-indigo-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Footer Settings</h2>
                <p className="text-gray-600 mt-1">
                  Configure your footer logo, contact information, and description
                </p>
              </div>
              {!editingSettings ? (
                <button
                  onClick={() => setEditingSettings(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Edit Settings
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveSettings}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditingSettings(false)
                      setSettingsForm(settings || {})
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {editingSettings ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Logo and Description Section */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-gray-500" />
                      Branding
                    </h3>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Footer Logo
                        </label>
                        <ImageUpload
                          label="Upload Logo"
                          value={settingsForm.logoUrl || ''}
                          onChange={(url) => setSettingsForm({ ...settingsForm, logoUrl: url })}
                          required={false}
                          maxSize={2}
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          className="compact-upload"
                        />
                        {settingsForm.logoUrl && (
                          <div className="mt-3 flex justify-center">
                            <div className="p-2 border border-gray-200 rounded-lg">
                              <img
                                src={settingsForm.logoUrl}
                                alt="Logo preview"
                                className="h-20 object-contain"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Logo Alt Text
                        </label>
                        <input
                          type="text"
                          value={settingsForm.logoAlt || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, logoAlt: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter alt text for accessibility"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={settingsForm.description || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter footer description"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-gray-500" />
                      Contact Information
                    </h3>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={settingsForm.phoneNumber || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, phoneNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={settingsForm.email || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="contact@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Address
                        </label>
                        <textarea
                          value={settingsForm.address || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter your business address"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Logo and Description Preview */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-gray-500" />
                    Branding
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Footer Logo
                      </label>
                      {settings?.logoUrl ? (
                        <div className="flex items-center gap-4">
                          <div className="p-2 border border-gray-200 rounded-lg bg-white">
                            <img
                              src={settings.logoUrl}
                              alt={settings.logoAlt || 'Company logo'}
                              className="h-16 object-contain"
                            />
                          </div>
                          <div className="text-sm text-gray-600">
                            <p className="font-medium">Current logo</p>
                            <p className="text-gray-500 mt-1">
                              Alt text: {settings.logoAlt || 'Not specified'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No logo uploaded</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-gray-600">{settings?.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Preview */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    Contact Information
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </label>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-gray-600">
                          {settings?.phoneNumber || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </label>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-gray-600">
                          {settings?.email || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Address
                      </label>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-gray-600 whitespace-pre-line">
                          {settings?.address || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Social Media Tab */}
        {activeTab === 'social' && (
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Social Media Links</h2>
                <p className="text-gray-600 mt-1">
                  Manage your social media presence in the footer
                </p>
              </div>
              <button
                onClick={() => {
                  setShowSocialForm(true)
                  setSocialForm({})
                  setEditingSocial(null)
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Social Media
              </button>
            </div>

            {showSocialForm && (
              <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-indigo-600" />
                  {editingSocial ? 'Edit Social Media' : 'Add New Social Media'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform
                    </label>
                    <input
                      type="text"
                      value={socialForm.platform || ''}
                      onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Facebook, Twitter"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL
                    </label>
                    <input
                      type="url"
                      value={socialForm.url || ''}
                      onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <input
                      type="text"
                      value={socialForm.icon || ''}
                      onChange={(e) => setSocialForm({ ...socialForm, icon: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="facebook, twitter, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={socialForm.order || 0}
                      onChange={(e) => setSocialForm({ ...socialForm, order: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSaveSocial}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowSocialForm(false)
                      setSocialForm({})
                      setEditingSocial(null)
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {socialMedia.map((social) => (
                <div key={social.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full flex-shrink-0 ${social.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <h4 className="font-medium text-gray-900 capitalize">{social.platform}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              social.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {social.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              Order: {social.order}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingSocial(social.id)
                            setSocialForm(social)
                            setShowSocialForm(true)
                          }}
                          className="p-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSocial(social.id)}
                          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="h-4 w-4 flex-shrink-0" />
                      <a 
                        href={social.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="truncate hover:text-indigo-600 transition-colors"
                      >
                        {social.url}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links Tab */}
        {activeTab === 'links' && (
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Quick Links</h2>
                <p className="text-gray-600 mt-1">
                  Manage navigation links in the footer
                </p>
              </div>
              <button
                onClick={() => {
                  setShowLinkForm(true)
                  setLinkForm({})
                  setEditingLink(null)
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Quick Link
              </button>
            </div>

            {showLinkForm && (
              <div className="bg-green-50 p-6 rounded-lg border border-green-100 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Link className="h-5 w-5 text-green-600" />
                  {editingLink ? 'Edit Quick Link' : 'Add New Quick Link'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link Name
                    </label>
                    <input
                      type="text"
                      value={linkForm.name || ''}
                      onChange={(e) => setLinkForm({ ...linkForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="About Us, Contact, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL
                    </label>
                    <input
                      type="text"
                      value={linkForm.href || ''}
                      onChange={(e) => setLinkForm({ ...linkForm, href: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="/about, /contact, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={linkForm.order || 0}
                      onChange={(e) => setLinkForm({ ...linkForm, order: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSaveLink}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowLinkForm(false)
                      setLinkForm({})
                      setEditingLink(null)
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickLinks.map((link) => (
                <div key={link.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full flex-shrink-0 ${link.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <h4 className="font-medium text-gray-900">{link.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              link.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {link.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              Order: {link.order}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingLink(link.id)
                            setLinkForm(link)
                            setShowLinkForm(true)
                          }}
                          className="p-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                      <ExternalLink className="h-4 w-4 flex-shrink-0" />
                      <a 
                        href={link.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="truncate hover:text-indigo-600 transition-colors"
                      >
                        {link.href}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Services</h2>
                <p className="text-gray-600 mt-1">
                  Manage services listed in the footer
                </p>
              </div>
              <button
                onClick={() => {
                  setShowServiceForm(true)
                  setServiceForm({})
                  setEditingService(null)
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Service
              </button>
            </div>

            {showServiceForm && (
              <div className="bg-orange-50 p-6 rounded-lg border border-orange-100 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-orange-600" />
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={serviceForm.name || ''}
                      onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Web Design, Consulting, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={serviceForm.order || 0}
                      onChange={(e) => setServiceForm({ ...serviceForm, order: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSaveService}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowServiceForm(false)
                      setServiceForm({})
                      setEditingService(null)
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <div key={service.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full flex-shrink-0 ${service.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <h4 className="font-medium text-gray-900">{service.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {service.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              Order: {service.order}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingService(service.id)
                            setServiceForm(service)
                            setShowServiceForm(true)
                          }}
                          className="p-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
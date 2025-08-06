'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, 
  Share2, 
  Link, 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  CheckCircle,
  AlertCircle,
  Upload,
  Eye,
  EyeOff,
  Globe,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ExternalLink
} from 'lucide-react'
import { logger } from '@/lib/logger';
import ImageUpload from './ImageUpload';

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

export default function ModernFooterManagement() {
  const [activeTab, setActiveTab] = useState<'settings' | 'social' | 'links' | 'services'>('settings')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [previewMode, setPreviewMode] = useState(false)
  
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
      logger.error('Error fetching footer data:', error)
      setMessage({ type: 'error', text: 'Failed to load footer data' })
    } finally {
      setLoading(false)
    }
  }

  // Settings functions
  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/content/footer-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      })
      
      if (response.ok) {
        const updatedSettings = await response.json()
        setSettings(updatedSettings)
        setEditingSettings(false)
        setSuccessMessage('Footer settings updated successfully!')
        setShowSuccessModal(true)
        setTimeout(() => {
          setShowSuccessModal(false)
        }, 3000)
      } else {
        throw new Error('Failed to update settings')
      }
    } catch (error) {
      logger.error('Error updating settings:', error)
      setMessage({ type: 'error', text: 'Failed to update settings' })
    }
  }

  // Social media functions
  const handleSaveSocial = async () => {
    try {
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
        setTimeout(() => {
          setShowSuccessModal(false)
        }, 3000)
      } else {
        throw new Error('Failed to save social media')
      }
    } catch (error) {
      logger.error('Error saving social media:', error)
      setMessage({ type: 'error', text: 'Failed to save social media' })
    }
  }

  const handleDeleteSocial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social media link?')) return
    
    try {
      const response = await fetch(`/api/content/footer-social-media?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchData()
        setSuccessMessage('Social media deleted successfully!')
        setShowSuccessModal(true)
        setTimeout(() => {
          setShowSuccessModal(false)
        }, 3000)
      } else {
        throw new Error('Failed to delete social media')
      }
    } catch (error) {
      logger.error('Error deleting social media:', error)
      setMessage({ type: 'error', text: 'Failed to delete social media' })
    }
  }

  // Quick links functions
  const handleSaveLink = async () => {
    try {
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
        setTimeout(() => {
          setShowSuccessModal(false)
        }, 3000)
      } else {
        throw new Error('Failed to save quick link')
      }
    } catch (error) {
      logger.error('Error saving quick link:', error)
      setMessage({ type: 'error', text: 'Failed to save quick link' })
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quick link?')) return
    
    try {
      const response = await fetch(`/api/content/footer-quick-links?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchData()
        setSuccessMessage('Quick link deleted successfully!')
        setShowSuccessModal(true)
        setTimeout(() => {
          setShowSuccessModal(false)
        }, 3000)
      } else {
        throw new Error('Failed to delete quick link')
      }
    } catch (error) {
      logger.error('Error deleting quick link:', error)
      setMessage({ type: 'error', text: 'Failed to delete quick link' })
    }
  }

  // Services functions
  const handleSaveService = async () => {
    try {
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
        setTimeout(() => {
          setShowSuccessModal(false)
        }, 3000)
      } else {
        throw new Error('Failed to save service')
      }
    } catch (error) {
      logger.error('Error saving service:', error)
      setMessage({ type: 'error', text: 'Failed to save service' })
    }
  }

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    
    try {
      const response = await fetch(`/api/content/footer-services?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchData()
        setSuccessMessage('Service deleted successfully!')
        setShowSuccessModal(true)
        setTimeout(() => {
          setShowSuccessModal(false)
        }, 3000)
      } else {
        throw new Error('Failed to delete service')
      }
    } catch (error) {
      logger.error('Error deleting service:', error)
      setMessage({ type: 'error', text: 'Failed to delete service' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading footer data...</span>
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
        
        .tab-indicator {
          transition: all 0.3s ease;
        }
        
        .card-hover {
          transition: all 0.2s ease;
        }
        
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .form-input {
          transition: all 0.2s ease;
        }
        
        .form-input:focus {
          transform: scale(1.02);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .btn-success {
          background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
          transition: all 0.3s ease;
        }
        
        .btn-success:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(74, 222, 128, 0.4);
        }
        
        .btn-danger {
          background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
          transition: all 0.3s ease;
        }
        
        .btn-danger:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(248, 113, 113, 0.4);
        }
      `}</style>
      
      <div className="space-y-6">
        {/* Header with Preview Mode */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Sparkles className="h-6 w-6 mr-2 text-blue-600" />
              Footer Content Management
            </h2>
            <p className="text-gray-600 mt-1">Manage your website footer content and settings</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                previewMode 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{previewMode ? 'Hide Preview' : 'Show Preview'}</span>
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-xl flex items-center space-x-3 shadow-sm border ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 relative shadow-2xl transform transition-all duration-300 scale-100">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Success!</h3>
                  <p className="text-gray-600">{successMessage}</p>
                </div>
              </div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Changes have been saved and will be reflected on the website.</p>
              </div>
            </div>
          </div>
        )}

        {/* Modern Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <nav className="flex space-x-1 p-2 bg-gray-50">
            {[
              { id: 'settings', name: 'Settings', icon: Settings, color: 'blue' },
              { id: 'social', name: 'Social Media', icon: Share2, color: 'purple' },
              { id: 'links', name: 'Quick Links', icon: Link, color: 'green' },
              { id: 'services', name: 'Services', icon: Briefcase, color: 'orange' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 relative ${
                  activeTab === tab.id
                    ? `bg-white text-${tab.color}-600 shadow-sm border border-${tab.color}-200`
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
                {activeTab === tab.id && (
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${tab.color}-600 rounded-full`}></div>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Footer Settings</h3>
                  <p className="text-gray-600 mt-1">Configure your footer logo, contact information, and description</p>
                </div>
                {!editingSettings ? (
                  <button
                    onClick={() => setEditingSettings(true)}
                    className="btn-primary flex items-center space-x-2 px-4 py-2 text-white rounded-lg"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Settings</span>
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveSettings}
                      className="btn-success flex items-center space-x-2 px-4 py-2 text-white rounded-lg"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingSettings(false)
                        setSettingsForm(settings || {})
                      }}
                      className="bg-gray-600 hover:bg-gray-700 flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all duration-200"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              {editingSettings ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                      <ImageUpload
                        label="Footer Logo"
                        value={settingsForm.logoUrl || ''}
                        onChange={(url) => setSettingsForm({ ...settingsForm, logoUrl: url })}
                        required={false}
                        maxSize={2}
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="compact-upload"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Logo Alt Text</label>
                      <input
                        type="text"
                        value={settingsForm.logoAlt || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, logoAlt: e.target.value })}
                        className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter alt text for logo"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={settingsForm.description || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
                        rows={4}
                        className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter footer description"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={settingsForm.phoneNumber || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phoneNumber: e.target.value })}
                        className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={settingsForm.email || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="contact@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Address
                      </label>
                      <textarea
                        value={settingsForm.address || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        rows={3}
                        className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your business address"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                      {settings?.logoUrl ? (
                        <div className="flex items-center space-x-3">
                          <img src={settings.logoUrl} alt={settings.logoAlt} className="h-12 w-auto rounded border" />
                          <div className="text-sm text-gray-600">
                            <p className="font-medium">Current logo</p>
                            <p className="text-xs text-gray-500">Alt text: {settings.logoAlt || 'Not set'}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No logo uploaded</p>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <p className="text-gray-600">{settings?.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        Phone Number
                      </label>
                      <p className="text-gray-600">{settings?.phoneNumber || 'Not set'}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Address
                      </label>
                      <p className="text-gray-600">{settings?.email || 'Not set'}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Address
                      </label>
                      <p className="text-gray-600 whitespace-pre-line">{settings?.address || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Social Media Links</h3>
                  <p className="text-gray-600 mt-1">Manage your social media presence in the footer</p>
                </div>
                <button
                  onClick={() => {
                    setShowSocialForm(true)
                    setSocialForm({})
                    setEditingSocial(null)
                  }}
                  className="btn-primary flex items-center space-x-2 px-4 py-2 text-white rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Social Media</span>
                </button>
              </div>

              {showSocialForm && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Share2 className="h-5 w-5 mr-2 text-purple-600" />
                    {editingSocial ? 'Edit Social Media' : 'Add New Social Media'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                      <input
                        type="text"
                        value={socialForm.platform || ''}
                        onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value })}
                        className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., facebook, twitter, instagram"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                      <input
                        type="url"
                        value={socialForm.url || ''}
                        onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })}
                        className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                      <input
                        type="text"
                        value={socialForm.icon || ''}
                        onChange={(e) => setSocialForm({ ...socialForm, icon: e.target.value })}
                        className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="facebook, twitter, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                      <input
                        type="number"
                        value={socialForm.order || 0}
                        onChange={(e) => setSocialForm({ ...socialForm, order: parseInt(e.target.value) })}
                        className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={handleSaveSocial}
                      className="btn-success flex items-center space-x-2 px-4 py-2 text-white rounded-lg"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowSocialForm(false)
                        setSocialForm({})
                        setEditingSocial(null)
                      }}
                      className="bg-gray-600 hover:bg-gray-700 flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all duration-200"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {socialMedia.map((social) => (
                  <div key={social.id} className="card-hover bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${social.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm font-medium text-gray-900 capitalize">{social.platform}</span>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => {
                            setEditingSocial(social.id)
                            setSocialForm(social)
                            setShowSocialForm(true)
                          }}
                          className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSocial(social.id)}
                          className="p-1 text-red-600 hover:text-red-700 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Globe className="h-4 w-4" />
                        <span className="truncate">{social.url}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">Order: {social.order}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          social.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {social.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Links Tab */}
          {activeTab === 'links' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Quick Links</h3>
                  <p className="text-gray-600 mt-1">Manage navigation links in the footer</p>
                </div>
                <button
                  onClick={() => {
                    setShowLinkForm(true)
                    setLinkForm({})
                    setEditingLink(null)
                  }}
                  className="btn-primary flex items-center space-x-2 px-4 py-2 text-white rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Quick Link</span>
                </button>
              </div>

              {showLinkForm && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Link className="h-5 w-5 mr-2 text-green-600" />
                    {editingLink ? 'Edit Quick Link' : 'Add New Quick Link'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={linkForm.name || ''}
                        onChange={(e) => setLinkForm({ ...linkForm, name: e.target.value })}
                        className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Link name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                      <input
                        type="text"
                        value={linkForm.href || ''}
                        onChange={(e) => setLinkForm({ ...linkForm, href: e.target.value })}
                        className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="/about, /contact, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                      <input
                        type="number"
                        value={linkForm.order || 0}
                        onChange={(e) => setLinkForm({ ...linkForm, order: parseInt(e.target.value) })}
                        className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={handleSaveLink}
                      className="btn-success flex items-center space-x-2 px-4 py-2 text-white rounded-lg"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowLinkForm(false)
                        setLinkForm({})
                        setEditingLink(null)
                      }}
                      className="bg-gray-600 hover:bg-gray-700 flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all duration-200"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickLinks.map((link) => (
                  <div key={link.id} className="card-hover bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${link.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm font-medium text-gray-900">{link.name}</span>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => {
                            setEditingLink(link.id)
                            setLinkForm(link)
                            setShowLinkForm(true)
                          }}
                          className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="p-1 text-red-600 hover:text-red-700 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <ExternalLink className="h-4 w-4" />
                        <span className="truncate">{link.href}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">Order: {link.order}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          link.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {link.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Services</h3>
                  <p className="text-gray-600 mt-1">Manage services listed in the footer</p>
                </div>
                <button
                  onClick={() => {
                    setShowServiceForm(true)
                    setServiceForm({})
                    setEditingService(null)
                  }}
                  className="btn-primary flex items-center space-x-2 px-4 py-2 text-white rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Service</span>
                </button>
              </div>

              {showServiceForm && (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-orange-600" />
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                      <input
                        type="text"
                        value={serviceForm.name || ''}
                        onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                        className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Service name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                      <input
                        type="number"
                        value={serviceForm.order || 0}
                        onChange={(e) => setServiceForm({ ...serviceForm, order: parseInt(e.target.value) })}
                        className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={handleSaveService}
                      className="btn-success flex items-center space-x-2 px-4 py-2 text-white rounded-lg"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowServiceForm(false)
                        setServiceForm({})
                        setEditingService(null)
                      }}
                      className="bg-gray-600 hover:bg-gray-700 flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all duration-200"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div key={service.id} className="card-hover bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${service.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm font-medium text-gray-900">{service.name}</span>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => {
                            setEditingService(service.id)
                            setServiceForm(service)
                            setShowServiceForm(true)
                          }}
                          className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="p-1 text-red-600 hover:text-red-700 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">Order: {service.order}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
} 
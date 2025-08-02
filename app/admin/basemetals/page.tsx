'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-provider'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import ProcessCard from '@/components/admin/ProcessCard'
import ProcessEditModal from '@/components/admin/ProcessEditModal'
import ConfirmationModal from '@/components/admin/ConfirmationModal'
import toast from 'react-hot-toast'
import { Settings, Wrench, Plus } from 'lucide-react'

interface BaseMetalData {
  id: string
  name: string
  slug: string
  content: any
  isActive: boolean
  heroImage?: string
  heroTitle?: string
  heroSubtitle?: string
}

interface NewBaseMetalData {
  name: string
  slug: string
  isActive: boolean
}

export default function BaseMetalsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [baseMetals, setBaseMetals] = useState<BaseMetalData[]>([])
  const [selectedBaseMetal, setSelectedBaseMetal] = useState<BaseMetalData | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [baseMetalToDelete, setBaseMetalToDelete] = useState<BaseMetalData | null>(null)
  const [loading, setLoading] = useState(false)
  const [newBaseMetal, setNewBaseMetal] = useState<NewBaseMetalData>({
    name: '',
    slug: '',
    isActive: true
  })
  const [addingBaseMetal, setAddingBaseMetal] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    fetchAllBaseMetals()
  }, [])

  const fetchAllBaseMetals = async () => {
    setLoading(true)
    try {
      // Fetch base metal settings from database
      const settingsResponse = await fetch('/api/admin/base-metal-settings')
      if (!settingsResponse.ok) {
        throw new Error('Failed to fetch base metal settings')
      }
      const settings = await settingsResponse.json()

      // Fetch content for each base metal
      const promises = settings.map(async (setting: any) => {
        try {
          // First try the regular process route
          let response = await fetch(`/api/content/${setting.slug}`)
          let data = null
          
          if (response.ok) {
            data = await response.json()
          } else {
            // If regular route fails, try the base-metal specific route
            console.log(`Regular route failed for ${setting.slug}, trying base-metal route`)
            response = await fetch(`/api/content/base-metal/${setting.slug}`)
            if (response.ok) {
              data = await response.json()
            }
          }
          
          if (data) {
            return {
              id: setting.slug,
              name: setting.name,
              slug: setting.slug,
              content: data,
              isActive: setting.isActive,
              heroImage: data.heroImage || '',
              heroTitle: data.heroTitle || '',
              heroSubtitle: data.heroSubtitle || ''
            }
          }
          
          return {
            id: setting.slug,
            name: setting.name,
            slug: setting.slug,
            content: null,
            isActive: setting.isActive,
            heroImage: '',
            heroTitle: '',
            heroSubtitle: ''
          }
        } catch (error) {
          console.error(`Failed to fetch ${setting.slug} content:`, error)
          return {
            id: setting.slug,
            name: setting.name,
            slug: setting.slug,
            content: null,
            isActive: setting.isActive,
            heroImage: '',
            heroTitle: '',
            heroSubtitle: ''
          }
        }
      })

      const updatedBaseMetals = await Promise.all(promises)
      setBaseMetals(updatedBaseMetals)
    } catch (error) {
      console.error('Failed to fetch base metals:', error)
      toast.error('Failed to load base metals')
    } finally {
      setLoading(false)
    }
  }

  const handleEditBaseMetal = (baseMetal: BaseMetalData) => {
    setSelectedBaseMetal(baseMetal)
    setIsEditModalOpen(true)
  }

  const handleDeleteBaseMetal = (baseMetal: BaseMetalData) => {
    setBaseMetalToDelete(baseMetal)
    setIsDeleteModalOpen(true)
  }

  const handleToggleActive = async (baseMetal: BaseMetalData) => {
    try {
      const response = await fetch('/api/admin/base-metal-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: baseMetal.slug,
          isActive: !baseMetal.isActive
        })
      })

      if (response.ok) {
        const updatedSetting = await response.json()
        
        // Update local state
        setBaseMetals(prev => prev.map(p => ({
          ...p,
          isActive: p.slug === baseMetal.slug ? updatedSetting.isActive : p.isActive
        })))
        
        toast.success(`${baseMetal.name} ${updatedSetting.isActive ? 'activated' : 'deactivated'} successfully`)
      } else {
        throw new Error('Failed to update base metal status')
      }
    } catch (error) {
      console.error('Failed to toggle base metal status:', error)
      toast.error('Failed to update base metal status')
    }
  }

  const handleSaveBaseMetal = async (updatedBaseMetal: BaseMetalData) => {
    try {
      // First try the regular process route
      let response = await fetch(`/api/content/${updatedBaseMetal.slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBaseMetal.content)
      })

      // If the regular route fails, try the base-metal specific route
      if (!response.ok) {
        console.log(`Regular route failed for ${updatedBaseMetal.slug}, trying base-metal route`);
        response = await fetch(`/api/content/base-metal/${updatedBaseMetal.slug}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedBaseMetal.content)
        })
      }

      if (response.ok) {
        const savedData = await response.json()
        setBaseMetals(prev => prev.map(p => 
          p.slug === updatedBaseMetal.slug 
            ? { ...p, content: savedData }
            : p
        ))
        
        // Refresh the base metals list to get updated data
        await fetchAllBaseMetals()
        
        toast.success(`${updatedBaseMetal.name} updated successfully`)
        setIsEditModalOpen(false)
        setSelectedBaseMetal(null)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save base metal')
      }
    } catch (error) {
      console.error('Failed to save base metal:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save base metal')
    }
  }

  const handleConfirmDelete = async () => {
    if (!baseMetalToDelete) return

    try {
      const response = await fetch(`/api/admin/base-metal-settings?slug=${baseMetalToDelete.slug}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success(`${baseMetalToDelete.name} deleted successfully`)
        setIsDeleteModalOpen(false)
        setBaseMetalToDelete(null)
        await fetchAllBaseMetals()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete base metal')
      }
    } catch (error) {
      console.error('Failed to delete base metal:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete base metal')
    }
  }

  const handleAddBaseMetal = async () => {
    if (!newBaseMetal.name.trim() || !newBaseMetal.slug.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate slug format (only lowercase letters, numbers, and hyphens)
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(newBaseMetal.slug)) {
      toast.error('Slug must contain only lowercase letters, numbers, and hyphens')
      return
    }

    // Check if slug already exists
    const existingSlug = baseMetals.find(metal => metal.slug === newBaseMetal.slug)
    if (existingSlug) {
      toast.error('A base metal with this slug already exists')
      return
    }

    setAddingBaseMetal(true)
    try {
      const response = await fetch('/api/admin/base-metal-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: newBaseMetal.slug,
          name: newBaseMetal.name,
          isActive: newBaseMetal.isActive
        })
      })

      if (response.ok) {
        const createdSetting = await response.json()
        
        // Add to local state
        setBaseMetals(prev => [...prev, {
          id: createdSetting.slug,
          name: createdSetting.name,
          slug: createdSetting.slug,
          content: null,
          isActive: createdSetting.isActive,
          heroImage: '',
          heroTitle: '',
          heroSubtitle: ''
        }])

        // Reset form
        setNewBaseMetal({
          name: '',
          slug: '',
          isActive: true
        })
        
        setIsAddModalOpen(false)
        toast.success(`${createdSetting.name} added successfully`)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add base metal')
      }
    } catch (error) {
      console.error('Failed to add base metal:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to add base metal')
    } finally {
      setAddingBaseMetal(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (name: string) => {
    setNewBaseMetal(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="lg:pl-64">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Base Metals Content Management</h1>
                  <p className="mt-2 text-gray-600">
                    Manage content for all base metal pages with easy-to-use cards. Deactivated base metals will be hidden from the navigation menu.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Base Metal
                  </button>
                  <button
                    onClick={() => window.open('/basemetals', '_blank')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    View All Base Metals
                  </button>
                </div>
              </div>
            </div>

            {/* Base Metal Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {baseMetals.map((baseMetal) => (
                <ProcessCard
                  key={baseMetal.id}
                  process={baseMetal}
                  onEdit={() => handleEditBaseMetal(baseMetal)}
                  onDelete={() => handleDeleteBaseMetal(baseMetal)}
                  onToggleActive={() => handleToggleActive(baseMetal)}
                />
              ))}
            </div>

            {/* Empty State */}
            {baseMetals.length === 0 && (
              <div className="text-center py-12">
                <Wrench className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No base metals</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding base metal content.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedBaseMetal && (
        <ProcessEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedBaseMetal(null)
          }}
          process={selectedBaseMetal}
          onSave={handleSaveBaseMetal}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && baseMetalToDelete && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false)
            setBaseMetalToDelete(null)
          }}
                     onConfirm={handleConfirmDelete}
           title="Delete Base Metal"
           message={`Are you sure you want to delete ${baseMetalToDelete.name} completely? This will remove it from the navigation and delete all its content. This action cannot be undone.`}
           confirmText="Delete Base Metal"
                       type="error"
        />
      )}

      {/* Add New Base Metal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Base Metal</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Metal Name *
                  </label>
                  <input
                    type="text"
                    value={newBaseMetal.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Titanium, Magnesium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={newBaseMetal.slug}
                    onChange={(e) => setNewBaseMetal(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., titanium, magnesium"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL-friendly identifier (lowercase, hyphens only)
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={newBaseMetal.isActive}
                    onChange={(e) => setNewBaseMetal(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active (show in navigation)
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsAddModalOpen(false)
                    setNewBaseMetal({
                      name: '',
                      slug: '',
                      isActive: true
                    })
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBaseMetal}
                  disabled={addingBaseMetal || !newBaseMetal.name.trim() || !newBaseMetal.slug.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingBaseMetal ? 'Adding...' : 'Add Base Metal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
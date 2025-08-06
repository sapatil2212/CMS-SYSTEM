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
import ProfessionalLoader from '@/components/ui/ProfessionalLoader'
import { Plus, Settings, Wrench } from 'lucide-react'
import { logger } from '@/lib/logger';
import {  useActivityTracker  } from '@/hooks/useActivityTracker';

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

export default function ProcessContentPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { trackProcessActivity } = useActivityTracker()
  const [processes, setProcesses] = useState<ProcessData[]>([
    {
      id: 'copper-plating',
      name: 'Copper Plating',
      slug: 'copper-plating',
      content: null,
      isActive: true
    },
    {
      id: 'silver-plating',
      name: 'Silver Plating',
      slug: 'silver-plating',
      content: null,
      isActive: false
    },
    {
      id: 'gold-plating',
      name: 'Gold Plating',
      slug: 'gold-plating',
      content: null,
      isActive: false
    },
    {
      id: 'nickel-plating',
      name: 'Nickel Plating',
      slug: 'nickel-plating',
      content: null,
      isActive: false
    },
    {
      id: 'electroless-nickel-plating',
      name: 'Electroless Nickel Plating',
      slug: 'electroless-nickel-plating',
      content: null,
      isActive: false
    },
    {
      id: 'zinc-plating',
      name: 'Zinc Plating & Colour Passivates',
      slug: 'zinc-plating',
      content: null,
      isActive: false
    },
    {
      id: 'bright-tin-plating',
      name: 'Bright Tin Plating',
      slug: 'bright-tin-plating',
      content: null,
      isActive: false
    },
    {
      id: 'dull-tin-plating',
      name: 'Dull Tin Plating',
      slug: 'dull-tin-plating',
      content: null,
      isActive: false
    },
    {
      id: 'busbar-plating',
      name: 'Busbar Plating',
      slug: 'busbar-plating',
      content: null,
      isActive: false
    },
    {
      id: 'rack-barrel-plating',
      name: 'Rack & Barrel Plating',
      slug: 'rack-barrel-plating',
      content: null,
      isActive: false
    },
    {
      id: 'zinc-flake-coating',
      name: 'Zinc Flake Coating',
      slug: 'zinc-flake-coating',
      content: null,
      isActive: false
    },
    {
      id: 'molykote',
      name: 'Molykote',
      slug: 'molykote',
      content: null,
      isActive: false
    }
  ])
  const [selectedProcess, setSelectedProcess] = useState<ProcessData | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [processToDelete, setProcessToDelete] = useState<ProcessData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    fetchAllProcesses()
  }, [])

  const fetchAllProcesses = async () => {
    setLoading(true)
    try {
      // First, fetch the activation status for all processes
      const activationResponse = await fetch('/api/content/process-activation')
      let activationData = []
      
      if (activationResponse.ok) {
        activationData = await activationResponse.json()
      }

      const promises = processes.map(async (process) => {
        try {
          const response = await fetch(`/api/content/${process.slug}`)
          if (response.ok) {
            const data = await response.json()
            
            // Find the activation status for this process
            const activationStatus = activationData.find((p: any) => p.slug === process.slug)
            const isActive = activationStatus ? activationStatus.isMenuActive : false
            
            return {
              ...process,
              content: data,
              isActive: isActive,
              heroImage: data.heroImage || '',
              heroTitle: data.heroTitle || '',
              heroSubtitle: data.heroSubtitle || ''
            }
          }
          return process
        } catch (error) {
          logger.error(`Failed to fetch ${process.slug} content:`, error)
          return process
        }
      })

      const updatedProcesses = await Promise.all(promises)
      setProcesses(updatedProcesses)
    } catch (error) {
      logger.error('Failed to fetch processes:', error)
      toast.error('Failed to load processes')
    } finally {
      setLoading(false)
    }
  }

  const handleEditProcess = (process: ProcessData) => {
    setSelectedProcess(process)
    setIsEditModalOpen(true)
  }

  const handleDeleteProcess = (process: ProcessData) => {
    setProcessToDelete(process)
    setIsDeleteModalOpen(true)
  }

  const handleToggleActive = async (process: ProcessData) => {
    try {
      // Call the process activation API to update the backend
      const response = await fetch('/api/content/process-activation', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          processSlug: process.slug,
          isMenuActive: !process.isActive
        }),
      })

      if (response.ok) {
        // Update local state
        const updatedProcesses = processes.map(p => ({
          ...p,
          isActive: p.id === process.id ? !p.isActive : p.isActive
        }))
        setProcesses(updatedProcesses)
        
        // Track activity
        const action = !process.isActive ? 'activated' : 'deactivated'
        trackProcessActivity(action, process.name)
        
        toast.success(`${process.name} ${action} successfully`)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update process status')
      }
    } catch (error) {
      logger.error('Failed to toggle process status:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update process status')
    }
  }

  const handleSaveProcess = async (updatedProcess: ProcessData) => {
    try {
      const response = await fetch(`/api/content/${updatedProcess.slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProcess.content)
      })

      if (response.ok) {
        const savedData = await response.json()
        setProcesses(prev => prev.map(p => 
          p.slug === updatedProcess.slug 
            ? { ...p, content: savedData }
            : p
        ))
        
        // Refresh the processes list to get updated data
        await fetchAllProcesses()
        
        toast.success(`${updatedProcess.name} updated successfully`)
        setIsEditModalOpen(false)
        setSelectedProcess(null)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save process')
      }
    } catch (error) {
      logger.error('Failed to save process:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save process')
    }
  }

  const handleConfirmDelete = async () => {
    if (!processToDelete) return

    try {
      // Here you would typically delete from the backend
      setProcesses(prev => prev.filter(p => p.id !== processToDelete.id))
      toast.success(`${processToDelete.name} deleted successfully`)
      setIsDeleteModalOpen(false)
      setProcessToDelete(null)
    } catch (error) {
      logger.error('Failed to delete process:', error)
      toast.error('Failed to delete process')
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <ProfessionalLoader 
          size="xl"
          title="Authenticating"
          subtitle="Verifying your credentials..."
        />
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
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Process Content Management</h1>
                <p className="mt-2 text-gray-600">
                  Manage content for all plating processes with easy-to-use cards.
                </p>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <ProfessionalLoader 
                title="Loading Process Content"
                subtitle="Fetching all process configurations and content..."
              />
            ) : (
              <>
                {/* Process Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {processes.map((process) => (
                    <ProcessCard
                      key={process.id}
                      process={process}
                      onEdit={() => handleEditProcess(process)}
                      onDelete={() => handleDeleteProcess(process)}
                      onToggleActive={() => handleToggleActive(process)}
                    />
                  ))}
                </div>

                {/* Empty State */}
                {processes.length === 0 && (
                  <div className="text-center py-12">
                    <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No processes found</h3>
                    <p className="text-gray-600">Get started by adding your first process.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {selectedProcess && (
        <ProcessEditModal
          process={selectedProcess}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedProcess(null)
          }}
          onSave={handleSaveProcess}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setProcessToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        type="warning"
        title="Delete Process"
        message={`Are you sure you want to delete "${processToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
} 
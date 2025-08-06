'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-provider'
import { useRouter } from 'next/navigation'
import { logger } from '@/lib/logger';
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import SectorForm from '@/components/admin/SectorForm'
import SectorList from '@/components/admin/SectorList'
import ProfessionalLoader from '@/components/ui/ProfessionalLoader'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import SuccessModal from '@/components/ui/SuccessModal';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

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

export default function SectorsManagement() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sectors, setSectors] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSector, setEditingSector] = useState<Sector | null>(null)
  
  // Modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [deletingSectorId, setDeletingSectorId] = useState<string | null>(null)
  const [deletingSectorName, setDeletingSectorName] = useState<string>('')
  const [deleting, setDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    fetchSectors()
  }, [])

  const fetchSectors = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/sectors', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setSectors(data)
      } else {
        logger.error('Failed to fetch sectors')
      }
    } catch (error) {
      logger.error('Error fetching sectors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSector = () => {
    setEditingSector(null)
    setShowForm(true)
  }

  const handleEditSector = (sector: Sector) => {
    setEditingSector(sector)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingSector(null)
  }

  const handleFormSubmit = async () => {
    await fetchSectors()
    setShowForm(false)
    
    // Show success message
    if (editingSector) {
      setSuccessMessage({
        title: 'Sector Updated Successfully!',
        message: `The sector "${editingSector.name}" has been updated with the latest information.`
      })
    } else {
      setSuccessMessage({
        title: 'Sector Created Successfully!',
        message: 'Your new sector has been created and is now available in the system.'
      })
    }
    
    setEditingSector(null)
    setShowSuccessModal(true)
  }

  const handleDeleteSector = (id: string) => {
    logger.log('Attempting to delete sector with ID:', id)
    const sector = sectors.find(s => s.id === id)
    if (sector) {
      logger.log('Found sector to delete:', sector.name)
      setDeletingSectorId(id)
      setDeletingSectorName(sector.name)
      setShowDeleteConfirm(true)
    } else {
      logger.error('Sector not found in list:', id)
      alert('Sector not found. Please refresh the page and try again.')
    }
  }

  const confirmDeleteSector = async () => {
    if (!deletingSectorId) return
    
    logger.log('Confirming deletion of sector ID:', deletingSectorId)
    setDeleting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/sectors/${deletingSectorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      logger.log('Delete response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        await fetchSectors()
        setShowDeleteConfirm(false)
        setSuccessMessage({
          title: 'Sector Deleted Successfully!',
          message: `The sector "${result.sectorName || deletingSectorName}" has been permanently removed from the system.`
        })
        setShowSuccessModal(true)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        logger.error('Failed to delete sector:', errorData)
        
        if (response.status === 404) {
          alert('Sector not found. It may have already been deleted.')
        } else {
          alert(`Failed to delete sector: ${errorData.error || 'Please try again.'}`)
        }
      }
    } catch (error) {
      logger.error('Error deleting sector:', error)
      alert('An error occurred while deleting the sector. Please try again.')
    } finally {
      setDeleting(false)
      setDeletingSectorId(null)
      setDeletingSectorName('')
    }
  }

  const cancelDeleteSector = () => {
    setShowDeleteConfirm(false)
    setDeletingSectorId(null)
    setDeletingSectorName('')
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
        
        <main className="py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Sectors Management</h1>
                  <p className="mt-1 text-xs text-gray-600">
                    Manage industry sectors and their content
                  </p>
                </div>
                <button
                  onClick={handleCreateSector}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PlusIcon className="h-3 w-3 mr-1" />
                  Add New Sector
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
                      <BuildingOfficeIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Total Sectors</p>
                    <p className="text-lg font-semibold text-gray-900">{sectors.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
                      <div className="h-4 w-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Active Sectors</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {sectors.filter(s => s.isActive).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-red-500 rounded-md flex items-center justify-center">
                      <div className="h-4 w-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Inactive Sectors</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {sectors.filter(s => !s.isActive).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sectors List */}
            <SectorList
              sectors={sectors}
              onEdit={handleEditSector}
              onDelete={handleDeleteSector}
              loading={loading}
            />
          </div>
        </main>
      </div>

      {/* Sector Form Modal */}
      {showForm && (
        <SectorForm
          sector={editingSector}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={cancelDeleteSector}
        onConfirm={confirmDeleteSector}
        title="Delete Sector"
        message={`Are you sure you want to delete the sector "${deletingSectorName}"? This action cannot be undone and will permanently remove all associated data.`}
        confirmLabel="Delete Sector"
        cancelLabel="Cancel"
        type="danger"
        loading={deleting}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={successMessage.title}
        message={successMessage.message}
        actionLabel="Continue"
        autoCloseAfter={4000}
      />
    </div>
  )
} 
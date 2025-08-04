'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-provider'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import SectorForm from '@/components/admin/SectorForm'
import SectorList from '@/components/admin/SectorList'
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
      const response = await fetch('/api/sectors')
      if (response.ok) {
        const data = await response.json()
        setSectors(data)
      } else {
        console.error('Failed to fetch sectors')
      }
    } catch (error) {
      console.error('Error fetching sectors:', error)
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
    setEditingSector(null)
  }

  const handleDeleteSector = async (id: string) => {
    if (confirm('Are you sure you want to delete this sector?')) {
      try {
        const response = await fetch(`/api/sectors/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          await fetchSectors()
        } else {
          console.error('Failed to delete sector')
        }
      } catch (error) {
        console.error('Error deleting sector:', error)
      }
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-xs text-gray-600">Loading...</p>
        </div>
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
    </div>
  )
} 
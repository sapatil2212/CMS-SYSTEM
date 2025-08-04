'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-provider'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { 
  PlusIcon, 
  BeakerIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  PhotoIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  CogIcon,
  XMarkIcon,
  CheckIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  CpuChipIcon,
  BoltIcon,
  StarIcon,
  HeartIcon,
  FireIcon,
  SparklesIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  HomeIcon,
  TruckIcon,
  WrenchIcon,
  Cog6ToothIcon,
  CommandLineIcon,
  CubeIcon,
  CubeTransparentIcon,
  DeviceTabletIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ServerIcon,
  SignalIcon,
  WifiIcon
} from '@heroicons/react/24/outline'
import { 
  BeakerIcon as BeakerIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  BuildingOfficeIcon as BuildingOfficeIconSolid,
  PhotoIcon as PhotoIconSolid,
  CogIcon as CogIconSolid,
  WrenchScrewdriverIcon as WrenchScrewdriverIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  CpuChipIcon as CpuChipIconSolid,
  BoltIcon as BoltIconSolid,
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
  FireIcon as FireIconSolid,
  SparklesIcon as SparklesIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
  GlobeAltIcon as GlobeAltIconSolid,
  HomeIcon as HomeIconSolid,
  TruckIcon as TruckIconSolid,
  WrenchIcon as WrenchIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  CommandLineIcon as CommandLineIconSolid,
  CubeIcon as CubeIconSolid,
  CubeTransparentIcon as CubeTransparentIconSolid,
  DeviceTabletIcon as DeviceTabletIconSolid,
  DevicePhoneMobileIcon as DevicePhoneMobileIconSolid,
  ComputerDesktopIcon as ComputerDesktopIconSolid,
  ServerIcon as ServerIconSolid,
  SignalIcon as SignalIconSolid,
  WifiIcon as WifiIconSolid
} from '@heroicons/react/24/solid'

interface QualityTestingContent {
  id: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  commitmentTitle: string
  commitmentDescription: string
  capabilitiesTitle: string
  capabilitiesDescription: string
  statisticsTitle: string
  statisticsDescription: string
  standardsTitle: string
  standardsDescription: string
  labTitle: string
  labDescription: string
  trustedTitle: string
  trustedDescription: string
  ctaTitle: string
  ctaDescription: string
  createdAt: string
  updatedAt: string
}

interface QualityTestingCapability {
  id: string
  title: string
  description: string
  details: string
  icon: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface QualityTestingStandard {
  id: string
  name: string
  description: string
  category: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface QualityTestingStatistic {
  id: string
  number: string
  label: string
  icon: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface QualityTestingIndustry {
  id: string
  name: string
  description: string
  icon: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface QualityTestingLabImage {
  id: string
  title: string
  description: string
  imagePath: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function QualityTestingManagement() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [content, setContent] = useState<QualityTestingContent | null>(null)
  const [capabilities, setCapabilities] = useState<QualityTestingCapability[]>([])
  const [standards, setStandards] = useState<QualityTestingStandard[]>([])
  const [statistics, setStatistics] = useState<QualityTestingStatistic[]>([])
  const [industries, setIndustries] = useState<QualityTestingIndustry[]>([])
  const [labImages, setLabImages] = useState<QualityTestingLabImage[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{section: string, id: string} | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch all data in parallel
      const [contentRes, capabilitiesRes, standardsRes, statisticsRes, industriesRes, labImagesRes] = await Promise.all([
        fetch('/api/content/quality-testing'),
        fetch('/api/content/quality-testing/capabilities'),
        fetch('/api/content/quality-testing/standards'),
        fetch('/api/content/quality-testing/statistics'),
        fetch('/api/content/quality-testing/industries'),
        fetch('/api/content/quality-testing/lab-images')
      ])

      if (contentRes.ok) {
        const contentData = await contentRes.json()
        setContent(contentData)
      }

      if (capabilitiesRes.ok) {
        const capabilitiesData = await capabilitiesRes.json()
        setCapabilities(capabilitiesData)
      }

      if (standardsRes.ok) {
        const standardsData = await standardsRes.json()
        setStandards(standardsData)
      }

      if (statisticsRes.ok) {
        const statisticsData = await statisticsRes.json()
        setStatistics(statisticsData)
      }

      if (industriesRes.ok) {
        const industriesData = await industriesRes.json()
        setIndustries(industriesData)
      }

      if (labImagesRes.ok) {
        const labImagesData = await labImagesRes.json()
        setLabImages(labImagesData)
      }
    } catch (error) {
      console.error('Error fetching quality testing data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditSection = (section: string) => {
    setEditingSection(section)
    setEditingItem(null)
    setShowModal(true)
  }

  const handleEditItem = (section: string, item: any) => {
    setEditingSection(section)
    setEditingItem(item)
    setShowModal(true)
  }

  const handleDeleteItem = async (section: string, id: string) => {
    setItemToDelete({ section, id })
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/content/quality-testing/${itemToDelete.section}/${itemToDelete.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setShowSuccessModal(true)
        fetchData()
      } else {
        alert(`Failed to delete ${itemToDelete.section}`)
      }
    } catch (error) {
      console.error(`Error deleting ${itemToDelete.section}:`, error)
      alert(`Error deleting ${itemToDelete.section}`)
    } finally {
      setIsLoading(false)
      setShowDeleteConfirm(false)
      setItemToDelete(null)
    }
  }

  const handleToggleActive = async (section: string, item: any) => {
    try {
      const updatedItem = { ...item, isActive: !item.isActive }
      const response = await fetch(`/api/content/quality-testing/${section}/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      })

      if (response.ok) {
        alert(`${section} ${updatedItem.isActive ? 'activated' : 'deactivated'} successfully!`)
        fetchData()
      }
    } catch (error) {
      console.error(`Error updating ${section}:`, error)
      alert(`Error updating ${section}`)
    }
  }

  const handleSaveContent = async () => {
    if (!content) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/content/quality-testing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      })

      if (response.ok) {
        setShowSuccessModal(true)
        setShowModal(false)
        setEditingSection(null)
        fetchData()
      } else {
        throw new Error('Failed to save content')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Error saving content')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveItem = async (section: string, item: any) => {
    try {
      setIsLoading(true)
      const url = `/api/content/quality-testing/${section}${item.id ? `/${item.id}` : ''}`
      const method = item.id ? 'PUT' : 'POST'

      // Handle file upload for lab images
      if (section === 'lab-images' && uploadedImage) {
        const formData = new FormData()
        formData.append('image', uploadedImage)
        
        // For lab-images, we only need the image file
        // No other fields are required as per user request

        const response = await fetch(url, {
          method,
          body: formData
        })

        if (response.ok) {
          setShowSuccessModal(true)
          setShowModal(false)
          setEditingItem(null)
          setEditingSection(null)
          setUploadedImage(null)
          setImagePreview(null)
          fetchData()
        }
      } else {
        // Handle regular JSON requests for other sections
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        })

        if (response.ok) {
          setShowSuccessModal(true)
          setShowModal(false)
          setEditingItem(null)
          setEditingSection(null)
          fetchData()
        }
      }
    } catch (error) {
      console.error(`Error saving ${section}:`, error)
      alert(`Error saving ${section}`)
    } finally {
      setIsLoading(false)
    }
  }

  const renderContentCard = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
            <DocumentTextIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Page Content</h3>
            <p className="text-sm text-gray-600">Main page content and sections</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditSection('content')}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`px-2 py-1 text-xs rounded-full ${content ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {content ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Hero Title:</span>
          <span className="text-sm text-gray-900 truncate max-w-xs">
            {content?.heroTitle || 'Not set'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Last Updated:</span>
          <span className="text-sm text-gray-900">
            {content?.updatedAt ? new Date(content.updatedAt).toLocaleDateString() : 'Never'}
          </span>
        </div>
      </div>
    </div>
  )

  const renderSectionCard = (
    title: string,
    items: any[],
    section: string,
    icon: React.ReactNode,
    bgColor: string,
    textColor: string
  ) => (
    <div className={`bg-white rounded-lg shadow p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center mr-3`}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{items.length} items</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditSection(section)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Active Items:</span>
          <span className={`px-2 py-1 text-xs rounded-full ${textColor}`}>
            {items.filter(item => item.isActive).length} / {items.length}
          </span>
        </div>
        
        {items.slice(0, 3).map((item, index) => (
          <div key={item.id || index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm truncate flex-1">
              {item.title || item.name || item.number}
            </span>
            <div className="flex space-x-1 ml-2">
              <button
                onClick={() => handleEditItem(section, item)}
                className="p-1 text-blue-600 hover:text-blue-800"
              >
                <PencilIcon className="h-3 w-3" />
              </button>
              <button
                onClick={() => handleToggleActive(section, item)}
                className="p-1 text-gray-600 hover:text-gray-800"
              >
                {item.isActive ? <EyeIcon className="h-3 w-3" /> : <EyeSlashIcon className="h-3 w-3" />}
              </button>
              <button
                onClick={() => handleDeleteItem(section, item.id)}
                className="p-1 text-red-600 hover:text-red-800"
              >
                <TrashIcon className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
        
        {items.length > 3 && (
          <div className="text-center">
            <span className="text-xs text-gray-500">+{items.length - 3} more items</span>
          </div>
        )}
      </div>
    </div>
  )

  const renderContentEditor = () => (
    <div className="space-y-3">
      {/* Hero Section */}
      <div className="grid grid-cols-2 gap-3">
      <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Hero Title</label>
        <input
          type="text"
          value={content?.heroTitle || ''}
          onChange={(e) => setContent((prev: QualityTestingContent | null) => prev ? { ...prev, heroTitle: e.target.value } : null)}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Hero Subtitle</label>
        <input
          type="text"
          value={content?.heroSubtitle || ''}
          onChange={(e) => setContent((prev: QualityTestingContent | null) => prev ? { ...prev, heroSubtitle: e.target.value } : null)}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Hero Description</label>
        <textarea
          value={content?.heroDescription || ''}
          onChange={(e) => setContent((prev: QualityTestingContent | null) => prev ? { ...prev, heroDescription: e.target.value } : null)}
          rows={2}
          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Commitment Section */}
      <div className="grid grid-cols-2 gap-3">
      <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Commitment Title</label>
        <input
          type="text"
          value={content?.commitmentTitle || ''}
          onChange={(e) => setContent((prev: QualityTestingContent | null) => prev ? { ...prev, commitmentTitle: e.target.value } : null)}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Commitment Description</label>
        <textarea
          value={content?.commitmentDescription || ''}
          onChange={(e) => setContent((prev: QualityTestingContent | null) => prev ? { ...prev, commitmentDescription: e.target.value } : null)}
            rows={2}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Capabilities Section */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Capabilities Title</label>
          <input
            type="text"
            value={content?.capabilitiesTitle || ''}
            onChange={(e) => setContent((prev: QualityTestingContent | null) => prev ? { ...prev, capabilitiesTitle: e.target.value } : null)}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Capabilities Description</label>
          <textarea
            value={content?.capabilitiesDescription || ''}
            onChange={(e) => setContent((prev: QualityTestingContent | null) => prev ? { ...prev, capabilitiesDescription: e.target.value } : null)}
            rows={2}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Statistics Title</label>
          <input
            type="text"
            value={content?.statisticsTitle || ''}
            onChange={(e) => setContent((prev: QualityTestingContent | null) => prev ? { ...prev, statisticsTitle: e.target.value } : null)}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Statistics Description</label>
          <textarea
            value={content?.statisticsDescription || ''}
            onChange={(e) => setContent((prev: QualityTestingContent | null) => prev ? { ...prev, statisticsDescription: e.target.value } : null)}
            rows={2}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Standards Section */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Standards Title</label>
          <input
            type="text"
            value={content?.standardsTitle || ''}
            onChange={(e) => setContent((prev: QualityTestingContent | null) => prev ? { ...prev, standardsTitle: e.target.value } : null)}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Standards Description</label>
          <textarea
            value={content?.standardsDescription || ''}
            onChange={(e) => setContent((prev: QualityTestingContent | null) => prev ? { ...prev, standardsDescription: e.target.value } : null)}
            rows={2}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Lab Section */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Lab Title</label>
          <input
            type="text"
            value={content?.labTitle || ''}
            onChange={(e) => setContent((prev: QualityTestingContent | null) => prev ? { ...prev, labTitle: e.target.value } : null)}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Lab Description</label>
          <textarea
            value={content?.labDescription || ''}
            onChange={(e) => setContent((prev: QualityTestingContent | null) => prev ? { ...prev, labDescription: e.target.value } : null)}
            rows={2}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Trusted Section */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Trusted Title</label>
          <input
            type="text"
            value={content?.trustedTitle || ''}
            onChange={(e) => setContent((prev: QualityTestingContent | null) => prev ? { ...prev, trustedTitle: e.target.value } : null)}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Trusted Description</label>
          <textarea
            value={content?.trustedDescription || ''}
            onChange={(e) => setContent((prev: QualityTestingContent | null) => prev ? { ...prev, trustedDescription: e.target.value } : null)}
            rows={2}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">CTA Title</label>
          <input
            type="text"
            value={content?.ctaTitle || ''}
            onChange={(e) => setContent((prev: QualityTestingContent | null) => prev ? { ...prev, ctaTitle: e.target.value } : null)}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">CTA Description</label>
          <textarea
            value={content?.ctaDescription || ''}
            onChange={(e) => setContent((prev: QualityTestingContent | null) => prev ? { ...prev, ctaDescription: e.target.value } : null)}
            rows={2}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  )

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedImage(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const renderItemEditor = (section: string, item: any) => {
    // Define available icons
    const availableIcons = [
      { name: 'BeakerIcon', component: BeakerIcon, solid: BeakerIconSolid },
      { name: 'CheckCircleIcon', component: CheckCircleIcon, solid: CheckCircleIconSolid },
      { name: 'DocumentTextIcon', component: DocumentTextIcon, solid: DocumentTextIconSolid },
      { name: 'ChartBarIcon', component: ChartBarIcon, solid: ChartBarIconSolid },
      { name: 'BuildingOfficeIcon', component: BuildingOfficeIcon, solid: BuildingOfficeIconSolid },
      { name: 'PhotoIcon', component: PhotoIcon, solid: PhotoIconSolid },
      { name: 'CogIcon', component: CogIcon, solid: CogIconSolid },
      { name: 'WrenchScrewdriverIcon', component: WrenchScrewdriverIcon, solid: WrenchScrewdriverIconSolid },
      { name: 'ShieldCheckIcon', component: ShieldCheckIcon, solid: ShieldCheckIconSolid },
      { name: 'MagnifyingGlassIcon', component: MagnifyingGlassIcon, solid: MagnifyingGlassIconSolid },
      { name: 'CpuChipIcon', component: CpuChipIcon, solid: CpuChipIconSolid },
      { name: 'BoltIcon', component: BoltIcon, solid: BoltIconSolid },
      { name: 'StarIcon', component: StarIcon, solid: StarIconSolid },
      { name: 'HeartIcon', component: HeartIcon, solid: HeartIconSolid },
      { name: 'FireIcon', component: FireIcon, solid: FireIconSolid },
      { name: 'SparklesIcon', component: SparklesIcon, solid: SparklesIconSolid },
      { name: 'AcademicCapIcon', component: AcademicCapIcon, solid: AcademicCapIconSolid },
      { name: 'BriefcaseIcon', component: BriefcaseIcon, solid: BriefcaseIconSolid },
      { name: 'GlobeAltIcon', component: GlobeAltIcon, solid: GlobeAltIconSolid },
      { name: 'HomeIcon', component: HomeIcon, solid: HomeIconSolid },
      { name: 'TruckIcon', component: TruckIcon, solid: TruckIconSolid },
      { name: 'WrenchIcon', component: WrenchIcon, solid: WrenchIconSolid },
      { name: 'Cog6ToothIcon', component: Cog6ToothIcon, solid: Cog6ToothIconSolid },
      { name: 'CommandLineIcon', component: CommandLineIcon, solid: CommandLineIconSolid },
      { name: 'CubeIcon', component: CubeIcon, solid: CubeIconSolid },
      { name: 'CubeTransparentIcon', component: CubeTransparentIcon, solid: CubeTransparentIconSolid },
      { name: 'DeviceTabletIcon', component: DeviceTabletIcon, solid: DeviceTabletIconSolid },
      { name: 'DevicePhoneMobileIcon', component: DevicePhoneMobileIcon, solid: DevicePhoneMobileIconSolid },
      { name: 'ComputerDesktopIcon', component: ComputerDesktopIcon, solid: ComputerDesktopIconSolid },
      { name: 'ServerIcon', component: ServerIcon, solid: ServerIconSolid },
      { name: 'SignalIcon', component: SignalIcon, solid: SignalIconSolid },
      { name: 'WifiIcon', component: WifiIcon, solid: WifiIconSolid }
    ]

    // Define the fields based on the section type
    const getFields = () => {
      switch (section) {
        case 'capabilities':
          return [
            { key: 'title', label: 'Title', type: 'text', colSpan: 1 },
            { key: 'icon', label: 'Icon', type: 'icon', colSpan: 1 },
            { key: 'order', label: 'Order', type: 'number', colSpan: 1 },
            { key: 'isActive', label: 'Active', type: 'select', colSpan: 1 },
            { key: 'description', label: 'Description', type: 'textarea', colSpan: 2 },
            { key: 'details', label: 'Details', type: 'textarea', colSpan: 2 }
          ]
        case 'standards':
          return [
            { key: 'name', label: 'Name', type: 'text', colSpan: 1 },
            { key: 'category', label: 'Category', type: 'text', colSpan: 1 },
            { key: 'order', label: 'Order', type: 'number', colSpan: 1 },
            { key: 'isActive', label: 'Active', type: 'select', colSpan: 1 },
            { key: 'description', label: 'Description', type: 'textarea', colSpan: 2 }
          ]
        case 'statistics':
          return [
            { key: 'number', label: 'Number', type: 'text', colSpan: 1 },
            { key: 'label', label: 'Label', type: 'text', colSpan: 1 },
            { key: 'icon', label: 'Icon', type: 'icon', colSpan: 1 },
            { key: 'order', label: 'Order', type: 'number', colSpan: 1 },
            { key: 'isActive', label: 'Active', type: 'select', colSpan: 1 }
          ]
        case 'industries':
          return [
            { key: 'name', label: 'Name', type: 'text', colSpan: 1 },
            { key: 'icon', label: 'Icon', type: 'icon', colSpan: 1 },
            { key: 'order', label: 'Order', type: 'number', colSpan: 1 },
            { key: 'isActive', label: 'Active', type: 'select', colSpan: 1 },
            { key: 'description', label: 'Description', type: 'textarea', colSpan: 2 }
          ]
        case 'lab-images':
          return [
            { key: 'imageFile', label: 'Upload Image', type: 'file', colSpan: 2 }
          ]
        default:
          return []
      }
    }

    const fields = getFields()

    const renderIconDropdown = (fieldKey: string) => {
      const currentIcon = editingItem?.[fieldKey] || ''
      const selectedIcon = availableIcons.find(icon => icon.name === currentIcon)
      
      return (
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              const dropdown = document.getElementById(`icon-dropdown-${fieldKey}`)
              if (dropdown) {
                dropdown.classList.toggle('hidden')
              }
            }}
            className="w-full px-3 py-2 text-left border border-gray-300 rounded-md bg-white flex items-center justify-between text-xs"
          >
            <div className="flex items-center space-x-2">
              {selectedIcon ? (
                <>
                  {React.createElement(selectedIcon.component, { className: "h-4 w-4 text-gray-600" })}
                  <span className="text-gray-900">{selectedIcon.name}</span>
                </>
              ) : (
                <span className="text-gray-500">Select an icon</span>
              )}
            </div>
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div
            id={`icon-dropdown-${fieldKey}`}
            className="hidden absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {availableIcons.map((icon) => (
              <button
                key={icon.name}
                type="button"
                onClick={() => {
                  setEditingItem((prev: any) => ({ ...prev, [fieldKey]: icon.name }))
                  const dropdown = document.getElementById(`icon-dropdown-${fieldKey}`)
                  if (dropdown) {
                    dropdown.classList.add('hidden')
                  }
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 text-xs"
              >
                {React.createElement(icon.component, { className: "h-4 w-4 text-gray-600" })}
                <span className="text-gray-900">{icon.name}</span>
              </button>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.key} className={`${field.colSpan === 2 ? 'col-span-2' : ''}`}>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={editingItem?.[field.key] || ''}
                  onChange={(e) => setEditingItem((prev: any) => ({ ...prev, [field.key]: e.target.value }))}
                  rows={3}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : field.type === 'select' ? (
                <select
                  value={editingItem?.[field.key] ? 'true' : 'false'}
                  onChange={(e) => setEditingItem((prev: any) => ({ ...prev, [field.key]: e.target.value === 'true' }))}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              ) : field.type === 'number' ? (
                <input
                  type="number"
                  value={editingItem?.[field.key] || 0}
                  onChange={(e) => setEditingItem((prev: any) => ({ ...prev, [field.key]: parseInt(e.target.value) || 0 }))}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                           ) : field.type === 'icon' ? (
               renderIconDropdown(field.key)
             ) : field.type === 'file' ? (
               <div className="space-y-3">
                 <div className="flex items-center justify-center w-full">
                   <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
                       <PhotoIcon className="w-8 h-8 mb-2 text-gray-400" />
                       <p className="mb-2 text-xs text-gray-500">
                         <span className="font-semibold">Click to upload</span> or drag and drop
                       </p>
                       <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                     </div>
                     <input
                       type="file"
                       className="hidden"
                       accept="image/*"
                       onChange={handleFileUpload}
                     />
                   </label>
                 </div>
                 {imagePreview && (
                   <div className="mt-3">
                     <div className="relative inline-block">
                       <img
                         src={imagePreview}
                         alt="Preview"
                         className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                       />
                       <button
                         type="button"
                         onClick={() => {
                           setImagePreview(null)
                           setUploadedImage(null)
                         }}
                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                       >
                         ×
                       </button>
                     </div>
                   </div>
                 )}
               </div>
             ) : (
               <input
                 type="text"
                 value={editingItem?.[field.key] || ''}
                 onChange={(e) => setEditingItem((prev: any) => ({ ...prev, [field.key]: e.target.value }))}
                 className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
               />
             )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderModal = () => {
    if (!showModal) return null

    const getModalTitle = () => {
      if (editingSection === 'content') return 'Edit Page Content'
      if (editingItem) return `Edit ${(editingSection || '').charAt(0).toUpperCase() + (editingSection || '').slice(1)} Item`
      return `Add New ${(editingSection || '').charAt(0).toUpperCase() + (editingSection || '').slice(1)} Item`
    }

    const getModalContent = () => {
      if (editingSection === 'content') {
        return renderContentEditor()
      }
      if (editingItem) {
        return renderItemEditor(editingSection || '', editingItem)
      }
      // For adding new items - initialize editingItem with proper structure
      const getDefaultItem = () => {
        switch (editingSection) {
          case 'capabilities':
            return {
         title: '',
         description: '',
         details: '',
         icon: '',
         order: 0,
         isActive: true
       }
          case 'industries':
            return {
              name: '',
              description: '',
              icon: '',
              order: 0,
              isActive: true
            }
          case 'standards':
            return {
              name: '',
              category: '',
              description: '',
              order: 0,
              isActive: true
            }
          case 'statistics':
            return {
              number: '',
              label: '',
              icon: '',
              order: 0,
              isActive: true
            }
          default:
            return {
              title: '',
              description: '',
              icon: '',
              order: 0,
              isActive: true
            }
        }
      }
      
      // Initialize editingItem if it's null
      if (!editingItem) {
        setEditingItem(getDefaultItem())
      }
      
      return renderItemEditor(editingSection || '', editingItem || getDefaultItem())
    }

    const handleSave = () => {
      if (editingSection === 'content') {
        handleSaveContent()
      } else if (editingItem) {
        handleSaveItem(editingSection || '', editingItem)
      } else {
        // Handle adding new item with proper structure
        const getDefaultItem = () => {
          switch (editingSection) {
            case 'capabilities':
              return {
           title: '',
           description: '',
           details: '',
           icon: '',
           order: 0,
           isActive: true
         }
            case 'industries':
              return {
                name: '',
                description: '',
                icon: '',
                order: 0,
                isActive: true
              }
            case 'standards':
              return {
                name: '',
                category: '',
                description: '',
                order: 0,
                isActive: true
              }
            case 'statistics':
              return {
                number: '',
                label: '',
                icon: '',
                order: 0,
                isActive: true
              }
            default:
              return {
                title: '',
                description: '',
                icon: '',
                order: 0,
                isActive: true
              }
          }
        }
        handleSaveItem(editingSection || '', getDefaultItem())
      }
    }

         return (
       <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
         <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
           <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
             <h3 className="text-base font-semibold text-gray-900">{getModalTitle()}</h3>
             <button
               onClick={() => setShowModal(false)}
               className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-200"
             >
               <XMarkIcon className="h-5 w-5" />
             </button>
           </div>
           
           <div className="p-4">
             {getModalContent()}
           </div>
           
           <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
             <button
               onClick={() => setShowModal(false)}
               className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
             >
               Cancel
             </button>
             <button
               onClick={handleSave}
               className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center space-x-1"
             >
               <CheckIcon className="h-3 w-3" />
               <span>Save</span>
             </button>
           </div>
         </div>
       </div>
     )
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
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Quality Testing Management</h1>
                  <p className="mt-1 text-xs text-gray-600">
                    Manage quality testing content, capabilities, standards, and more
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
                      <DocumentTextIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Content</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {content ? '1' : '0'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
                      <CheckCircleIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Capabilities</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {capabilities.filter(c => c.isActive).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-purple-500 rounded-md flex items-center justify-center">
                      <DocumentTextIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Standards</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {standards.filter(s => s.isActive).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center">
                      <ChartBarIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Statistics</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {statistics.filter(s => s.isActive).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center">
                      <BuildingOfficeIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Industries</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {industries.filter(i => i.isActive).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-red-500 rounded-md flex items-center justify-center">
                      <PhotoIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Lab Images</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {labImages.filter(l => l.isActive).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderContentCard()}
              
              {renderSectionCard(
                'Capabilities',
                capabilities,
                'capabilities',
                <CheckCircleIcon className="h-6 w-6 text-white" />,
                'bg-green-500',
                'bg-green-100 text-green-800'
              )}
              
              {renderSectionCard(
                'Standards',
                standards,
                'standards',
                <DocumentTextIcon className="h-6 w-6 text-white" />,
                'bg-purple-500',
                'bg-purple-100 text-purple-800'
              )}
              
              {renderSectionCard(
                'Statistics',
                statistics,
                'statistics',
                <ChartBarIcon className="h-6 w-6 text-white" />,
                'bg-orange-500',
                'bg-orange-100 text-orange-800'
              )}
              
              {renderSectionCard(
                'Industries',
                industries,
                'industries',
                <BuildingOfficeIcon className="h-6 w-6 text-white" />,
                'bg-indigo-500',
                'bg-indigo-100 text-indigo-800'
              )}
              
              {renderSectionCard(
                'Lab Images',
                labImages,
                'lab-images',
                <PhotoIcon className="h-6 w-6 text-white" />,
                'bg-red-500',
                'bg-red-100 text-red-800'
              )}
            </div>
          </div>
        </main>
      </div>
      {renderModal()}
      
      {/* Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-sm text-gray-600">Updating content...</p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Success!</h3>
            <p className="text-sm text-gray-600 mb-4">Content has been updated successfully.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <TrashIcon className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setItemToDelete(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-provider'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, X, Save, Star, Loader2 } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'
import ImagePreview from '@/components/admin/ImagePreview'
import ProcessImageUpload from '@/components/admin/ProcessImageUpload'
import ConfirmationModal from '@/components/admin/ConfirmationModal'
import SuccessModal from '@/components/admin/SuccessModal'
import { useConfirmationModal } from '@/hooks/useConfirmationModal'
import toast from 'react-hot-toast'



interface HeroSlide {
    id: string
  title: string
  subtitle?: string
  description?: string
  image: string
  mobileImage?: string
  ctaText?: string
  ctaLink?: string
  order: number
  isActive: boolean
}

interface HomeAboutData {
    title: string
    description: string
  image: string
}

interface HomeProcess {
  id: string
  title: string
  description: string
  content: string
  image: string
  link: string
  order: number
  isActive: boolean
}

interface HomeOrderProcessStep {
  id: string
  title: string
  description: string
  details: string[]
    icon: string
  order: number
  gradientFrom: string
  gradientTo: string
  bgColor: string
  borderColor: string
  textColor: string
}

interface WhyChooseUsContent {
  id: string
  title: string
  description: string
  image: string
  rating: number
  ratingText: string
  technologyText: string
}

interface WhyChooseUsFeature {
  id: string
  icon: string
  title: string
  description: string
  color: string
  bg: string
  order: number
  isActive: boolean
}

interface GalleryContent {
  id: string
  title: string
  subtitle: string
  description: string
}

interface GalleryImage {
  id: string
  title: string
  description: string
  image: string
  order: number
  isActive: boolean
}

interface TestimonialContent {
  id: string
  title: string
  subtitle: string
  description: string
  stats: {
    averageRating: string
    totalClients: string
    qualityCompliance: string
  }
}

interface Testimonial {
  id: string
  name: string
  avatar: string
  company: string
  quote: string
  rating: number
  date: string
  verified: boolean
  industry: string
  order: number
  isActive: boolean
}

export default function HomeContentPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  console.log('HomeContentPage rendered:', { user, loading })
  const { modalState, showConfirmation, hideConfirmation, handleConfirm } = useConfirmationModal()

  const showSuccessModal = (message: string) => {
    setSuccessModal({ isOpen: true, message })
  }

  const hideSuccessModal = () => {
    setSuccessModal({ isOpen: false, message: '' })
  }

  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [homeAboutData, setHomeAboutData] = useState<HomeAboutData>({
    title: '',
    description: '',
    image: ''
  })
  const [processes, setProcesses] = useState<HomeProcess[]>([])
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false)
  const [editingProcess, setEditingProcess] = useState<HomeProcess | null>(null)
  const [savingProcess, setSavingProcess] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [savingAbout, setSavingAbout] = useState(false)
  const [formData, setFormData] = useState({
    image: '',
    mobileImage: ''
  })
  const [activeSection, setActiveSection] = useState<'hero-slider' | 'home-about' | 'home-processes' | 'order-process' | 'why-choose-us' | 'gallery' | 'testimonials'>('hero-slider')
  const [orderSteps, setOrderSteps] = useState<HomeOrderProcessStep[]>([])
  const [isOrderStepModalOpen, setIsOrderStepModalOpen] = useState(false)
  const [editingOrderStep, setEditingOrderStep] = useState<HomeOrderProcessStep | null>(null)
  const [savingOrderStep, setSavingOrderStep] = useState(false)
  const [whyChooseUsContent, setWhyChooseUsContent] = useState<WhyChooseUsContent>({
    id: '',
    title: '',
    description: '',
    image: '',
    rating: 5,
    ratingText: '',
    technologyText: ''
  })
  const [whyChooseUsFeatures, setWhyChooseUsFeatures] = useState<WhyChooseUsFeature[]>([])
  const [isWhyChooseUsFeatureModalOpen, setIsWhyChooseUsFeatureModalOpen] = useState(false)
  const [editingWhyChooseUsFeature, setEditingWhyChooseUsFeature] = useState<WhyChooseUsFeature | null>(null)
  const [savingWhyChooseUsFeature, setSavingWhyChooseUsFeature] = useState(false)
  const [savingWhyChooseUsContent, setSavingWhyChooseUsContent] = useState(false)
  const [galleryContent, setGalleryContent] = useState<GalleryContent>({
    id: '',
    title: '',
    subtitle: '',
    description: ''
  })
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [isGalleryImageModalOpen, setIsGalleryImageModalOpen] = useState(false)
  const [editingGalleryImage, setEditingGalleryImage] = useState<GalleryImage | null>(null)
  const [savingGalleryImage, setSavingGalleryImage] = useState(false)
  const [savingGalleryContent, setSavingGalleryContent] = useState(false)
  const [togglingGalleryImage, setTogglingGalleryImage] = useState<string | null>(null)
  const [testimonialContent, setTestimonialContent] = useState<TestimonialContent>({
    id: '',
    title: '',
    subtitle: '',
    description: '',
    stats: {
      averageRating: '',
      totalClients: '',
      qualityCompliance: ''
    }
  })
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [savingTestimonial, setSavingTestimonial] = useState(false)
  const [savingTestimonialContent, setSavingTestimonialContent] = useState(false)
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: '' })
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('')

  // Update hidden input when uploaded image URL changes
  useEffect(() => {
    const imageInput = document.querySelector('input[name="image"]') as HTMLInputElement
    if (imageInput && uploadedImageUrl) {
      imageInput.value = uploadedImageUrl
      console.log('useEffect: Updated hidden input value to:', uploadedImageUrl)
    }
  }, [uploadedImageUrl])

  // Reset uploaded image URL when editing process changes
  useEffect(() => {
    if (editingProcess) {
      setUploadedImageUrl('')
    }
  }, [editingProcess?.id])


  useEffect(() => {
    console.log('Home page auth check:', { user, loading })
    // Temporarily comment out auth redirect to test navigation
    // if (!loading && !user) {
    //   console.log('Redirecting to login from home page')
    //   router.push('/login')
    // }
  }, [user, loading, router])

  useEffect(() => {
    fetchSlides()
    fetchHomeAboutData()
    fetchProcesses()
    fetchOrderSteps()
    fetchWhyChooseUsData()
    fetchGalleryData()
    fetchTestimonialData()
  }, [])



  // Home About Functions
  const fetchHomeAboutData = async () => {
    try {
      const response = await fetch('/api/content/home-about')
      if (response.ok) {
        const data = await response.json()
        setHomeAboutData(data)
      }
    } catch (error) {
      console.error('Failed to fetch home about data:', error)
    }
  }

  const handleSaveHomeAbout = async () => {
    setSavingAbout(true)
    try {
      const response = await fetch('/api/content/home-about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(homeAboutData),
      })

      if (response.ok) {
        showSuccessModal('Home About content saved successfully!')
      } else {
        toast.error('Failed to save home about content')
      }
    } catch (error) {
      toast.error('Error saving home about content')
    } finally {
      setSavingAbout(false)
    }
  }

  // Home Processes Functions
  const fetchProcesses = async () => {
    try {
      const response = await fetch('/api/content/home-processes')
      if (response.ok) {
        const data = await response.json()
        setProcesses(data)
      }
    } catch (error) {
      console.error('Failed to fetch processes:', error)
    }
  }

  const handleProcessSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSavingProcess(true)

    const formDataObj = new FormData(e.currentTarget)
    
    // Get the current image value from the hidden input or uploaded image URL
    const imageInput = document.querySelector('input[name="image"]') as HTMLInputElement
    let currentImageValue = uploadedImageUrl || (imageInput ? imageInput.value : formDataObj.get('image') as string)
    
    // Fallback: if no image value found, try to get from the editing process
    if (!currentImageValue && editingProcess?.image) {
      currentImageValue = editingProcess.image
    }
    
    console.log('Process submission data:', {
      uploadedImageUrl,
      imageInputValue: imageInput?.value,
      formDataImage: formDataObj.get('image'),
      editingProcessImage: editingProcess?.image,
      currentImageValue
    })
    
    const processData = {
      title: formDataObj.get('title') as string,
      description: formDataObj.get('description') as string,
      content: formDataObj.get('content') as string,
      image: currentImageValue,
      link: formDataObj.get('link') as string,
      order: parseInt(formDataObj.get('order') as string) || 0,
      isActive: formDataObj.get('isActive') === 'on',
    }

    try {
      const url = '/api/content/home-processes'
      const method = editingProcess ? 'PUT' : 'POST'
      const body = editingProcess 
        ? { ...processData, id: editingProcess.id }
        : processData

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Process saved successfully:', result)
        
        setIsProcessModalOpen(false)
        setEditingProcess(null)
        setUploadedImageUrl('') // Reset uploaded image URL
        fetchProcesses()
        
        // Trigger frontend refresh for home processes
        if (typeof window !== 'undefined') {
          const refreshHomeProcesses = (window as any).refreshHomeProcesses
          if (refreshHomeProcesses && typeof refreshHomeProcesses === 'function') {
            refreshHomeProcesses()
          }
        }
        
        showSuccessModal(editingProcess ? 'Process updated successfully!' : 'Process created successfully!')
      } else {
        const errorData = await response.json()
        console.error('Failed to save process:', errorData)
        toast.error(errorData.error || 'Failed to save process')
      }
    } catch (error) {
      toast.error('Error saving process')
    } finally {
      setSavingProcess(false)
    }
  }

  const handleEditProcess = (process: HomeProcess) => {
    setEditingProcess(process)
    setUploadedImageUrl('') // Reset uploaded image URL
    setIsProcessModalOpen(true)
  }

  const handleDeleteProcess = async (id: string) => {
    showConfirmation(
      'warning',
      'Delete Process',
      'Are you sure you want to delete this process? This action cannot be undone.',
      async () => {
        try {
          const response = await fetch(`/api/content/home-processes?id=${id}`, {
            method: 'DELETE',
          })

          if (response.ok) {
            fetchProcesses()
            
            // Trigger frontend refresh for home processes
            if (typeof window !== 'undefined') {
              const refreshHomeProcesses = (window as any).refreshHomeProcesses
              if (refreshHomeProcesses && typeof refreshHomeProcesses === 'function') {
                refreshHomeProcesses()
              }
            }
            
            showSuccessModal('Process deleted successfully!')
          } else {
            toast.error('Failed to delete process')
          }
        } catch (error) {
          toast.error('Error deleting process')
        }
      },
      'Delete',
      'Cancel'
    )
  }

  const handleToggleProcessActive = async (process: HomeProcess) => {
    try {
      const response = await fetch('/api/content/home-processes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...process,
          isActive: !process.isActive,
        }),
      })

      if (response.ok) {
        fetchProcesses()
        
        // Trigger frontend refresh for home processes
        if (typeof window !== 'undefined') {
          const refreshHomeProcesses = (window as any).refreshHomeProcesses
          if (refreshHomeProcesses && typeof refreshHomeProcesses === 'function') {
            refreshHomeProcesses()
          }
        }
        
        showSuccessModal(`Process ${!process.isActive ? 'activated' : 'deactivated'} successfully!`)
      } else {
        toast.error('Failed to update process status')
      }
    } catch (error) {
      toast.error('Error updating process status')
    }
  }

  // Hero Slider Functions
  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/content/hero-slider')
      if (response.ok) {
        const data = await response.json()
        setSlides(data)
      }
    } catch (error) {
      console.error('Failed to fetch slides:', error)
    }
  }

  const handleSlideSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formDataObj = new FormData(e.currentTarget)
    const slideData = {
      title: formDataObj.get('title') as string,
      subtitle: formDataObj.get('subtitle') as string,
      description: formDataObj.get('description') as string,
      image: formDataObj.get('image') as string,
      mobileImage: formDataObj.get('mobileImage') as string,
      ctaText: formDataObj.get('ctaText') as string,
      ctaLink: formDataObj.get('ctaLink') as string,
      order: parseInt(formDataObj.get('order') as string) || 0,
      isActive: formDataObj.get('isActive') === 'on',
    }

    try {
      const url = '/api/content/hero-slider'
      const method = editingSlide ? 'PUT' : 'POST'
      const body = editingSlide 
        ? { ...slideData, id: editingSlide.id }
        : slideData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        setIsModalOpen(false)
        setEditingSlide(null)
        setFormData({ image: '', mobileImage: '' })
        fetchSlides()
        showSuccessModal(editingSlide ? 'Slide updated successfully!' : 'Slide created successfully!')
      } else {
        const errorData = await response.json()
        console.error('Failed to save slide:', errorData)
        toast.error('Failed to save slide')
      }
    } catch (error) {
      console.error('Failed to save slide:', error)
      toast.error('Error saving slide')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditSlide = (slide: HeroSlide) => {
    setEditingSlide(slide)
    setFormData({
      image: slide.image || '',
      mobileImage: slide.mobileImage || ''
    })
    setIsModalOpen(true)
  }

  const handleDeleteSlide = async (id: string) => {
    showConfirmation(
      'warning',
      'Delete Slide',
      'Are you sure you want to delete this slide? This action cannot be undone.',
      async () => {
        try {
          const response = await fetch(`/api/content/hero-slider?id=${id}`, {
            method: 'DELETE',
          })

          if (response.ok) {
            fetchSlides()
            showSuccessModal('Slide deleted successfully!')
          } else {
            toast.error('Failed to delete slide')
          }
        } catch (error) {
          console.error('Failed to delete slide:', error)
          toast.error('Error deleting slide')
        }
      },
      'Delete',
      'Cancel'
    )
  }

  const handleToggleSlideActive = async (slide: HeroSlide) => {
    try {
      const response = await fetch('/api/content/hero-slider', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...slide,
          isActive: !slide.isActive,
        }),
      })

      if (response.ok) {
        fetchSlides()
        showSuccessModal(`Slide ${!slide.isActive ? 'activated' : 'deactivated'} successfully!`)
      } else {
        toast.error('Failed to update slide status')
      }
    } catch (error) {
      console.error('Failed to toggle slide status:', error)
      toast.error('Error updating slide status')
    }
  }

  const fetchOrderSteps = async () => {
    try {
      const response = await fetch('/api/content/home-order-process')
      if (response.ok) {
        const data = await response.json()
        setOrderSteps(data)
      }
    } catch (error) {
      console.error('Failed to fetch order process steps:', error)
    }
  }

  const handleOrderStepSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSavingOrderStep(true)
    const formDataObj = new FormData(e.currentTarget)
    const details = (formDataObj.get('details') as string).split('\n').map(s => s.trim()).filter(Boolean)
    
    // Get the order to determine which preset colors to use
    const order = parseInt(formDataObj.get('order') as string) || 1
    
    // Preset colors based on order (1-4)
    const colorPresets = {
      1: {
        gradientFrom: "from-emerald-500",
        gradientTo: "to-teal-500",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-600"
      },
      2: {
        gradientFrom: "from-purple-500",
        gradientTo: "to-violet-500",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-600"
      },
      3: {
        gradientFrom: "from-amber-500",
        gradientTo: "to-orange-500",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-600"
      },
      4: {
        gradientFrom: "from-rose-500",
        gradientTo: "to-pink-500",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-200",
        textColor: "text-rose-600"
      }
    }
    
    const colors = colorPresets[order as keyof typeof colorPresets] || colorPresets[1]
    
    const stepData = {
      title: formDataObj.get('title') as string,
      description: formDataObj.get('description') as string,
      details,
      icon: formDataObj.get('icon') as string,
      order,
      ...colors
    }
    try {
      const url = '/api/content/home-order-process'
      const method = editingOrderStep ? 'PUT' : 'POST'
      const body = editingOrderStep ? { ...stepData, id: editingOrderStep.id } : stepData
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (response.ok) {
        setIsOrderStepModalOpen(false)
        setEditingOrderStep(null)
        fetchOrderSteps()
        showSuccessModal(editingOrderStep ? 'Step updated!' : 'Step created!')
      } else {
        toast.error('Failed to save step')
      }
    } catch (error) {
      toast.error('Error saving step')
    } finally {
      setSavingOrderStep(false)
    }
  }

  const handleEditOrderStep = (step: HomeOrderProcessStep) => {
    setEditingOrderStep(step)
    setIsOrderStepModalOpen(true)
  }

  const handleDeleteOrderStep = async (id: string) => {
    showConfirmation(
      'warning',
      'Delete Step',
      'Are you sure you want to delete this step? This action cannot be undone.',
      async () => {
        try {
          const response = await fetch(`/api/content/home-order-process?id=${id}`, { method: 'DELETE' })
          if (response.ok) {
            fetchOrderSteps()
            showSuccessModal('Step deleted!')
          } else {
            toast.error('Failed to delete step')
          }
        } catch (error) {
          toast.error('Error deleting step')
        }
      },
      'Delete',
      'Cancel'
    )
  }

  // WhyChooseUs Functions
  const fetchWhyChooseUsData = async () => {
    try {
      const [contentResponse, featuresResponse] = await Promise.all([
        fetch('/api/content/why-choose-us-content'),
        fetch('/api/content/why-choose-us-features')
      ])

      if (contentResponse.ok) {
        const contentData = await contentResponse.json()
        setWhyChooseUsContent(contentData)
      }

      if (featuresResponse.ok) {
        const featuresData = await featuresResponse.json()
        setWhyChooseUsFeatures(featuresData)
      }
    } catch (error) {
      console.error('Failed to fetch why choose us data:', error)
    }
  }

  const handleSaveWhyChooseUsContent = async () => {
    setSavingWhyChooseUsContent(true)
    try {
      const response = await fetch('/api/content/why-choose-us-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(whyChooseUsContent),
      })

      if (response.ok) {
        showSuccessModal('Why Choose Us content saved successfully!')
      } else {
        toast.error('Failed to save why choose us content')
      }
    } catch (error) {
      toast.error('Error saving why choose us content')
    } finally {
      setSavingWhyChooseUsContent(false)
    }
  }

  const handleWhyChooseUsFeatureSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSavingWhyChooseUsFeature(true)
    const formData = new FormData(e.currentTarget)
    
    const featureData = {
      icon: formData.get('icon') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      color: formData.get('color') as string,
      bg: formData.get('bg') as string,
      order: parseInt(formData.get('order') as string) || 0,
      isActive: formData.get('isActive') === 'true'
    }

    try {
      const url = editingWhyChooseUsFeature 
        ? `/api/content/why-choose-us-features` 
        : '/api/content/why-choose-us-features'
      
      const method = editingWhyChooseUsFeature ? 'PUT' : 'POST'
      const body = editingWhyChooseUsFeature 
        ? { ...featureData, id: editingWhyChooseUsFeature.id }
        : featureData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        fetchWhyChooseUsData()
        setIsWhyChooseUsFeatureModalOpen(false)
        setEditingWhyChooseUsFeature(null)
        showSuccessModal(editingWhyChooseUsFeature ? 'Feature updated!' : 'Feature created!')
      } else {
        toast.error('Failed to save feature')
      }
    } catch (error) {
      toast.error('Error saving feature')
    } finally {
      setSavingWhyChooseUsFeature(false)
    }
  }

  const handleEditWhyChooseUsFeature = (feature: WhyChooseUsFeature) => {
    setEditingWhyChooseUsFeature(feature)
    setIsWhyChooseUsFeatureModalOpen(true)
  }

  const handleDeleteWhyChooseUsFeature = async (id: string) => {
    showConfirmation(
      'warning',
      'Delete Feature',
      'Are you sure you want to delete this feature? This action cannot be undone.',
      async () => {
        try {
          const response = await fetch(`/api/content/why-choose-us-features?id=${id}`, { method: 'DELETE' })
          if (response.ok) {
            fetchWhyChooseUsData()
            showSuccessModal('Feature deleted!')
          } else {
            toast.error('Failed to delete feature')
          }
        } catch (error) {
          toast.error('Error deleting feature')
        }
      },
      'Delete',
      'Cancel'
    )
  }

  const handleToggleWhyChooseUsFeatureActive = async (feature: WhyChooseUsFeature) => {
    try {
      const response = await fetch('/api/content/why-choose-us-features', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...feature,
          isActive: !feature.isActive,
        }),
      })

      if (response.ok) {
        fetchWhyChooseUsData()
        showSuccessModal(`Feature ${!feature.isActive ? 'activated' : 'deactivated'} successfully!`)
      } else {
        toast.error('Failed to update feature status')
      }
    } catch (error) {
      toast.error('Error updating feature status')
    }
  }

  // Gallery Functions
  const fetchGalleryData = async () => {
    try {
      const [contentResponse, imagesResponse] = await Promise.all([
        fetch('/api/content/gallery-content'),
        fetch('/api/content/gallery-images')
      ])

      if (contentResponse.ok) {
        const contentData = await contentResponse.json()
        setGalleryContent(contentData)
      }

      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json()
        setGalleryImages(imagesData)
      }
    } catch (error) {
      console.error('Failed to fetch gallery data:', error)
    }
  }

  const handleSaveGalleryContent = async () => {
    setSavingGalleryContent(true)
    try {
      const response = await fetch('/api/content/gallery-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(galleryContent),
      })

      if (response.ok) {
        await fetchGalleryData() // Refresh data
        showSuccessModal('Gallery content updated successfully!')
      } else {
        toast.error('Failed to save gallery content')
      }
    } catch (error) {
      toast.error('Error saving gallery content')
    } finally {
      setSavingGalleryContent(false)
    }
  }

  const handleGalleryImageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSavingGalleryImage(true)
    const formData = new FormData(e.currentTarget)
    
    const imageData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image: formData.get('image') as string,
      order: parseInt(formData.get('order') as string) || 0,
      isActive: formData.get('isActive') === 'true'
    }

    try {
      const url = editingGalleryImage 
        ? `/api/content/gallery-images` 
        : '/api/content/gallery-images'
      
      const method = editingGalleryImage ? 'PUT' : 'POST'
      const body = editingGalleryImage 
        ? { ...imageData, id: editingGalleryImage.id }
        : imageData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        await fetchGalleryData() // Refresh data
        setIsGalleryImageModalOpen(false)
        setEditingGalleryImage(null)
        showSuccessModal(editingGalleryImage ? 'Gallery image updated successfully!' : 'Gallery image created successfully!')
      } else {
        toast.error('Failed to save gallery image')
      }
    } catch (error) {
      toast.error('Error saving image')
    } finally {
      setSavingGalleryImage(false)
    }
  }

  const handleEditGalleryImage = (image: GalleryImage) => {
    setEditingGalleryImage(image)
    setIsGalleryImageModalOpen(true)
  }

  const handleDeleteGalleryImage = async (id: string) => {
    showConfirmation(
      'warning',
      'Delete Image',
      'Are you sure you want to delete this image? This action cannot be undone.',
      async () => {
        try {
          const response = await fetch(`/api/content/gallery-images?id=${id}`, { method: 'DELETE' })
                  if (response.ok) {
          await fetchGalleryData() // Refresh data
          showSuccessModal('Gallery image deleted successfully!')
        } else {
          toast.error('Failed to delete gallery image')
        }
        } catch (error) {
          toast.error('Error deleting image')
        }
      },
      'Delete',
      'Cancel'
    )
  }

  const handleToggleGalleryImageActive = async (image: GalleryImage) => {
    setTogglingGalleryImage(image.id)
    try {
      const response = await fetch('/api/content/gallery-images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...image,
          isActive: !image.isActive,
        }),
      })

      if (response.ok) {
        await fetchGalleryData() // Refresh data
        showSuccessModal(`Gallery image ${!image.isActive ? 'activated' : 'deactivated'} successfully!`)
      } else {
        toast.error('Failed to update gallery image status')
      }
    } catch (error) {
      toast.error('Error updating image status')
    } finally {
      setTogglingGalleryImage(null)
    }
  }

  // Testimonial Functions
  const fetchTestimonialData = async () => {
    try {
      const [contentResponse, testimonialsResponse] = await Promise.all([
        fetch('/api/content/testimonial-content'),
        fetch('/api/content/testimonials')
      ])

      if (contentResponse.ok) {
        const contentData = await contentResponse.json()
        setTestimonialContent({
          ...contentData,
          stats: contentData.stats || {
            averageRating: '',
            totalClients: '',
            qualityCompliance: ''
          }
        })
      }

      if (testimonialsResponse.ok) {
        const testimonialsData = await testimonialsResponse.json()
        setTestimonials(testimonialsData)
      }
    } catch (error) {
      console.error('Failed to fetch testimonial data:', error)
    }
  }

  const handleSaveTestimonialContent = async () => {
    setSavingTestimonialContent(true)
    try {
      const response = await fetch('/api/content/testimonial-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonialContent),
      })

      if (response.ok) {
        await fetchTestimonialData() // Refresh data
        showSuccessModal('Testimonial content updated successfully!')
      } else {
        toast.error('Failed to save testimonial content')
      }
    } catch (error) {
      toast.error('Error saving testimonial content')
    } finally {
      setSavingTestimonialContent(false)
    }
  }

  const handleTestimonialSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSavingTestimonial(true)
    const formData = new FormData(e.currentTarget)
    
    const testimonialData = {
      name: formData.get('name') as string,
      avatar: formData.get('avatar') as string,
      company: formData.get('company') as string,
      quote: formData.get('quote') as string,
      rating: parseInt(formData.get('rating') as string) || 5,
      date: formData.get('date') as string,
      verified: formData.get('verified') === 'true',
      industry: formData.get('industry') as string,
      order: parseInt(formData.get('order') as string) || 0,
      isActive: formData.get('isActive') === 'true'
    }

    try {
      const url = editingTestimonial 
        ? `/api/content/testimonials` 
        : '/api/content/testimonials'
      
      const method = editingTestimonial ? 'PUT' : 'POST'
      const body = editingTestimonial 
        ? { ...testimonialData, id: editingTestimonial.id }
        : testimonialData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        await fetchTestimonialData() // Refresh data
        setIsTestimonialModalOpen(false)
        setEditingTestimonial(null)
        showSuccessModal(editingTestimonial ? 'Testimonial updated successfully!' : 'Testimonial created successfully!')
      } else {
        toast.error('Failed to save testimonial')
      }
    } catch (error) {
      toast.error('Error saving testimonial')
    } finally {
      setSavingTestimonial(false)
    }
  }

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setIsTestimonialModalOpen(true)
  }

  const handleDeleteTestimonial = async (id: string) => {
    showConfirmation(
      'warning',
      'Delete Testimonial',
      'Are you sure you want to delete this testimonial? This action cannot be undone.',
      async () => {
        try {
          const response = await fetch(`/api/content/testimonials?id=${id}`, { method: 'DELETE' })
          if (response.ok) {
            await fetchTestimonialData() // Refresh data
            showSuccessModal('Testimonial deleted successfully!')
          } else {
            toast.error('Failed to delete testimonial')
          }
        } catch (error) {
          toast.error('Error deleting testimonial')
        }
      },
      'Delete',
      'Cancel'
    )
  }

  const handleToggleTestimonialActive = async (testimonial: Testimonial) => {
    try {
      const response = await fetch('/api/content/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...testimonial,
          isActive: !testimonial.isActive,
        }),
      })

      if (response.ok) {
        await fetchTestimonialData() // Refresh data
        showSuccessModal(`Testimonial ${!testimonial.isActive ? 'activated' : 'deactivated'} successfully!`)
      } else {
        toast.error('Failed to update testimonial status')
      }
    } catch (error) {
      toast.error('Error updating testimonial status')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
        
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Home Content Management</h1>
              <p className="mt-2 text-gray-600">
                Manage your home page content including hero slider, about section, and why choose us.
              </p>
            </div>

                        {/* Modern Toggle Menu */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-2 shadow-lg">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveSection('hero-slider')}
                    className={`group relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                      activeSection === 'hero-slider'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                        : 'text-blue-700 hover:bg-white/80 hover:shadow-md'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeSection === 'hero-slider' ? 'bg-white' : 'bg-blue-400'
                      }`} />
                      Hero Slider
                    </span>
                    {activeSection === 'hero-slider' && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 animate-pulse" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('home-about')}
                    className={`group relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                      activeSection === 'home-about'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                        : 'text-blue-700 hover:bg-white/80 hover:shadow-md'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeSection === 'home-about' ? 'bg-white' : 'bg-blue-400'
                      }`} />
                      Home About
                    </span>
                    {activeSection === 'home-about' && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 animate-pulse" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('home-processes')}
                    className={`group relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                      activeSection === 'home-processes'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                        : 'text-blue-700 hover:bg-white/80 hover:shadow-md'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeSection === 'home-processes' ? 'bg-white' : 'bg-blue-400'
                      }`} />
                      Home Processes
                    </span>
                    {activeSection === 'home-processes' && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 animate-pulse" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('order-process')}
                    className={`group relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                      activeSection === 'order-process'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                        : 'text-blue-700 hover:bg-white/80 hover:shadow-md'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeSection === 'order-process' ? 'bg-white' : 'bg-blue-400'
                      }`} />
                      Order Process
                    </span>
                    {activeSection === 'order-process' && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 animate-pulse" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('why-choose-us')}
                    className={`group relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                      activeSection === 'why-choose-us'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                        : 'text-blue-700 hover:bg-white/80 hover:shadow-md'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeSection === 'why-choose-us' ? 'bg-white' : 'bg-blue-400'
                      }`} />
                      Why Choose Us
                    </span>
                    {activeSection === 'why-choose-us' && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 animate-pulse" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('gallery')}
                    className={`group relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                      activeSection === 'gallery'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                        : 'text-blue-700 hover:bg-white/80 hover:shadow-md'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeSection === 'gallery' ? 'bg-white' : 'bg-blue-400'
                      }`} />
                      Gallery
                    </span>
                    {activeSection === 'gallery' && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 animate-pulse" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('testimonials')}
                    className={`group relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                      activeSection === 'testimonials'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                        : 'text-blue-700 hover:bg-white/80 hover:shadow-md'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeSection === 'testimonials' ? 'bg-white' : 'bg-blue-400'
                      }`} />
                      Testimonials
                    </span>
                    {activeSection === 'testimonials' && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 animate-pulse" />
                    )}
                  </button>
                </div>
              </div>
            </div>
              
            {/* Hero Slider Section */}
            {activeSection === 'hero-slider' && (
              <div>
                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Hero Slider</h2>
                    <p className="mt-2 text-gray-600">
                      Manage your hero slider content and images
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingSlide(null)
                      setFormData({ image: '', mobileImage: '' })
                      setIsModalOpen(true)
                    }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Add New Slide
                  </button>
                </div>

                {/* Slides Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {slides.map((slide) => (
                    <div key={slide.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="relative h-48 bg-gray-200">
                        <ImagePreview
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            onClick={() => handleToggleSlideActive(slide)}
                            className={`p-2 rounded-full ${
                              slide.isActive 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-500 text-white'
                            }`}
                            title={slide.isActive ? 'Active' : 'Inactive'}
                          >
                            {slide.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{slide.title}</h3>
                        {slide.subtitle && (
                          <p className="text-gray-600 text-sm mb-2">{slide.subtitle}</p>
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span>Order: {slide.order}</span>
                          <span className={`px-2 py-1 rounded ${
                            slide.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {slide.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditSlide(slide)}
                            className="flex-1 btn-secondary flex items-center justify-center gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSlide(slide.id)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {slides.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Upload className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No slides yet</h3>
                    <p className="text-gray-600 mb-4">Get started by adding your first hero slide</p>
                    <button
                      onClick={() => {
                        setEditingSlide(null)
                        setFormData({ image: '', mobileImage: '' })
                        setIsModalOpen(true)
                      }}
                      className="btn-primary"
                    >
                      Add First Slide
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Home About Section */}
            {activeSection === 'home-about' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Home About Section</h2>
                  <p className="mt-2 text-gray-600">
                    Manage the about section content that appears on your homepage.
                  </p>
                </div>

                <div className="bg-white shadow rounded-lg">
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                  </label>
                  <input
                    type="text"
                        value={homeAboutData.title}
                        onChange={(e) => setHomeAboutData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter section title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                  </label>
                      <textarea
                        rows={6}
                        value={homeAboutData.description}
                        onChange={(e) => setHomeAboutData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter section description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image
                      </label>
                      <ImageUpload
                        label="Section Image"
                        value={homeAboutData.image}
                        onChange={(url) => {
                          setHomeAboutData(prev => ({ ...prev, image: url }))
                        }}
                        maxSize={10}
                      />
                      {homeAboutData.image && (
                        <div className="mt-2">
                          <img
                            src={homeAboutData.image}
                            alt="About Section"
                            className="h-32 w-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveHomeAbout}
                        disabled={savingAbout}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50"
                      >
                        <Save className="h-5 w-5" />
                        {savingAbout ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Home Processes Section */}
            {activeSection === 'home-processes' && (
              <div>
                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Home Processes</h2>
                    <p className="mt-2 text-gray-600">
                      Manage the process cards that appear on your homepage.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingProcess(null)
                      setUploadedImageUrl('') // Reset uploaded image URL
                      setIsProcessModalOpen(true)
                    }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Add New Process
                  </button>
                </div>

                {/* Processes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {processes.map((process) => (
                    <div key={process.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="relative h-48 bg-gray-200">
                        {process.image ? (
                          <ImagePreview
                            src={process.image}
                            alt={process.title}
                            className="w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No image</span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            onClick={() => handleToggleProcessActive(process)}
                            className={`p-2 rounded-full ${
                              process.isActive 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-500 text-white'
                            }`}
                            title={process.isActive ? 'Active' : 'Inactive'}
                          >
                            {process.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{process.title}</h3>
                        <p className="text-blue-600 text-sm mb-2">{process.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span>Order: {process.order}</span>
                          <span className={`px-2 py-1 rounded ${
                            process.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {process.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProcess(process)}
                            className="flex-1 btn-secondary flex items-center justify-center gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProcess(process.id)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {processes.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Upload className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No processes yet</h3>
                    <p className="text-gray-600 mb-4">Get started by adding your first process card</p>
                    <button
                      onClick={() => {
                        setEditingProcess(null)
                        setUploadedImageUrl('') // Reset uploaded image URL
                        setIsProcessModalOpen(true)
                      }}
                      className="btn-primary"
                    >
                      Add First Process
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Order Process Section */}
            {activeSection === 'order-process' && (
              <div>
                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Order Process Steps</h2>
                    <p className="mt-2 text-gray-600">Manage the steps shown in the order process on your homepage.</p>
                  </div>
                  <button
                    onClick={() => { setEditingOrderStep(null); setIsOrderStepModalOpen(true) }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus className="h-5 w-5" /> Add Step
                  </button>
                </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {orderSteps.map((step) => (
                     <div key={step.id} className={`bg-white rounded-2xl border-2 ${step.borderColor} p-6 shadow-sm relative`}>
                       <div className="absolute -top-4 left-6">
                         <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.gradientFrom} ${step.gradientTo} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                           {step.order}
                         </div>
                       </div>
                       <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${step.bgColor} mb-4`}>
                         <span className={`text-2xl ${step.textColor}`}>{step.icon}</span>
                       </div>
                       <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                       <p className="text-gray-600 mb-3">{step.description}</p>
                       <ul className="mb-3 space-y-1">
                         {step.details.map((d, i) => <li key={i} className="text-gray-700 text-sm">- {d}</li>)}
                       </ul>
                       <div className="flex gap-2">
                         <button onClick={() => handleEditOrderStep(step)} className="btn-secondary flex-1 flex items-center justify-center gap-2"><Edit className="h-4 w-4" />Edit</button>
                         <button onClick={() => handleDeleteOrderStep(step.id)} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="h-4 w-4" /></button>
                       </div>
                     </div>
                   ))}
                 </div>
                {isOrderStepModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-bold">{editingOrderStep ? 'Edit Step' : 'Add Step'}</h2>
                          <button onClick={() => { setIsOrderStepModalOpen(false); setEditingOrderStep(null) }} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleOrderStepSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                              <input type="text" name="title" defaultValue={editingOrderStep?.title} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                              <input type="number" name="order" defaultValue={editingOrderStep?.order || 0} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                          </div>
                                                     <div>
                             <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                             <textarea name="description" defaultValue={editingOrderStep?.description} rows={2} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                           </div>
                           <div>
                             <label className="block text-sm font-medium text-gray-700 mb-2">Details (one per line)</label>
                             <textarea name="details" defaultValue={editingOrderStep?.details?.join('\n') || ''} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                           </div>
                           <div>
                             <label className="block text-sm font-medium text-gray-700 mb-2">Icon (Emoji or text, e.g. 📧, ⚙️, ✅, 📦)</label>
                             <input type="text" name="icon" defaultValue={editingOrderStep?.icon} placeholder="📧" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                           </div>
                           <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                             <p className="text-sm text-blue-800">
                               💡 <strong>Note:</strong> Colors are automatically assigned based on the order number:
                               <br />• Order 1: Emerald theme
                               <br />• Order 2: Purple theme  
                               <br />• Order 3: Amber theme
                               <br />• Order 4: Rose theme
                             </p>
                           </div>
                          <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={() => { setIsOrderStepModalOpen(false); setEditingOrderStep(null) }} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">Cancel</button>
                            <button type="submit" disabled={savingOrderStep} className="btn-primary disabled:opacity-50">{savingOrderStep ? 'Saving...' : editingOrderStep ? 'Update Step' : 'Create Step'}</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Why Choose Us Section */}
            {activeSection === 'why-choose-us' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us Content</h2>
                  <div className="bg-white rounded-lg p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                        value={whyChooseUsContent.title}
                        onChange={(e) => setWhyChooseUsContent({...whyChooseUsContent, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={whyChooseUsContent.description}
                        onChange={(e) => setWhyChooseUsContent({...whyChooseUsContent, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Upload Container */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                          <div className="space-y-3">
                            <div className="text-gray-400">
                              <Upload className="h-8 w-8 mx-auto" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                {whyChooseUsContent.image ? 'Upload New Image' : 'Upload Hero Image'}
                              </p>
                              <p className="text-xs text-gray-600 mb-3">
                                {whyChooseUsContent.image 
                                  ? "Uploading a new image will replace the existing one automatically."
                                  : "PNG, JPG, GIF, WEBP up to 10MB"
                                }
                              </p>
                              <div className="flex items-center justify-center">
                                <ImageUpload
                                  label=""
                                  value={whyChooseUsContent.image}
                                  onChange={(url) => {
                                    setWhyChooseUsContent({...whyChooseUsContent, image: url})
                                    showSuccessModal('Image uploaded successfully!')
                                  }}
                                  maxSize={10}
                                  className="w-full"
                                />
                              </div>
                            </div>
                          </div>
                </div>

                        {/* Preview Container */}
                        {whyChooseUsContent.image ? (
                          <div className="space-y-2">
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
                              <p className="text-xs text-blue-800">
                                💡 <strong>Current:</strong> {whyChooseUsContent.image.split('/').pop()}
                              </p>
                            </div>
                            <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                              <ImagePreview
                                src={whyChooseUsContent.image}
                                alt="Why Choose Us Hero Image"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center h-40 flex items-center justify-center">
                            <div className="text-gray-300">
                              <Upload className="h-8 w-8 mx-auto mb-2" />
                              <p className="text-xs text-gray-400">No image uploaded</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={whyChooseUsContent.rating}
                          onChange={(e) => setWhyChooseUsContent({...whyChooseUsContent, rating: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating Text</label>
                        <input
                          type="text"
                          value={whyChooseUsContent.ratingText}
                          onChange={(e) => setWhyChooseUsContent({...whyChooseUsContent, ratingText: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Technology Text</label>
                        <input
                          type="text"
                          value={whyChooseUsContent.technologyText}
                          onChange={(e) => setWhyChooseUsContent({...whyChooseUsContent, technologyText: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveWhyChooseUsContent}
                        disabled={savingWhyChooseUsContent}
                        className="btn-primary disabled:opacity-50"
                      >
                        {savingWhyChooseUsContent ? 'Saving...' : 'Save Content'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Why Choose Us Features</h2>
                    <p className="mt-2 text-gray-600">Manage the features displayed in the why choose us section.</p>
                  </div>
                  <button
                    onClick={() => { setEditingWhyChooseUsFeature(null); setIsWhyChooseUsFeatureModalOpen(true) }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus className="h-5 w-5" /> Add Feature
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {whyChooseUsFeatures.map((feature) => (
                    <div key={feature.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl ${feature.bg} ${feature.color}`}>
                            <span className="text-xl">{feature.icon}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleWhyChooseUsFeatureActive(feature)}
                              className={`p-2 rounded-full ${
                                feature.isActive 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-gray-500 text-white'
                              }`}
                              title={feature.isActive ? 'Active' : 'Inactive'}
                            >
                              {feature.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 mb-4">{feature.description}</p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditWhyChooseUsFeature(feature)} 
                            className="btn-secondary flex-1 flex items-center justify-center gap-2"
                          >
                            <Edit className="h-4 w-4" />Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteWhyChooseUsFeature(feature.id)} 
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Why Choose Us Feature Modal */}
                {isWhyChooseUsFeatureModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-bold">{editingWhyChooseUsFeature ? 'Edit Feature' : 'Add Feature'}</h2>
                          <button onClick={() => { setIsWhyChooseUsFeatureModalOpen(false); setEditingWhyChooseUsFeature(null) }} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleWhyChooseUsFeatureSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Icon (Lucide icon name)</label>
                              <input 
                                type="text" 
                                name="icon" 
                                defaultValue={editingWhyChooseUsFeature?.icon} 
                                required 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Brain, FlaskConical, etc."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                              <input 
                                type="number" 
                                name="order" 
                                defaultValue={editingWhyChooseUsFeature?.order || 0} 
                                min="0" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                            <input 
                              type="text" 
                              name="title" 
                              defaultValue={editingWhyChooseUsFeature?.title} 
                              required 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                            <textarea 
                              name="description" 
                              defaultValue={editingWhyChooseUsFeature?.description} 
                              rows={3} 
                              required 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Color Class</label>
                              <input 
                                type="text" 
                                name="color" 
                                defaultValue={editingWhyChooseUsFeature?.color} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="text-blue-600"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Background Class</label>
                              <input 
                                type="text" 
                                name="bg" 
                                defaultValue={editingWhyChooseUsFeature?.bg} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="bg-blue-50"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="flex items-center">
                              <input 
                                type="checkbox" 
                                name="isActive" 
                                defaultChecked={editingWhyChooseUsFeature?.isActive !== false} 
                                className="mr-2"
                              />
                              <span className="text-sm font-medium text-gray-700">Active</span>
                            </label>
                          </div>
                          <div className="flex justify-end gap-4 pt-4">
                            <button 
                              type="button" 
                              onClick={() => { setIsWhyChooseUsFeatureModalOpen(false); setEditingWhyChooseUsFeature(null) }} 
                              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit" 
                              disabled={savingWhyChooseUsFeature} 
                              className="btn-primary disabled:opacity-50"
                            >
                              {savingWhyChooseUsFeature ? 'Saving...' : editingWhyChooseUsFeature ? 'Update Feature' : 'Create Feature'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Gallery Section */}
            {activeSection === 'gallery' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery Content</h2>
                  <div className="bg-white rounded-lg p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={galleryContent.title}
                        onChange={(e) => setGalleryContent({...galleryContent, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={galleryContent.subtitle}
                        onChange={(e) => setGalleryContent({...galleryContent, subtitle: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={galleryContent.description}
                        onChange={(e) => setGalleryContent({...galleryContent, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveGalleryContent}
                        disabled={savingGalleryContent}
                        className="btn-primary disabled:opacity-50"
                      >
                        {savingGalleryContent ? 'Saving...' : 'Save Content'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gallery Images</h2>
                    <p className="mt-2 text-gray-600">Manage the images displayed in the gallery carousel.</p>
                  </div>
                  <button
                    onClick={() => { setEditingGalleryImage(null); setIsGalleryImageModalOpen(true) }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus className="h-5 w-5" /> Add Image
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryImages.map((image) => (
                    <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="relative h-48 bg-gray-200">
                        <ImagePreview
                          src={image.image}
                          alt={image.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            onClick={() => handleToggleGalleryImageActive(image)}
                            disabled={togglingGalleryImage === image.id}
                            className={`p-2 rounded-full transition-all duration-200 ${
                              image.isActive 
                                ? 'bg-green-500 text-white hover:bg-green-600' 
                                : 'bg-gray-500 text-white hover:bg-gray-600'
                            } ${togglingGalleryImage === image.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={image.isActive ? 'Active' : 'Inactive'}
                          >
                            {togglingGalleryImage === image.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              image.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{image.title}</h3>
                        <p className="text-gray-600 mb-3 text-sm">{image.description}</p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditGalleryImage(image)} 
                            className="btn-secondary flex-1 flex items-center justify-center gap-2"
                          >
                            <Edit className="h-4 w-4" />Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteGalleryImage(image.id)} 
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gallery Image Modal */}
                {isGalleryImageModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-bold">{editingGalleryImage ? 'Edit Image' : 'Add Image'}</h2>
                          <button onClick={() => { setIsGalleryImageModalOpen(false); setEditingGalleryImage(null) }} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleGalleryImageSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                              <input 
                                type="text" 
                                name="title" 
                                defaultValue={editingGalleryImage?.title} 
                                required 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                              <input 
                                type="number" 
                                name="order" 
                                defaultValue={editingGalleryImage?.order || 0} 
                                min="0" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea 
                              name="description" 
                              defaultValue={editingGalleryImage?.description} 
                              rows={3} 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                          </div>
                                                     <div>
                             <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {/* Upload Container */}
                               <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                                 <div className="space-y-3">
                                   <div className="text-gray-400">
                                     <Upload className="h-8 w-8 mx-auto" />
                                   </div>
                                   <div>
                                     <p className="text-sm font-medium text-gray-900 mb-1">
                                       Upload Gallery Image
                                     </p>
                                     <p className="text-xs text-gray-600 mb-3">
                                       PNG, JPG, GIF, WEBP up to 10MB
                                     </p>
                                     <ImageUpload
                                       label=""
                                       value=""
                                       onChange={(url) => {
                                         // Update the form value
                                         const imageInput = document.querySelector('input[name="image"]') as HTMLInputElement
                                         if (imageInput) {
                                           imageInput.value = url
                                         }
                                         // Show success message
                                         toast.success('Gallery image uploaded successfully!')
                                       }}
                                       maxSize={10}
                                       className="w-full"
                                     />
                                   </div>
                                 </div>
                               </div>

                               {/* Preview Container */}
                               <div className="space-y-3">
                                 <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                   <p className="text-sm text-gray-700 font-medium mb-2">Image Preview</p>
                                   {editingGalleryImage?.image ? (
                                     <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                                       <ImagePreview
                                         src={editingGalleryImage.image}
                                         alt="Gallery Image"
                                         className="w-full h-full object-cover"
                                       />
                                       <div className="absolute top-2 right-2">
                                         <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                           Current
                                         </div>
                                       </div>
                                     </div>
                                   ) : (
                                     <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                                       <div className="text-center text-gray-400">
                                         <Upload className="h-8 w-8 mx-auto mb-2" />
                                         <p className="text-xs">No image uploaded</p>
                                       </div>
                                     </div>
                                   )}
                                 </div>
                               </div>
                             </div>
                             <input
                               type="hidden"
                               name="image"
                               defaultValue={editingGalleryImage?.image || ''}
                             />
                           </div>
                          <div>
                            <label className="flex items-center">
                              <input 
                                type="checkbox" 
                                name="isActive" 
                                defaultChecked={editingGalleryImage?.isActive !== false} 
                                className="mr-2"
                              />
                              <span className="text-sm font-medium text-gray-700">Active</span>
                            </label>
                          </div>
                          <div className="flex justify-end gap-4 pt-4">
                            <button 
                              type="button" 
                              onClick={() => { setIsGalleryImageModalOpen(false); setEditingGalleryImage(null) }} 
                              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit" 
                              disabled={savingGalleryImage} 
                              className="btn-primary disabled:opacity-50"
                            >
                              {savingGalleryImage ? 'Saving...' : editingGalleryImage ? 'Update Image' : 'Create Image'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Testimonials Section */}
            {activeSection === 'testimonials' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Testimonial Content</h2>
                  <div className="bg-white rounded-lg p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={testimonialContent.title}
                        onChange={(e) => setTestimonialContent({...testimonialContent, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={testimonialContent.subtitle}
                        onChange={(e) => setTestimonialContent({...testimonialContent, subtitle: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={testimonialContent.description}
                        onChange={(e) => setTestimonialContent({...testimonialContent, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Average Rating</label>
                        <input
                          type="text"
                          value={testimonialContent.stats?.averageRating || ''}
                          onChange={(e) => setTestimonialContent({
                            ...testimonialContent, 
                            stats: {...(testimonialContent.stats || {}), averageRating: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Clients</label>
                        <input
                          type="text"
                          value={testimonialContent.stats?.totalClients || ''}
                          onChange={(e) => setTestimonialContent({
                            ...testimonialContent, 
                            stats: {...(testimonialContent.stats || {}), totalClients: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quality Compliance</label>
                        <input
                          type="text"
                          value={testimonialContent.stats?.qualityCompliance || ''}
                          onChange={(e) => setTestimonialContent({
                            ...testimonialContent, 
                            stats: {...(testimonialContent.stats || {}), qualityCompliance: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveTestimonialContent}
                        disabled={savingTestimonialContent}
                        className="btn-primary disabled:opacity-50"
                      >
                        {savingTestimonialContent ? 'Saving...' : 'Save Content'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
                    <p className="mt-2 text-gray-600">Manage client testimonials and reviews.</p>
                  </div>
                  <button
                    onClick={() => { setEditingTestimonial(null); setIsTestimonialModalOpen(true) }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus className="h-5 w-5" /> Add Testimonial
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center font-bold text-blue-700">
                              {testimonial.avatar}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                              <p className="text-sm text-gray-600">{testimonial.company}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleTestimonialActive(testimonial)}
                            className={`p-2 rounded-full ${
                              testimonial.isActive 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-500 text-white'
                            }`}
                            title={testimonial.isActive ? 'Active' : 'Inactive'}
                          >
                            {testimonial.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </button>
                        </div>
                        <div className="flex items-center mb-2">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonial.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{testimonial.quote}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span>{testimonial.industry} Sector</span>
                          <span>{testimonial.date}</span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditTestimonial(testimonial)} 
                            className="btn-secondary flex-1 flex items-center justify-center gap-2"
                          >
                            <Edit className="h-4 w-4" />Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteTestimonial(testimonial.id)} 
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Testimonial Modal */}
                {isTestimonialModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-bold">{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                          <button onClick={() => { setIsTestimonialModalOpen(false); setEditingTestimonial(null) }} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                              <input 
                                type="text" 
                                name="name" 
                                defaultValue={editingTestimonial?.name} 
                                required 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Avatar (Initials) *</label>
                              <input 
                                type="text" 
                                name="avatar" 
                                defaultValue={editingTestimonial?.avatar} 
                                required 
                                maxLength={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                              <input 
                                type="text" 
                                name="company" 
                                defaultValue={editingTestimonial?.company} 
                                required 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                              <select 
                                name="industry" 
                                defaultValue={editingTestimonial?.industry} 
                                required 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Industry</option>
                                <option value="Automotive">Automotive</option>
                                <option value="Aerospace">Aerospace</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Energy">Energy</option>
                                <option value="Medical">Medical</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                              <select 
                                name="rating" 
                                defaultValue={editingTestimonial?.rating || 5} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value={5}>5 Stars</option>
                                <option value={4}>4 Stars</option>
                                <option value={3}>3 Stars</option>
                                <option value={2}>2 Stars</option>
                                <option value={1}>1 Star</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                              <input 
                                type="text" 
                                name="date" 
                                defaultValue={editingTestimonial?.date} 
                                placeholder="e.g., 2 months ago"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quote *</label>
                            <textarea 
                              name="quote" 
                              defaultValue={editingTestimonial?.quote} 
                              rows={4} 
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                              <input 
                                type="number" 
                                name="order" 
                                defaultValue={editingTestimonial?.order || 0} 
                                min="0" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                              />
                            </div>
                            <div className="flex items-center">
                              <input 
                                type="checkbox" 
                                name="verified" 
                                defaultChecked={editingTestimonial?.verified !== false} 
                                className="mr-2"
                              />
                              <label className="text-sm font-medium text-gray-700">Verified Client</label>
                            </div>
                          </div>
                          <div>
                            <label className="flex items-center">
                              <input 
                                type="checkbox" 
                                name="isActive" 
                                defaultChecked={editingTestimonial?.isActive !== false} 
                                className="mr-2"
                              />
                              <span className="text-sm font-medium text-gray-700">Active</span>
                            </label>
                          </div>
                          <div className="flex justify-end gap-4 pt-4">
                            <button 
                              type="button" 
                              onClick={() => { setIsTestimonialModalOpen(false); setEditingTestimonial(null) }} 
                              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit" 
                              disabled={savingTestimonial} 
                              className="btn-primary disabled:opacity-50"
                            >
                              {savingTestimonial ? 'Saving...' : editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingSlide ? 'Edit Slide' : 'Add New Slide'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingSlide(null)
                    setFormData({ image: '', mobileImage: '' })
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSlideSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingSlide?.title}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    defaultValue={editingSlide?.subtitle}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingSlide?.description}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <ImageUpload
                    label="Desktop Image"
                    value={formData.image}
                    onChange={(url) => {
                      setFormData(prev => ({ ...prev, image: url }))
                    }}
                    required
                    maxSize={10}
                  />
                  <input
                    type="hidden"
                    name="image"
                    value={formData.image}
                    required
                  />
                </div>

                <div>
                  <ImageUpload
                    label="Mobile Image (Optional)"
                    value={formData.mobileImage}
                    onChange={(url) => {
                      setFormData(prev => ({ ...prev, mobileImage: url }))
                    }}
                    maxSize={10}
                  />
                  <input
                    type="hidden"
                    name="mobileImage"
                    value={formData.mobileImage}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      CTA Text
                  </label>
                    <input
                      type="text"
                      name="ctaText"
                      defaultValue={editingSlide?.ctaText || 'Learn More'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CTA Link
                    </label>
                    <input
                      type="text"
                      name="ctaLink"
                      defaultValue={editingSlide?.ctaLink}
                      placeholder="/contact"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order
                    </label>
                    <input
                      type="number"
                      name="order"
                      defaultValue={editingSlide?.order || 0}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      defaultChecked={editingSlide?.isActive ?? true}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
              </div>
            </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false)
                      setEditingSlide(null)
                      setFormData({ image: '', mobileImage: '' })
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : editingSlide ? 'Update Slide' : 'Create Slide'}
                  </button>
              </div>
              </form>
            </div>
          </div>
        </div>
      )}
              
      {/* Process Modal */}
      {isProcessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingProcess ? 'Edit Process' : 'Add New Process'}
                </h2>
                <button
                  onClick={() => {
                    setIsProcessModalOpen(false)
                    setEditingProcess(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleProcessSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                          </label>
                          <input
                            type="text"
                      name="title"
                      defaultValue={editingProcess?.title}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <input
                      type="text"
                      name="description"
                      defaultValue={editingProcess?.description}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                          </label>
                          <textarea
                    name="content"
                    defaultValue={editingProcess?.content}
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link *
                          </label>
                          <input
                            type="text"
                      name="link"
                      defaultValue={editingProcess?.link}
                      required
                      placeholder="/processes/silver-plating"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order
                    </label>
                    <input
                      type="number"
                      name="order"
                      defaultValue={editingProcess?.order || 0}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Process Image
                  </label>
                  
                  {/* Current Image Display */}
                  {editingProcess?.image && (
                    <div className="current-image-section mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Current Image:</span> {editingProcess.image.split('/').pop()}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const imageInput = document.querySelector('input[name="image"]') as HTMLInputElement
                            if (imageInput) {
                              imageInput.value = ''
                            }
                            // Clear the image preview by hiding this section
                            const currentImageSection = document.querySelector('.current-image-section') as HTMLElement
                            if (currentImageSection) {
                              currentImageSection.style.display = 'none'
                            }
                          }}
                          className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                          title="Remove current image"
                        >
                          <X className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                      <div className="relative inline-block">
                        <img 
                          src={editingProcess.image} 
                          alt="Current process image"
                          className="w-40 h-32 object-cover rounded-lg border border-gray-300"
                          />
                        </div>
                      </div>
                  )}

                  {/* Image Upload Section */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <div className="space-y-4">
                      <div className="text-gray-400">
                        <Upload className="h-12 w-12 mx-auto" />
                    </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900 mb-2">
                          {editingProcess?.image ? 'Upload New Image' : 'Upload Process Image'}
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                          {editingProcess?.image 
                            ? "Uploading a new image will replace the existing one automatically."
                            : "Upload an image for this process (JPG, PNG, WebP up to 10MB)"
                          }
                        </p>
                        {editingProcess?.image && (
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                            <p className="text-sm text-blue-800">
                              💡 <strong>Tip:</strong> You can upload a new image directly - it will automatically replace the current one.
                            </p>
                          </div>
                        )}
                        <div className="flex items-center justify-center">
                          <ProcessImageUpload
                            onChange={(url) => {
                              console.log('Image upload callback triggered with URL:', url)
                              
                              // Update the form value
                              const imageInput = document.querySelector('input[name="image"]') as HTMLInputElement
                              if (imageInput) {
                                imageInput.value = url
                                console.log('Updated hidden input value to:', url)
                              } else {
                                console.warn('Image input not found')
                              }
                              
                              // Update the state
                              setUploadedImageUrl(url)
                              console.log('Updated uploadedImageUrl state to:', url)
                              
                              // Show success message
                              showSuccessModal('Image uploaded successfully!')
                            }}
                            maxSize={10}
                            className="w-full"
                          />
                        </div>
                </div>
              </div>
            </div>

                  <input
                    type="hidden"
                    name="image"
                    defaultValue={editingProcess?.image || ''}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={editingProcess?.isActive ?? true}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                                <button
                    type="button"
                    onClick={() => {
                      setIsProcessModalOpen(false)
                      setEditingProcess(null)
                      setUploadedImageUrl('') // Reset uploaded image URL
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProcess}
                    className="btn-primary disabled:opacity-50"
                  >
                    {savingProcess ? 'Saving...' : editingProcess ? 'Update Process' : 'Create Process'}
              </button>
            </div>
              </form>
          </div>
      </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={hideConfirmation}
        onConfirm={handleConfirm}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModal.isOpen}
        message={successModal.message}
        onClose={hideSuccessModal}
      />
    </div>
  )
} 
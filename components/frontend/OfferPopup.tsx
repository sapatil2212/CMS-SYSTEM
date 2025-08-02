'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

interface OfferPopupData {
  id: string
  title: string
  description: string
  image: string
  ctaText: string
  ctaLink?: string
  isActive: boolean
}

export default function OfferPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [offerData, setOfferData] = useState<OfferPopupData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    fetchOfferPopup()
  }, [])

  const fetchOfferPopup = async () => {
    try {
      const response = await fetch('/api/content/offer-popup')
      if (response.ok) {
        const data = await response.json()
        // Find the active popup from the array
        const activePopup = Array.isArray(data) 
          ? data.find(popup => popup.isActive) 
          : (data && data.isActive ? data : null)
        
        if (activePopup) {
          setOfferData(activePopup)
          // Show popup every time user visits the home page
          setIsVisible(true)
        }
      }
    } catch (error) {
      console.error('Error fetching offer popup:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleLearnMore = () => {
    if (offerData?.ctaLink) {
      window.open(offerData.ctaLink, '_blank')
    }
    handleClose()
  }

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight
    })
    setImageLoaded(true)
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement
    target.style.display = 'none'
    target.parentElement!.classList.add('bg-gradient-to-br', 'from-blue-500', 'to-purple-600')
    setImageLoaded(true)
  }

  if (isLoading || !offerData || !isVisible) {
    return null
  }

  // Calculate modal size based on image dimensions
  const maxWidth = Math.min(imageDimensions.width || 600, window.innerWidth * 0.9)
  const maxHeight = Math.min(imageDimensions.height || 400, window.innerHeight * 0.9)
  
  const modalWidth = imageLoaded ? maxWidth : 600
  const modalHeight = imageLoaded ? maxHeight : 400

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
        style={{
          width: `${modalWidth}px`,
          height: `${modalHeight}px`,
          maxWidth: '90vw',
          maxHeight: '90vh'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all duration-200 shadow-lg backdrop-blur-sm"
        >
          <XMarkIcon className="h-5 w-5 text-gray-600" />
        </button>

        {/* Image Container */}
        <div className="relative w-full h-full">
          <img
            src={offerData.image}
            alt={offerData.title}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          
          {/* CTA Button - Positioned on bottom right of image */}
          <div className="absolute bottom-4 right-4">
            <button
              onClick={handleLearnMore}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white bg-opacity-90 backdrop-blur-sm text-gray-800 font-medium rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-200 hover:shadow-xl"
            >
              <span className="text-sm">{offerData.ctaText}</span>
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 
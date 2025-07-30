'use client'

import { useState } from 'react'
import { Eye, EyeOff, Image as ImageIcon } from 'lucide-react'

interface ImagePreviewProps {
  src: string
  alt: string
  className?: string
  showFallback?: boolean
}

export default function ImagePreview({ 
  src, 
  alt, 
  className = '', 
  showFallback = true 
}: ImagePreviewProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  if (imageError && showFallback) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-4">
          <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500">Image not available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        onError={handleImageError}
        onLoad={handleImageLoad}
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-200 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  )
} 
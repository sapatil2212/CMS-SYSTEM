'use client'

import { useState, useRef } from 'react'
import { logger } from '@/lib/logger';
import {  Upload, X, Image as ImageIcon  } from 'lucide-react';

interface ProcessImageUploadProps {
  onChange: (url: string) => void
  className?: string
  maxSize?: number // in MB
}

export default function ProcessImageUpload({
  onChange,
  className = '',
  maxSize = 10
}: ProcessImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    setError(null)
    setIsUploading(true)

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file')
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        throw new Error(`File size must be less than ${maxSize}MB`)
      }

      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      logger.log('Image uploaded successfully:', data)
      onChange(data.url)
    } catch (err) {
      logger.error('Image upload failed:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  return (
    <div className={className}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-4 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${error ? 'border-red-500 bg-red-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-2">
          <div className="flex justify-center">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600">
              Drag and drop an image here, or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-500 font-medium"
                disabled={isUploading}
              >
                browse
              </button>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF, WEBP up to {maxSize}MB
            </p>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {/* Upload progress */}
        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  )
} 
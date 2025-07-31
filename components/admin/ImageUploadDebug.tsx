'use client'

import { useState } from 'react'
import { Upload, CheckCircle, XCircle } from 'lucide-react'

interface ImageUploadDebugProps {
  onUploadSuccess?: (url: string) => void
  onUploadError?: (error: string) => void
}

export default function ImageUploadDebug({ onUploadSuccess, onUploadError }: ImageUploadDebugProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState('')
  const [error, setError] = useState('')

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setError('')
    setUploadedUrl('')

    try {
      const formData = new FormData()
      formData.append('image', file)

      console.log('Uploading file:', {
        name: file.name,
        size: file.size,
        type: file.type
      })

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      console.log('Upload response:', data)
      setUploadedUrl(data.url)
      onUploadSuccess?.(data.url)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      console.error('Upload error:', err)
      setError(errorMessage)
      onUploadError?.(errorMessage)
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  return (
    <div className="p-4 border border-gray-300 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Image Upload Debug</h3>
      
      <div className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isUploading ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop an image here, or{' '}
            <label className="text-blue-600 hover:text-blue-500 cursor-pointer">
              browse
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF, WEBP up to 5MB
          </p>
        </div>

        {/* Upload Status */}
        {isUploading && (
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Uploading...</span>
          </div>
        )}

        {/* Success */}
        {uploadedUrl && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Upload successful!</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center space-x-2 text-red-600">
            <XCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Uploaded Image Preview */}
        {uploadedUrl && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Uploaded Image:</h4>
            <img
              src={uploadedUrl}
              alt="Uploaded preview"
              className="max-w-xs rounded-lg shadow-sm"
            />
            <p className="text-xs text-gray-500 mt-1 break-all">{uploadedUrl}</p>
          </div>
        )}
      </div>
    </div>
  )
} 
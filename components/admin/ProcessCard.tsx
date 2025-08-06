'use client'

import { useState } from 'react'
import { logger } from '@/lib/logger';
import {  Edit, Trash2, Eye, Power, PowerOff, Wrench, Image  } from 'lucide-react';

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

interface ProcessCardProps {
  process: ProcessData
  onEdit: () => void
  onDelete: () => void
  onToggleActive: () => void
}

export default function ProcessCard({ process, onEdit, onDelete, onToggleActive }: ProcessCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  const hasContent = process.content && (
    process.content.heroTitle || 
    process.content.heroSubtitle || 
    process.content.whatIsTitle
  )

  const handleImageError = () => {
    logger.log('❌ ProcessCard: Image failed to load for', process.name)
    setImageError(true)
  }

  return (
    <div
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200
        ${isHovered ? 'shadow-md border-gray-300' : ''}
        ${process.isActive ? 'ring-2 ring-green-100' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`
              p-2 rounded-lg
              ${process.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}
            `}>
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{process.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{process.slug.replace('-', ' ')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleActive}
              className={`
                p-2 rounded-lg transition-colors
                ${process.isActive 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
              title={process.isActive ? 'Deactivate' : 'Activate'}
            >
              {process.isActive ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${process.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
              }
            `}>
              {process.isActive ? 'Active' : 'Inactive'}
            </div>
            <div className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${hasContent ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}
            `}>
              {hasContent ? 'Content Added' : 'No Content'}
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {process.isActive ? 'Shows in dropdown' : 'Hidden from dropdown'}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Hero Image Preview */}
        {process.heroImage && !imageError ? (
          <div className="mb-4">
            <img
              src={process.heroImage}
              alt={`${process.name} hero image`}
              className="w-full h-32 object-cover rounded-lg"
              onError={handleImageError}
            />
          </div>
        ) : (
          <div className="mb-4">
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No image available</p>
              </div>
            </div>
          </div>
        )}

        {/* Content Preview */}
        <div className="space-y-2 mb-4">
          {process.heroTitle && (
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {process.heroTitle}
            </h4>
          )}
          {process.heroSubtitle && (
            <p className="text-xs text-gray-600 truncate">
              {process.heroSubtitle}
            </p>
          )}
          {!process.heroTitle && !process.heroSubtitle && (
            <p className="text-xs text-gray-500 italic">
              No content added yet
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={async () => {
                // Dynamically check if it's a base metal by checking the database
                try {
                  const response = await fetch('/api/admin/base-metal-settings')
                  let isBaseMetal = false
                  
                  if (response.ok) {
                    const baseMetals = await response.json()
                    isBaseMetal = baseMetals.some((metal: any) => metal.slug === process.slug)
                  }
                  
                  // Fallback to hardcoded check if API fails
                  if (!isBaseMetal) {
                    isBaseMetal = ['aluminium', 'copper', 'brass', 'stainless-steel', 'carbon-steel'].includes(process.slug)
                  }
                  
                  const url = isBaseMetal ? `/basemetals/${process.slug}` : `/processes/${process.slug}`
                  window.open(url, '_blank')
                } catch (error) {
                  logger.error('Error checking base metal status:', error)
                  // Fallback to process URL if there's an error
                  window.open(`/processes/${process.slug}`, '_blank')
                }
              }}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
          </div>
          <button
            onClick={onDelete}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  )
} 
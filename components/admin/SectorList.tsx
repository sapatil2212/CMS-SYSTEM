'use client'

import { useState } from 'react'
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  BuildingOfficeIcon,
  ClockIcon,
  HashtagIcon
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

interface SectorListProps {
  sectors: Sector[]
  onEdit: (sector: Sector) => void
  onDelete: (id: string) => void
  loading: boolean
}

export default function SectorList({ sectors, onEdit, onDelete, loading }: SectorListProps) {
  const [expandedSector, setExpandedSector] = useState<string | null>(null)

  const toggleExpanded = (id: string) => {
    setExpandedSector(expandedSector === id ? null : id)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Sectors ({sectors.length})</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 w-6 bg-gray-200 rounded"></div>
                    <div className="h-6 w-6 bg-gray-200 rounded"></div>
                    <div className="h-6 w-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (sectors.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Sectors (0)</h3>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <BuildingOfficeIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sectors found</h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first industry sector.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Sectors ({sectors.length})</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sectors.map((sector) => (
          <div key={sector.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            {/* Card Header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {sector.image ? (
                      <img 
                        className="h-12 w-12 rounded-lg object-cover border border-gray-200" 
                        src={sector.image} 
                        alt={sector.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <BuildingOfficeIcon className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {sector.name}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <HashtagIcon className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">Order: {sector.order}</span>
                    </div>
                  </div>
                </div>
                
                {/* Status Circle */}
                <div className={`h-3 w-3 rounded-full ${
                  sector.isActive ? 'bg-green-500' : 'bg-red-500'
                }`} title={sector.isActive ? 'Active' : 'Inactive'} />
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {sector.description}
              </p>

              {/* Updated Date */}
              <div className="flex items-center text-xs text-gray-500 mb-4">
                <ClockIcon className="h-3 w-3 mr-1" />
                Updated {formatDate(sector.updatedAt)}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => toggleExpanded(sector.id)}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <EyeIcon className="h-3 w-3 mr-1" />
                  {expandedSector === sector.id ? 'Hide' : 'View'} Details
                </button>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(sector)}
                    className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit sector"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(sector.id)}
                    className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete sector"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedSector === sector.id && (
              <div className="px-6 pb-6 pt-0">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <h5 className="text-xs font-medium text-gray-900 mb-2">Detailed Information</h5>
                    <p className="text-xs text-gray-600 leading-relaxed">{sector.details}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
                    <span>Created: {formatDate(sector.createdAt)}</span>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      sector.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {sector.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 
'use client'

import { useState } from 'react'
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  EyeSlashIcon,
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
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Sectors</h3>
        </div>
        <div className="p-4">
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (sectors.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Sectors</h3>
        </div>
        <div className="p-4 text-center">
          <BuildingOfficeIcon className="mx-auto h-8 w-8 text-gray-400" />
          <h3 className="mt-1 text-xs font-medium text-gray-900">No sectors found</h3>
          <p className="mt-1 text-xs text-gray-500">
            Get started by creating a new sector.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">
          Sectors ({sectors.length})
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sector
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sectors.map((sector) => (
              <>
                <tr key={sector.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        {sector.image ? (
                          <img 
                            className="h-8 w-8 rounded-md object-cover" 
                            src={sector.image} 
                            alt={sector.name}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-md bg-gray-200 flex items-center justify-center">
                            <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-xs font-medium text-gray-900">
                          {sector.name}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {sector.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                      sector.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {sector.isActive ? (
                        <>
                          <EyeIcon className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeSlashIcon className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900">
                    {sector.order}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                    {formatDate(sector.updatedAt)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-xs font-medium">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => toggleExpanded(sector.id)}
                        className="text-gray-400 hover:text-gray-600"
                        title="View details"
                      >
                        <EyeIcon className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => onEdit(sector)}
                        className="text-primary-600 hover:text-primary-900"
                        title="Edit sector"
                      >
                        <PencilIcon className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => onDelete(sector.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete sector"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Details */}
                {expandedSector === sector.id && (
                  <tr>
                    <td colSpan={5} className="px-4 py-3 bg-gray-50">
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-xs font-medium text-gray-900 mb-1">Details</h4>
                          <p className="text-xs text-gray-600">{sector.details}</p>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Created: {formatDate(sector.createdAt)} | 
                          Updated: {formatDate(sector.updatedAt)}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 
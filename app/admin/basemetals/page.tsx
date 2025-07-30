'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Save, X } from 'lucide-react'
import ProcessEditModal from '@/components/admin/ProcessEditModal'

interface BaseMetalData {
  id: string
  name: string
  slug: string
  content: any
  isActive: boolean
}

const BaseMetalsPage = () => {
  const [baseMetals, setBaseMetals] = useState<BaseMetalData[]>([
    { id: 'aluminium', name: 'Aluminium', slug: 'aluminium', content: null, isActive: true },
    { id: 'steel', name: 'Steel', slug: 'steel', content: null, isActive: false },
    { id: 'copper', name: 'Copper', slug: 'copper', content: null, isActive: false },
    { id: 'brass', name: 'Brass', slug: 'brass', content: null, isActive: false }
  ])

  const [selectedBaseMetal, setSelectedBaseMetal] = useState<BaseMetalData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchBaseMetalsContent()
  }, [])

  const fetchBaseMetalsContent = async () => {
    setLoading(true)
    try {
      const updatedBaseMetals = await Promise.all(
        baseMetals.map(async (baseMetal) => {
          try {
            const response = await fetch(`/api/content/${baseMetal.slug}`)
            if (response.ok) {
              const content = await response.json()
              return { ...baseMetal, content }
            }
          } catch (error) {
            console.error(`Error fetching ${baseMetal.name} content:`, error)
          }
          return baseMetal
        })
      )
      setBaseMetals(updatedBaseMetals)
    } catch (error) {
      console.error('Error fetching base metals content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditBaseMetal = (baseMetal: BaseMetalData) => {
    setSelectedBaseMetal(baseMetal)
    setIsModalOpen(true)
  }

  const handleSaveBaseMetal = async (updatedContent: any) => {
    if (!selectedBaseMetal) return

    try {
      const response = await fetch(`/api/content/${selectedBaseMetal.slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedContent),
      })

      if (response.ok) {
        const savedContent = await response.json()
        
        // Update the base metals list with the saved content
        setBaseMetals(prev => 
          prev.map(baseMetal => 
            baseMetal.id === selectedBaseMetal.id 
              ? { ...baseMetal, content: savedContent }
              : baseMetal
          )
        )
        
        setIsModalOpen(false)
        setSelectedBaseMetal(null)
      } else {
        console.error('Failed to save base metal content')
      }
    } catch (error) {
      console.error('Error saving base metal content:', error)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBaseMetal(null)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Base Metals Content Management</h1>
        <p className="text-gray-600 mt-2">Manage content for all base metal pages</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {baseMetals.map((baseMetal) => (
            <Card key={baseMetal.id} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {baseMetals.map((baseMetal) => (
            <Card key={baseMetal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{baseMetal.name}</span>
                  <div className="flex items-center space-x-2">
                    {baseMetal.content ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Content Available
                      </span>
                    ) : (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        No Content
                      </span>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  {baseMetal.content 
                    ? `Last updated: ${new Date(baseMetal.content.updatedAt).toLocaleDateString()}`
                    : 'No content available yet'
                  }
                </p>
                <Button
                  onClick={() => handleEditBaseMetal(baseMetal)}
                  className="w-full"
                  variant="outline"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {baseMetal.content ? 'Edit Content' : 'Add Content'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && selectedBaseMetal && (
        <ProcessEditModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          process={selectedBaseMetal}
          onSave={handleSaveBaseMetal}
        />
      )}
    </div>
  )
}

export default BaseMetalsPage 
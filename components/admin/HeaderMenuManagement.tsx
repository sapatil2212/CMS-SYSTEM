'use client'

import { useState, useEffect } from 'react'
import { ToggleLeft, ToggleRight, ChevronDown, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react'
import ProcessActivationManagement from './ProcessActivationManagement'
import BaseMetalActivationManagement from './BaseMetalActivationManagement'
import { logger } from '@/lib/logger';

interface HeaderMenuDropdownItem {
  id: string
  name: string
  href: string
  order: number
  isActive: boolean
}

interface HeaderMenuItem {
  id: string
  name: string
  href: string
  order: number
  isActive: boolean
  hasDropdown: boolean
  dropdownItems: HeaderMenuDropdownItem[]
}

export default function HeaderMenuManagement() {
  const [menuItems, setMenuItems] = useState<HeaderMenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [activeSubSection, setActiveSubSection] = useState<'menu-items' | 'processes' | 'base-metals'>('menu-items')

  useEffect(() => {
    fetchMenuItems()
  }, [])

  useEffect(() => {
    logger.log('MenuItems state changed:', menuItems.length, 'items')
    if (menuItems.length > 0) {
      logger.log('First menu item in state:', menuItems[0])
    }
  }, [menuItems])

  useEffect(() => {
    logger.log('Active sub-section changed to:', activeSubSection)
  }, [activeSubSection])

  const fetchMenuItems = async () => {
    try {
      setLoading(true)
      logger.log('Fetching menu items from:', '/api/content/header-menu')
      
      const response = await fetch('/api/content/header-menu', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      logger.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        logger.log('Menu items fetched:', data)
        logger.log('Number of menu items:', data.length)
        logger.log('First menu item:', data[0])
        setMenuItems(data)
        logger.log('Menu items state set with:', data.length, 'items')
        
        // Show success message if items were loaded
        if (data.length > 0) {
          setMessage({ type: 'success', text: `Successfully loaded ${data.length} menu items` })
          // Clear success message after 3 seconds
          setTimeout(() => setMessage(null), 3000)
        }
      } else {
        const errorText = await response.text()
        logger.error('Failed to fetch menu items:', errorText)
        throw new Error(`Failed to fetch menu items: ${response.status} ${errorText}`)
      }
    } catch (error) {
      logger.error('Error fetching menu items:', error)
      setMessage({ type: 'error', text: `Failed to load menu items: ${error instanceof Error ? error.message : 'Unknown error'}` })
    } finally {
      setLoading(false)
    }
  }

  const createDefaultMenuItems = async () => {
    try {
      setLoading(true)
      setMessage(null)

      logger.log('Creating default menu items...')

      const response = await fetch('/api/admin/header-menu/create-default', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      logger.log('Create default response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        logger.log('Default menu items created:', result)
        setMessage({ type: 'success', text: 'Default menu items created successfully!' })
        await fetchMenuItems()
      } else {
        const errorText = await response.text()
        logger.error('Failed to create default menu items:', errorText)
        throw new Error(`Failed to create default menu items: ${response.status} ${errorText}`)
      }
    } catch (error) {
      logger.error('Error creating default menu items:', error)
      setMessage({ type: 'error', text: `Failed to create default menu items: ${error instanceof Error ? error.message : 'Unknown error'}` })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleMenuItem = async (menuItemId: string, isActive: boolean) => {
    try {
      setUpdating(menuItemId)
      setMessage(null)

      logger.log('Toggling menu item:', menuItemId, 'isActive:', isActive)

      // Try PUT method first
      let response = await fetch('/api/content/header-menu', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ menuItemId, isActive }),
      })

      // If PUT fails, try POST as fallback
      if (!response.ok) {
        logger.log('PUT failed, trying POST fallback')
        response = await fetch('/api/content/header-menu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ menuItemId, isActive }),
        })
      }

      logger.log('Response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        logger.log('Menu item updated successfully:', result)
        setMessage({ type: 'success', text: 'Menu item updated successfully!' })
        await fetchMenuItems()
      } else {
        const errorText = await response.text()
        logger.error('Failed to update menu item:', errorText)
        throw new Error(`Failed to update menu item: ${response.status} ${errorText}`)
      }
    } catch (error) {
      logger.error('Error updating menu item:', error)
      setMessage({ type: 'error', text: `Failed to update menu item: ${error instanceof Error ? error.message : 'Unknown error'}` })
    } finally {
      setUpdating(null)
    }
  }

  const handleToggleDropdownItem = async (dropdownItemId: string, isActive: boolean) => {
    try {
      setUpdating(dropdownItemId)
      setMessage(null)

      logger.log('Toggling dropdown item:', dropdownItemId, 'isActive:', isActive)

      // Try PUT method first
      let response = await fetch('/api/content/header-menu', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dropdownItemId, isActive }),
      })

      // If PUT fails, try POST as fallback
      if (!response.ok) {
        logger.log('PUT failed, trying POST fallback')
        response = await fetch('/api/content/header-menu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ dropdownItemId, isActive }),
        })
      }

      logger.log('Response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        logger.log('Dropdown item updated successfully:', result)
        setMessage({ type: 'success', text: 'Dropdown item updated successfully!' })
        await fetchMenuItems()
      } else {
        const errorText = await response.text()
        logger.error('Failed to update dropdown item:', errorText)
        throw new Error(`Failed to update dropdown item: ${response.status} ${errorText}`)
      }
    } catch (error) {
      logger.error('Error updating dropdown item:', error)
      setMessage({ type: 'error', text: `Failed to update dropdown item: ${error instanceof Error ? error.message : 'Unknown error'}` })
    } finally {
      setUpdating(null)
    }
  }

  const toggleExpanded = (menuItemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(menuItemId)) {
      newExpanded.delete(menuItemId)
    } else {
      newExpanded.add(menuItemId)
    }
    setExpandedItems(newExpanded)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading menu items...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Sub-section Toggle Menu */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-2 shadow-md">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSubSection('menu-items')}
              className={`group relative px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeSubSection === 'menu-items'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                  : 'text-green-700 hover:bg-white/80 hover:shadow-md'
              }`}
            >
              <span className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  activeSubSection === 'menu-items' ? 'bg-white' : 'bg-green-400'
                }`} />
                Menu Items
              </span>
            </button>
            
            <button
              onClick={() => setActiveSubSection('processes')}
              className={`group relative px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeSubSection === 'processes'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                  : 'text-green-700 hover:bg-white/80 hover:shadow-md'
              }`}
            >
              <span className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  activeSubSection === 'processes' ? 'bg-white' : 'bg-green-400'
                }`} />
                Process Pages
              </span>
            </button>
            
            <button
              onClick={() => setActiveSubSection('base-metals')}
              className={`group relative px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeSubSection === 'base-metals'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                  : 'text-green-700 hover:bg-white/80 hover:shadow-md'
              }`}
            >
              <span className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  activeSubSection === 'base-metals' ? 'bg-white' : 'bg-green-400'
                }`} />
                Base Metal Pages
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-3 rounded-md flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <span className="text-xs font-medium">{message.text}</span>
        </div>
      )}

      {/* Menu Items Section */}
      {activeSubSection === 'menu-items' && (
        <>
          {logger.log('Rendering menu items section, menuItems.length:', menuItems.length)}
          {menuItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Menu Items Found</h3>
                <p className="text-sm text-gray-500 mb-4">
                  No header menu items have been created yet. Click the button below to create default menu items.
                </p>
                <button
                  onClick={createDefaultMenuItems}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Default Menu Items'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="space-y-3">
                {menuItems.map((menuItem) => (
                  <div key={menuItem.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {menuItem.hasDropdown && (
                          <button
                            onClick={() => toggleExpanded(menuItem.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {expandedItems.has(menuItem.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        )}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{menuItem.name}</h3>
                          <p className="text-xs text-gray-500">{menuItem.href}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          menuItem.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {menuItem.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => handleToggleMenuItem(menuItem.id, !menuItem.isActive)}
                          disabled={updating === menuItem.id}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            menuItem.isActive ? 'bg-blue-600' : 'bg-gray-200'
                          } ${updating === menuItem.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              menuItem.isActive ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                          {updating === menuItem.id && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Dropdown Items */}
                    {menuItem.hasDropdown && expandedItems.has(menuItem.id) && (
                      <div className="mt-3 pl-6 space-y-2">
                        <div className="text-xs font-medium text-gray-700 mb-2">Dropdown Items:</div>
                        {menuItem.dropdownItems.map((dropdownItem) => (
                          <div key={dropdownItem.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                            <div>
                              <span className="text-xs text-gray-600">{dropdownItem.name}</span>
                              <span className="text-xs text-gray-400 ml-2">({dropdownItem.href})</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                dropdownItem.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {dropdownItem.isActive ? 'Active' : 'Inactive'}
                              </span>
                              <button
                                onClick={() => handleToggleDropdownItem(dropdownItem.id, !dropdownItem.isActive)}
                                disabled={updating === dropdownItem.id}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                  dropdownItem.isActive ? 'bg-blue-600' : 'bg-gray-200'
                                } ${updating === dropdownItem.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                <span
                                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                    dropdownItem.isActive ? 'translate-x-5' : 'translate-x-0.5'
                                  }`}
                                />
                                {updating === dropdownItem.id && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-white"></div>
                                  </div>
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-xs font-medium text-blue-900 mb-1">Menu Management Instructions</h4>
            <ul className="text-xs text-blue-800 space-y-0.5">
              <li>• Toggle menu items on/off to show/hide them on the frontend</li>
              <li>• Click the chevron icon to expand dropdown items</li>
              <li>• Toggle individual dropdown items to control their visibility</li>
              <li>• Deactivated items will be completely hidden from the header navigation</li>
              <li>• Changes are applied immediately to the frontend</li>
            </ul>
            <div className="mt-2 p-2 bg-white rounded border border-blue-200">
              <p className="text-xs text-blue-700 font-medium">Current Menu Summary:</p>
              <p className="text-xs text-blue-600">• {menuItems.filter(item => item.isActive).length} active menu items</p>
              <p className="text-xs text-blue-600">• {menuItems.filter(item => !item.isActive).length} inactive menu items</p>
              <p className="text-xs text-blue-600">• Total dropdown items: {menuItems.reduce((sum, item) => sum + item.dropdownItems.length, 0)}</p>
            </div>
          </div>
        </>
      )}

      {/* Process Pages Section */}
      {activeSubSection === 'processes' && (
        <ProcessActivationManagement />
      )}

      {/* Base Metal Pages Section */}
      {activeSubSection === 'base-metals' && (
        <div>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-1">Base Metal Pages Management</h3>
            <p className="text-xs text-blue-800">
              This section allows you to activate or deactivate individual base metal pages in the header menu. 
              Deactivated pages will be hidden from the navigation.
            </p>
          </div>
          <BaseMetalActivationManagement />
        </div>
      )}
    </div>
  )
} 
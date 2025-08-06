'use client'

import { logger } from '@/lib/logger';
import {  useState, useEffect  } from 'react';

export default function TestBaseMetals() {
  const [baseMetals, setBaseMetals] = useState([])
  const [headerMenu, setHeaderMenu] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch base metal settings
      const settingsResponse = await fetch('/api/admin/base-metal-settings')
      const settings = await settingsResponse.json()
      logger.log('Base metal settings:', settings)

      // Fetch header menu
      const menuResponse = await fetch('/api/content/header-menu')
      const menu = await menuResponse.json()
      logger.log('Header menu:', menu)

      setBaseMetals(settings)
      setHeaderMenu(menu)
    } catch (error) {
      logger.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Base Metals Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Base Metal Settings</h2>
          <div className="space-y-2">
            {baseMetals.map((metal: any) => (
              <div key={metal.id} className="p-2 bg-gray-50 rounded">
                <p><strong>Name:</strong> {metal.name}</p>
                <p><strong>Slug:</strong> {metal.slug}</p>
                <p><strong>Active:</strong> {metal.isActive ? 'Yes' : 'No'}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Header Menu</h2>
          <div className="space-y-2">
            {headerMenu.map((item: any) => (
              <div key={item.id} className="p-2 bg-gray-50 rounded">
                <p><strong>Name:</strong> {item.name}</p>
                <p><strong>Active:</strong> {item.isActive ? 'Yes' : 'No'}</p>
                <p><strong>Has Dropdown:</strong> {item.hasDropdown ? 'Yes' : 'No'}</p>
                {item.dropdownItems && item.dropdownItems.length > 0 && (
                  <div className="ml-4 mt-2">
                    <p className="font-medium">Dropdown Items:</p>
                    {item.dropdownItems.map((dropdown: any) => (
                      <div key={dropdown.id} className="ml-2 text-sm">
                        <p>- {dropdown.name} ({dropdown.isActive ? 'Active' : 'Inactive'})</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-provider'
import { Menu, X, Phone, ChevronDown, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BaseMetal {
  slug: string
  name: string
  href: string
  isActive: boolean
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [activeBaseMetals, setActiveBaseMetals] = useState<BaseMetal[]>([])
  const [loadingBaseMetals, setLoadingBaseMetals] = useState(true)
  const [headerSettings, setHeaderSettings] = useState<{
    logoUrl?: string
    logoAlt?: string
    phoneNumber?: string
    email?: string
  } | null>(null)
  const [menuItems, setMenuItems] = useState<Array<{
    id: string
    name: string
    href: string
    order: number
    isActive: boolean
    hasDropdown: boolean
    dropdownItems: Array<{
      id: string
      name: string
      href: string
      order: number
      isActive: boolean
    }>
  }>>([])
  const [menuActiveProcesses, setMenuActiveProcesses] = useState<Array<{
    id: string
    name: string
    slug: string
    href: string
    isMenuActive: boolean
  }>>([])
  const [menuActiveBaseMetals, setMenuActiveBaseMetals] = useState<Array<{
    id: string
    name: string
    slug: string
    href: string
    isMenuActive: boolean
  }>>([])
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    fetchActiveBaseMetals()
    fetchHeaderSettings()
    fetchMenuItems()
    fetchMenuActiveProcesses()
    fetchMenuActiveBaseMetals()
  }, [])

  const fetchHeaderSettings = async () => {
    try {
      const response = await fetch('/api/content/header')
      if (response.ok) {
        const data = await response.json()
        setHeaderSettings(data)
      }
    } catch (error) {
      console.error('Error fetching header settings:', error)
    }
  }

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/content/header-menu')
      if (response.ok) {
        const data = await response.json()
        setMenuItems(data)
      }
    } catch (error) {
      console.error('Error fetching menu items:', error)
    }
  }

  const fetchMenuActiveProcesses = async () => {
    try {
      const response = await fetch('/api/content/process-activation')
      if (response.ok) {
        const data = await response.json()
        setMenuActiveProcesses(data)
      }
    } catch (error) {
      console.error('Error fetching menu active processes:', error)
    }
  }

  const fetchMenuActiveBaseMetals = async () => {
    try {
      const response = await fetch('/api/content/base-metal-activation')
      if (response.ok) {
        const data = await response.json()
        setMenuActiveBaseMetals(data)
      }
    } catch (error) {
      console.error('Error fetching menu active base metals:', error)
    }
  }

  const fetchActiveBaseMetals = async () => {
    try {
      const response = await fetch('/api/content/active-base-metals')
      if (response.ok) {
        const data = await response.json()
        setActiveBaseMetals(data)
      } else {
        // Fallback to default base metals if API fails
        setActiveBaseMetals([
          { slug: 'aluminium', name: 'Aluminium', href: '/basemetals/aluminium', isActive: true },
          { slug: 'copper', name: 'Copper', href: '/basemetals/copper', isActive: true },
          { slug: 'stainless-steel', name: 'Stainless Steel', href: '/basemetals/stainless-steel', isActive: true },
          { slug: 'carbon-steel', name: 'Carbon Steel', href: '/basemetals/carbon-steel', isActive: true },
          { slug: 'brass', name: 'Brass', href: '/basemetals/brass', isActive: true }
        ])
      }
    } catch (error) {
      console.error('Error fetching active base metals:', error)
      // Fallback to default base metals
      setActiveBaseMetals([
        { slug: 'aluminium', name: 'Aluminium', href: '/basemetals/aluminium', isActive: true },
        { slug: 'copper', name: 'Copper', href: '/basemetals/copper', isActive: true },
        { slug: 'stainless-steel', name: 'Stainless Steel', href: '/basemetals/stainless-steel', isActive: true },
        { slug: 'carbon-steel', name: 'Carbon Steel', href: '/basemetals/carbon-steel', isActive: true },
        { slug: 'brass', name: 'Brass', href: '/basemetals/brass', isActive: true }
      ])
    } finally {
      setLoadingBaseMetals(false)
    }
  }

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  // Helper function to get first name from full name
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0]
  }

  // Default menu items to show when database is empty
  const defaultMenuItems = [
    {
      name: 'Home',
      href: '/',
      dropdown: false,
      items: []
    },
    {
      name: 'About',
      href: '/about',
      dropdown: false,
      items: []
    },
    {
      name: 'Processes',
      href: '#',
      dropdown: true,
      items: [
        { name: 'Silver Plating', href: '/processes/silver-plating' },
        { name: 'Busbar Plating', href: '/processes/busbar-plating' },
        { name: 'Zinc Plating & Colour Passivates', href: '/processes/zinc-plating' },
        { name: 'Gold Plating', href: '/processes/gold-plating' },
        { name: 'Copper Plating', href: '/processes/copper-plating' },
        { name: 'Nickel Plating', href: '/processes/nickel-plating' },
        { name: 'Electroless Nickel Plating', href: '/processes/electroless-nickel-plating' },
        { name: 'Bright Tin Plating', href: '/processes/bright-tin-plating' },
        { name: 'Dull Tin Plating', href: '/processes/dull-tin-plating' },
        { name: 'Rack & Barrel Plating', href: '/processes/rack-barrel-plating' },
        { name: 'Zinc Flake Coating', href: '/processes/zinc-flake-coating' },
        { name: 'Molykote', href: '/processes/molykote' }
      ]
    },
    {
      name: 'Base Metals',
      href: '#',
      dropdown: true,
      items: [
        { name: 'Aluminium', href: '/basemetals/aluminium' },
        { name: 'Copper', href: '/basemetals/copper' },
        { name: 'Stainless Steel', href: '/basemetals/stainless-steel' },
        { name: 'Carbon Steel', href: '/basemetals/carbon-steel' },
        { name: 'Brass', href: '/basemetals/brass' }
      ]
    },
    {
      name: 'Sectors',
      href: '#',
      dropdown: true,
      items: [
        { name: 'Sectors Overview', href: '/sectors' }
      ]
    },
    {
      name: 'Quality Testing',
      href: '/quality-testing',
      dropdown: false,
      items: []
    },
    {
      name: 'Contact',
      href: '/contact',
      dropdown: false,
      items: []
    }
  ]

  // Use database menu items if available, otherwise use defaults
  const navigation = menuItems.length > 0 
    ? menuItems
        .filter(item => item.isActive)
        .map(item => {
      // For Processes dropdown, filter based on menuActiveProcesses
      if (item.name === 'Processes' && item.hasDropdown) {
        const activeProcessItems = menuActiveProcesses
          .filter(process => process.isMenuActive)
          .map(process => ({
            name: process.name,
            href: process.href
          }))
        
        return {
          name: item.name,
          href: item.href,
          dropdown: item.hasDropdown,
          items: activeProcessItems
        }
      }
      
      // For Base Metals dropdown, filter based on menuActiveBaseMetals
      if (item.name === 'Base Metals' && item.hasDropdown) {
        const activeBaseMetalItems = menuActiveBaseMetals
          .filter(baseMetal => baseMetal.isMenuActive)
          .map(baseMetal => ({
            name: baseMetal.name,
            href: baseMetal.href
          }))
        
        return {
          name: item.name,
          href: item.href,
          dropdown: item.hasDropdown,
          items: activeBaseMetalItems
        }
      }
      
      // For other items, use the original logic
      return {
        name: item.name,
        href: item.href,
        dropdown: item.hasDropdown,
        items: item.hasDropdown ? item.dropdownItems
          .filter(dropdownItem => dropdownItem.isActive)
          .map(dropdownItem => ({
            name: dropdownItem.name,
            href: dropdownItem.href
          })) : []
      }
    })
    : defaultMenuItems

  const headerVariants = {
    scrolled: {
      backgroundColor: 'rgba(249, 250, 251, 0.9)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
    },
    normal: {
      backgroundColor: 'rgba(249, 250, 251, 1)',
      backdropFilter: 'blur(0px)',
      boxShadow: '0 0px 0px 0 rgba(0, 0, 0, 0)'
    }
  }

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  }

  const mobileMenuVariants = {
    open: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  }

  return (
    <motion.header
      initial="normal"
      animate={isScrolled ? "scrolled" : "normal"}
      variants={headerVariants}
      className="sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center">
              <img 
                src={headerSettings?.logoUrl || "/logo/logo.svg"} 
                alt={headerSettings?.logoAlt || "CMS System Logo"} 
                className="h-10 w-auto hidden sm:block" 
                onError={(e) => {
                  // Fallback to text if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <img 
                src={headerSettings?.logoUrl || "/logo/logo.svg"} 
                alt={headerSettings?.logoAlt || "CMS System Logo"} 
                className="h-8 w-auto sm:hidden" 
                onError={(e) => {
                  // Fallback to text if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
             
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navigation.map((item, i) => (
              <motion.div
                key={item.name}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
                className="relative"
                onMouseEnter={() => item.dropdown && setOpenDropdown(item.name)}
                onMouseLeave={() => item.dropdown && setOpenDropdown(null)}
              >
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className="flex items-center text-sm font-medium transition-colors duration-200 hover:text-blue-700 text-gray-700"
                    >
                      {item.name}
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                        openDropdown === item.name ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    <AnimatePresence>
                      {openDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                        >
                          <div className="py-1">
                            {item.items.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={item.href || '#'}
                    className="text-sm font-medium transition-colors duration-200 hover:text-blue-700 text-gray-700"
                  >
                    {item.name}
                  </Link>
                )}
              </motion.div>
            ))}

            {/* Phone Number Button */}
            <motion.a
              href={`tel:${headerSettings?.phoneNumber || '+919373102887'}`}
              className="relative overflow-hidden px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-900 rounded-full font-medium text-white text-sm tracking-wide flex items-center gap-2"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Phone className="h-4 w-4" />
              <span className="font-medium">{headerSettings?.phoneNumber || '+91 93731 02887'}</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.a>

            {/* Auth Section */}
            {user && (
              <>
                {/* Vertical Divider */}
                <div className="w-px h-6 bg-gray-300 mx-4"></div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">Hi, {getFirstName(user.name)}</span>
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-gray-900"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden rounded-xl bg-white border mx-2 mt-2 p-5 mb-5"
            >
              <motion.nav 
                className="flex flex-col space-y-4 py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.dropdown ? (
                      <div className="flex flex-col">
                        <button
                          onClick={() => toggleDropdown(item.name)}
                          className="flex items-center justify-between text-base font-medium text-gray-700 hover:text-blue-700"
                        >
                          {item.name}
                          <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                            openDropdown === item.name ? 'rotate-180' : ''
                          }`} />
                        </button>
                        
                        <AnimatePresence>
                          {openDropdown === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pl-4 mt-2 space-y-2"
                            >
                              {item.items.map((child) => (
                                <Link
                                  key={child.name}
                                  href={child.href}
                                  onClick={() => {
                                    setIsMenuOpen(false)
                                    setOpenDropdown(null)
                                  }}
                                  className="block text-sm text-gray-600 hover:text-blue-700"
                                >
                                  {child.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <motion.div
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          href={item.href || '#'}
                          onClick={() => setIsMenuOpen(false)}
                          className="text-base font-medium transition-colors duration-200 hover:text-blue-700 text-gray-700"
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    )}
                  </div>
                ))}

                {/* Mobile Auth Section */}
                {user && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-700 mb-2">Hi, {getFirstName(user.name)}</div>
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium block mb-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                )}
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
} 
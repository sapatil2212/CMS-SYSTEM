'use client'

import { Fragment, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  HomeIcon,
  InformationCircleIcon,
  CogIcon,
  UserGroupIcon,
  ChartBarIcon,
  CubeIcon,
  DocumentTextIcon,
  PhotoIcon,
  PresentationChartLineIcon,
  QuestionMarkCircleIcon,
  MegaphoneIcon,
  EnvelopeIcon,
  Bars3Icon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Home Content', href: '/admin/home', icon: HomeIcon },
  { name: 'About Us Content', href: '/admin/about', icon: InformationCircleIcon },
  { name: 'Process Content', href: '/admin/process', icon: CogIcon },
  { name: 'Base Metals Content', href: '/admin/basemetals', icon: CubeIcon },
  { name: 'Header Content', href: '/admin/header', icon: DocumentTextIcon },
  { name: 'Footer Content', href: '/admin/footer', icon: PhotoIcon },
  { name: 'Contact Content', href: '/admin/contact-content', icon: EnvelopeIcon },
  { name: 'Offer Popup', href: '/admin/offer-popup', icon: MegaphoneIcon },
  { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
  { name: 'Contact Submissions', href: '/admin/contact-submissions', icon: ChatBubbleLeftRightIcon },
  { name: 'Profile', href: '/admin/profile', icon: UserGroupIcon },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon },
]

interface AdminSidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function AdminSidebar({ open, setOpen }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [headerSettings, setHeaderSettings] = useState<{
    logoUrl?: string
    logoAlt?: string
  } | null>(null)



  useEffect(() => {
    fetchHeaderSettings()
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

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    {headerSettings?.logoUrl ? (
                      <>
                        <img 
                          src={headerSettings.logoUrl} 
                          alt={headerSettings.logoAlt || "CMS System Logo"} 
                          className="h-8 w-auto" 
                          onError={(e) => {
                            // Fallback to text if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="hidden text-2xl font-bold text-primary-600 items-center">
                          {headerSettings.logoAlt || "CMS"}
                        </div>
                      </>
                    ) : (
                      <>
                        <img 
                          src="/logo/logo.svg" 
                          alt="CMS System Logo" 
                          className="h-10 w-auto" 
                          onError={(e) => {
                            // Fallback to text if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="hidden text-2xl font-bold text-primary-600 items-center">
                          CMS
                        </div>
                      </>
                    )}
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <button
                                onClick={() => {
                                  console.log('Mobile sidebar link clicked:', item.href)
                                  router.push(item.href)
                                  setOpen(false)
                                }}
                                className={`
                                  group flex gap-x-2 rounded-md p-1.5 text-xs leading-5 font-medium w-full text-left
                                  ${pathname === item.href
                                    ? 'bg-primary-50 text-primary-600'
                                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                                  }
                                `}
                              >
                                <item.icon
                                  className={`h-4 w-4 shrink-0 ${
                                    pathname === item.href ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600'
                                  }`}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>

                  {/* Help and Support Section */}
                  <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-x-2 p-1">
                      <QuestionMarkCircleIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-gray-900">Help & Support</span>
                    </div>
                    <div className="px-1 py-1 space-y-1">
                      <div className="text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Contact:</span>
                          <a href="tel:8830553868" className="text-blue-600 hover:text-blue-700">
                            8830553868
                          </a>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="font-medium">Email:</span>
                          <a href="mailto:saptechnoeditors@gmail.com" className="text-blue-600 hover:text-blue-700">
                            saptechnoeditors@gmail.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            {headerSettings?.logoUrl ? (
              <>
                <img 
                  src={headerSettings.logoUrl} 
                  alt={headerSettings.logoAlt || "CMS System Logo"} 
                  className="h-8 w-auto" 
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="hidden text-2xl font-bold text-primary-600 items-center">
                  {headerSettings.logoAlt || "CMS"}
                </div>
              </>
            ) : (
              <>
                                        <img 
                          src="/logo/logo.svg" 
                          alt="CMS System Logo" 
                          className="h-8 w-auto" 
                          onError={(e) => {
                            // Fallback to text if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                <div className="hidden text-2xl font-bold text-primary-600 items-center">
                  CMS
                </div>
              </>
            )}
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <button
                        onClick={() => {
                          console.log('Sidebar link clicked:', item.href)
                          router.push(item.href)
                        }}
                        className={`
                          group flex gap-x-2 rounded-md p-1.5 text-xs leading-5 font-medium w-full text-left
                          ${pathname === item.href
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                          }
                        `}
                      >
                        <item.icon
                          className={`h-4 w-4 shrink-0 ${
                            pathname === item.href ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>

          {/* Help and Support Section */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="flex items-center gap-x-2 p-1">
              <QuestionMarkCircleIcon className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-900">Help & Support</span>
            </div>
            <div className="px-1 py-1 space-y-1">
              <div className="text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="font-medium">Contact:</span>
                  <a href="tel:8830553868" className="text-blue-600 hover:text-blue-700">
                    8830553868
                  </a>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="font-medium">Email:</span>
                  <a href="mailto:saptechnoeditors@gmail.com" className="text-blue-600 hover:text-blue-700">
                    saptechnoeditors@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 
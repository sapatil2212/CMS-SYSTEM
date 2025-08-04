'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

interface FooterSettings {
  id: string
  logoUrl?: string
  logoAlt?: string
  description: string
  phoneNumber?: string
  email?: string
  address: string
}

interface FooterSocialMedia {
  id: string
  platform: string
  url: string
  icon: string
  isActive: boolean
  order: number
}

interface FooterQuickLink {
  id: string
  name: string
  href: string
  order: number
  isActive: boolean
}

interface FooterService {
  id: string
  name: string
  order: number
  isActive: boolean
}

const Footer: React.FC = () => {
  const [settings, setSettings] = useState<FooterSettings | null>(null)
  const [socialMedia, setSocialMedia] = useState<FooterSocialMedia[]>([])
  const [quickLinks, setQuickLinks] = useState<FooterQuickLink[]>([])
  const [services, setServices] = useState<FooterService[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFooterData()
  }, [])

  const fetchFooterData = async () => {
    try {
      setLoading(true)
      
      // Fetch all footer data in parallel
      const [settingsRes, socialRes, linksRes, servicesRes] = await Promise.all([
        fetch('/api/content/footer-settings'),
        fetch('/api/content/footer-social-media'),
        fetch('/api/content/footer-quick-links'),
        fetch('/api/content/footer-services')
      ])
      
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        setSettings(settingsData)
      }
      
      if (socialRes.ok) {
        const socialData = await socialRes.json()
        setSocialMedia(socialData.filter((item: FooterSocialMedia) => item.isActive))
      }
      
      if (linksRes.ok) {
        const linksData = await linksRes.json()
        setQuickLinks(linksData.filter((item: FooterQuickLink) => item.isActive))
      }
      
      if (servicesRes.ok) {
        const servicesData = await servicesRes.json()
        setServices(servicesData.filter((item: FooterService) => item.isActive))
      }
    } catch (error) {
      console.error('Error fetching footer data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Social media icon mapping
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
          </svg>
        )
      case 'twitter':
        return (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        )
      case 'instagram':
        return (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
          </svg>
        )
      case 'linkedin':
        return (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        )
    }
  }

  if (loading) {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="ml-2">Loading footer...</span>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src={settings?.logoUrl || "/logo/logo.png"} 
                alt="company_logo" 
                className="h-12 w-auto hidden sm:block"
              />
              <img 
                src={settings?.logoUrl || "/logo/logo.png"} 
                alt="company_logo" 
                className="h-12 w-auto sm:hidden"
              />
            </div>
            <p className="text-gray-300 text-xs lg:text-md">
              {settings?.description || 'Precision busbar plating solutions for power distribution, EVs, and industrial applications. Enhancing performance and durability through advanced metal finishing.'}
            </p>
            <div className="flex space-x-4">
              {socialMedia.map((social) => (
                <a 
                  key={social.id}
                  href={social.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity duration-200"
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our Services</h3>
            <ul className="space-y-2 text-gray-300">
              {services.map((service) => (
                <li key={service.id}>{service.name}</li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              {settings?.phoneNumber && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <a href={`tel:${settings.phoneNumber}`} className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                    {settings.phoneNumber}
                  </a>
                </div>
              )}
              {settings?.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <a href={`mailto:${settings.email}`} className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                    {settings.email}
                  </a>
                </div>
              )}
              {settings?.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-400 mt-1" />
                  <span className="text-gray-300 whitespace-pre-line">
                    {settings.address}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-[10px] lg:text-xs">
            © {new Date().getFullYear()} Alkalyne. All rights reserved. | Made with ❤️ by{' '}
            <a 
              href="https://digiworldtechnologies.com/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Digiworld Infotech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
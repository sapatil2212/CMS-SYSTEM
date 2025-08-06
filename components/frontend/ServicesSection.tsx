'use client'

import { useState, useEffect } from 'react'
import { logger } from '@/lib/logger';
import Link from 'next/link';

interface Service {
  id: string
  title: string
  description: string
  image?: string
  slug: string
}

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/content/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      logger.error('Failed to fetch services:', error)
      // Fallback services
      setServices([
        {
          id: '1',
          title: 'Web Development',
          description: 'Custom web applications built with modern technologies',
          slug: 'web-development',
        },
        {
          id: '2',
          title: 'Mobile Development',
          description: 'Native and cross-platform mobile applications',
          slug: 'mobile-development',
        },
        {
          id: '3',
          title: 'UI/UX Design',
          description: 'Beautiful and intuitive user interface design',
          slug: 'ui-ux-design',
        },
        {
          id: '4',
          title: 'Digital Marketing',
          description: 'Comprehensive digital marketing solutions',
          slug: 'digital-marketing',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We offer a comprehensive range of services to help your business grow and succeed in the digital world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div key={service.id} className="group">
              <Link href={`/services/${service.slug}`}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <div className="text-gray-500">Service Image</div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/services"
            className="btn-primary"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  )
} 
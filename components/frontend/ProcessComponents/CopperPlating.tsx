'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { logger } from '@/lib/logger';
import {  ChevronRight, Check, Zap, Layers, Activity, Cpu, CircuitBoard, TestTube2, Wrench, Plane, HardHat, Anchor  } from 'lucide-react';

const CopperPlating = () => {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now())

  useEffect(() => {
    fetchContent()
  }, [lastUpdate])

  const fetchContent = async () => {
    try {
      // Add cache-busting parameter to force fresh data
      const response = await fetch(`/api/content/copper-plating?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setContent(data)
      } else {
        // If no content exists, use default content
        setContent(getDefaultContent())
      }
    } catch (error) {
      logger.error('Error fetching content:', error)
      setContent(getDefaultContent())
    } finally {
      setLoading(false)
    }
  }

  // Force refresh function that can be called externally
  const forceRefresh = () => {
    logger.log('CopperPlating: Force refresh triggered')
    setLastUpdate(Date.now())
  }

  // Expose the refresh function globally for admin updates
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).refreshCopperPlating = forceRefresh
      logger.log('CopperPlating: Refresh function exposed globally')
    }
  }, [])

  const getDefaultContent = () => ({
    heroTitle: "Premium Copper Plating Services in India",
    heroSubtitle: "Precision Electroplating Solutions",
    heroDescription: "Superior Conductivity • Mirror-Smooth Finish • Ideal for Multilayer Plating",
    heroImage: "/uploads/copper-plating/hero.jpg",
    whatIsTitle: "What is Copper Plating?",
    whatIsDescription: "Copper electroplating deposits a uniform metallic copper layer onto substrates through electrochemical deposition. Valued for its exceptional electrical/thermal conductivity and as an ideal base for subsequent platings, copper enhances both functionality and longevity.",
    whatIsImage: "/uploads/copper-plating/what-is.jpg",
    whatIsBestFor: "High-frequency electronics\nMultilayer plating base\nEMI/RFI shielding",
    whatIsMaterials: "Steel (with barrier layer)\nBrass & copper alloys\nAluminum (special process)",
    benefitsTitle: "Key Advantages",
    benefitsSubtitle: "Why leading manufacturers choose copper plating for critical applications",
    processTitle: "Our Copper Plating Process",
    processSubtitle: "Precision-controlled deposition for consistent quality",
    applicationsTitle: "Copper Plating Applications",
    applicationsSubtitle: "Critical for industries requiring optimal electrical performance and reliable plating foundations",
    qualityTitle: "Quality Commitment",
    qualityDescription: "Alkalyne maintains rigorous quality standards for every copper-plated component",
    ctaTitle: "Need Precision Copper Plating?",
    ctaDescription: "From prototype batches to high-volume production, we deliver copper plating that meets exacting standards",
    benefits: [
      { icon: "Zap", title: "Superior Conductivity", description: "Second only to silver in electrical conductivity" },
      { icon: "Layers", title: "Perfect Base Layer", description: "Ideal for multilayer plating (nickel, gold, tin)" },
      { icon: "Activity", title: "Thermal Management", description: "Excellent heat dissipation properties" },
      { icon: "Check", title: "Smooth Finish", description: "Uniform deposition for precision components" },
      { icon: "CircuitBoard", title: "PCB Performance", description: "Essential for high-frequency circuits" },
      { icon: "TestTube2", title: "Corrosion Resistance", description: "When paired with protective top layers" }
    ],
    processSteps: [
      { step: "1", title: "Surface Preparation", description: "Degreasing, acid pickling, and activation", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
      { step: "2", title: "Electrolyte Bath", description: "Immersion in copper sulfate or cyanide solution", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" },
      { step: "3", title: "Current Application", description: "Precise DC current deposits copper layer", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
      { step: "4", title: "Post-Treatment", description: "Rinsing, passivation, or additional plating", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" }
    ],
    applications: [
      { title: "Electronics & PCBs", image: "/uploads/copper-plating/electronics.jpg", items: ["Circuit boards", "Connectors", "RF shields", "Busbars"] },
      { title: "Automotive Components", image: "/uploads/copper-plating/automotive.jpg", items: ["Battery terminals", "Sensors", "Switchgear", "Ground straps"] },
      { title: "Industrial Equipment", image: "/uploads/copper-plating/industrial.jpg", items: ["Heat exchangers", "Waveguides", "Tooling", "Decorative trim"] }
    ],

    qualityChecks: [
      { title: "Thickness Verification", description: "X-ray fluorescence (XRF) and micrometer testing" },
      { title: "Conductivity Testing", description: "Four-point probe resistivity measurements" },
      { title: "Adhesion Testing", description: "ASTM B571 bend and tape tests" },
      { title: "Surface Inspection", description: "Microscopic examination for pits/nodules" }
    ]
  })

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Zap, Layers, Activity, Check, CircuitBoard, TestTube2, Cpu, Wrench, Plane, HardHat, Anchor
    }
    return iconMap[iconName] || Check
  }

  const parseJsonSafely = (data: any): any[] => {
    try {
      // Handle null, undefined, or empty string
      if (!data || data === '') {
        return [];
      }
      
      // If it's already an array, return it
      if (Array.isArray(data)) {
        return data;
      }
      
      // If it's a string, try to parse it
      if (typeof data === 'string') {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      }
      
      // For any other type, return empty array
      return [];
    } catch (error) {
      logger.error('Error parsing JSON data:', error, 'Data:', data);
      return [];
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!content) {
    return <div>Error loading content</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="mb-20 bg-gradient-to-br from-black to-black rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
        <div className="absolute inset-0">
          <img 
            src={content.heroImage} 
            alt="Copper plating process" 
            className="w-full h-full object-cover opacity-30"
            loading="eager"
          />
        </div>
        <div className="relative z-10 max-w-4xl">
          <span className="inline-block bg-blue-500/20 text-blue-300 text-sm font-medium px-3 py-1 rounded-full mb-6">
            {content.heroSubtitle}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {content.heroTitle}
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            {content.heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg"
            >
              Request a Quote <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* What is Copper Plating */}
      <section className="mb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{content.whatIsTitle}</h2>
            <p className="text-lg text-gray-600 mb-6">
              {content.whatIsDescription}
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-blue-800 font-medium">
                {content.whatIsAlkalineOffers || 'Alkalyne offers both acid copper (for bright finishes) and cyanide copper (for steel/zinc adhesion) plating processes.'}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Best For:</h4>
                <ul className="space-y-2">
                  {(content.whatIsBestFor || '').split('\n').map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Materials:</h4>
                <ul className="space-y-2">
                  {(content.whatIsMaterials || '').split('\n').map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
            <div className="mb-4 rounded-lg overflow-hidden">
              <img 
                src={content.whatIsImage} 
                alt="Copper plating example"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mb-20 bg-gray-50 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.benefitsTitle}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {content.benefitsSubtitle}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(content.benefits || []).map((item: any, index: number) => {
            const IconComponent = getIconComponent(item.icon)
            return (
              <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 group">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors duration-300">
                  <IconComponent className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Process Section */}
      <section className="mb-20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.processTitle}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {content.processSubtitle}
          </p>
        </div>

        <div className="relative px-6 md:px-20">
          {/* Dotted Line (only on desktop) */}
          <div className="hidden md:block absolute top-[44px] left-0 right-0 h-0.5 border-t-2 border-dotted border-blue-300 z-0"></div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            {(content.processSteps || []).map((step: any, index: number) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                {/* Dot for desktop */}
                <div className="hidden md:block w-5 h-5 bg-blue-600 rounded-full border-4 border-white absolute top-[34px] left-1/2 transform -translate-x-1/2 z-10"></div>

                {/* Card */}
                <div className="mt-0 md:mt-16 bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 w-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 mx-auto">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                    </svg>
                  </div>
                  <div className="flex justify-center items-center mb-2 space-x-2">
                    <span className="text-blue-600 font-bold text-lg">{step.step}</span>
                    <h4 className="font-semibold text-gray-900">{step.title}</h4>
                  </div>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.applicationsTitle}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {content.applicationsSubtitle}
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {(content.applications || []).map((app: any, index: number) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200">
              <div className="h-48 overflow-hidden">
                <img 
                  src={app.image} 
                  alt={app.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 text-lg mb-3">{app.title}</h3>
                {app.description && (
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{app.description}</p>
                )}
                <ul className="space-y-2">
                  {parseJsonSafely(app.items).map((item: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="mb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{content.qualityTitle}</h2>
            <p className="text-lg text-gray-600 mb-8">
              {content.qualityDescription}
            </p>
            
            <div className="space-y-6">
              {(content.qualityChecks || []).map((check: any, index: number) => (
                <div key={index} className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4 flex-shrink-0">
                    <Check className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{check.title}</h4>
                    <p className="text-gray-600">{check.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
              <img 
                src={content.qualityImage || "/uploads/copper-plating/quality-inspection.jpg"} 
                alt="Quality inspection process"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-orange-600 rounded-3xl p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-1/4 translate-y-1/4"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{content.ctaTitle}</h2>
          <p className="text-blue-100 text-xl mb-8">
            {content.ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all duration-300 hover:shadow-lg"
            >
              Get a Free Consultation <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CopperPlating 
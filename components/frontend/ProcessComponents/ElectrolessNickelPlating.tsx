'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Check, Zap, Layers, Activity, Cpu, CircuitBoard, TestTube2, Wrench, Plane, HardHat, Anchor, Shield, Award } from 'lucide-react'

const ElectrolessNickelPlating = () => {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content/electroless-nickel-plating')
      if (response.ok) {
        const data = await response.json()
        setContent(data)
      } else {
        setContent(getDefaultContent())
      }
    } catch (error) {
      console.error('Error fetching content:', error)
      setContent(getDefaultContent())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultContent = () => ({
    heroTitle: "Premium Electroless Nickel Plating Services",
    heroSubtitle: "Advanced Chemical Deposition Technology",
    heroDescription: "Professional electroless nickel plating providing uniform coating thickness, superior corrosion resistance, and exceptional wear properties without electrical current requirements.",
    heroImage: "/uploads/electroless-nickel-plating/hero.jpg",
    whatIsTitle: "What is Electroless Nickel Plating?",
    whatIsDescription: "Electroless nickel plating is a chemical reduction process that deposits nickel-phosphorus or nickel-boron alloys onto substrates without using electrical current. This auto-catalytic process provides uniform coating thickness even on complex geometries and internal surfaces.",
    whatIsImage: "/uploads/electroless-nickel-plating/what-is.jpg",
    whatIsBestFor: "Complex geometries\nInternal surfaces\nPrecision components\nWear-resistant parts\nCorrosion protection",
    whatIsMaterials: "Steel and iron\nAluminum alloys\nCopper and brass\nStainless steel\nPlastic substrates",
    whatIsAlkalineOffers: "Alkalyne offers medium and high phosphorus electroless nickel plating with optional heat treatment for enhanced hardness and wear resistance.",
    benefitsTitle: "Key Advantages",
    benefitsSubtitle: "Why leading manufacturers choose electroless nickel for critical applications",
    processTitle: "Our Electroless Nickel Process",
    processSubtitle: "Chemical deposition for uniform coating thickness",
    applicationsTitle: "Electroless Nickel Applications",
    applicationsSubtitle: "Critical for industries requiring precision and reliability",
    qualityTitle: "Quality Commitment",
    qualityDescription: "Alkalyne maintains rigorous quality standards for every electroless nickel-plated component",
    ctaTitle: "Need Precision Electroless Nickel?",
    ctaDescription: "From prototype batches to high-volume production, we deliver electroless nickel plating that meets exacting standards",
    benefits: [
      { icon: "Shield", title: "Uniform Thickness", description: "Even coating on complex shapes and internal surfaces" },
      { icon: "Award", title: "Superior Hardness", description: "Excellent wear and abrasion resistance properties" },
      { icon: "Activity", title: "Corrosion Protection", description: "Outstanding resistance to corrosive environments" },
      { icon: "Layers", title: "No Current Required", description: "Chemical process independent of part geometry" },
      { icon: "TestTube2", title: "Precise Control", description: "Accurate thickness control and repeatability" },
      { icon: "Check", title: "Versatile Process", description: "Works on various substrates and complex parts" }
    ],
    processSteps: [
      { step: "1", title: "Surface Preparation", description: "Cleaning, etching, and activation", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
      { step: "2", title: "Chemical Deposition", description: "Auto-catalytic nickel reduction process", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" },
      { step: "3", title: "Heat Treatment", description: "Optional hardening for enhanced properties", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
      { step: "4", title: "Final Processing", description: "Quality control and finishing", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" }
    ],
    applications: [
      { title: "Precision Components", image: "/uploads/electroless-nickel-plating/precision.jpg", items: ["Valves", "Pumps", "Measuring instruments", "Optical components"] },
      { title: "Automotive Parts", image: "/uploads/electroless-nickel-plating/automotive.jpg", items: ["Engine components", "Fuel system parts", "Transmission components", "Brake parts"] },
      { title: "Industrial Equipment", image: "/uploads/electroless-nickel-plating/industrial.jpg", items: ["Chemical processing", "Oil and gas", "Food processing", "Medical devices"] }
    ],
    industries: [
      { name: "Automotive", icon: "Wrench", examples: ["Engine components", "Fuel systems", "Transmission parts"], image: "/uploads/electroless-nickel-plating/automotive-industry.jpg" },
      { name: "Aerospace", icon: "Plane", examples: ["Precision components", "Landing gear", "Engine parts"], image: "/uploads/electroless-nickel-plating/aerospace-industry.jpg" },
      { name: "Industrial", icon: "Cpu", examples: ["Chemical processing", "Oil and gas", "Medical devices"], image: "/uploads/electroless-nickel-plating/industrial-industry.jpg" }
    ],
    qualityChecks: [
      { title: "Thickness Testing", description: "X-ray fluorescence and cross-section analysis" },
      { title: "Hardness Testing", description: "Microhardness and wear resistance evaluation" },
      { title: "Adhesion Testing", description: "ASTM B733 bend and thermal shock tests" },
      { title: "Corrosion Testing", description: "Salt spray and chemical resistance testing" }
    ]
  })

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Zap, Layers, Activity, Check, CircuitBoard, TestTube2, Cpu, Wrench, Plane, HardHat, Anchor, Shield, Award
    }
    return iconMap[iconName] || Check
  }

  const parseJsonSafely = (data: any): any[] => {
    try {
      if (!data || data === '') return [];
      if (Array.isArray(data)) return data;
      if (typeof data === 'string') return JSON.parse(data);
      return [];
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return [];
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Electroless Nickel Plating content...</p>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Content not available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-blue-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {content.heroTitle}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {content.heroSubtitle}
              </p>
              <p className="text-lg text-gray-700 mb-8">
                {content.heroDescription}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Quote
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="relative">
              <img
                src={content.heroImage}
                alt="Electroless Nickel Plating Process"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What Is Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {content.whatIsTitle}
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                {content.whatIsDescription}
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
                <p className="text-gray-800 font-medium">
                  {content.whatIsAlkalineOffers}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Best For:</h3>
                  <ul className="space-y-2">
                    {content.whatIsBestFor.split('\n').map((item: string, index: number) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <Check className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Materials:</h3>
                  <ul className="space-y-2">
                    {content.whatIsMaterials.split('\n').map((item: string, index: number) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <Check className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <img
                src={content.whatIsImage}
                alt="Electroless Nickel Plating Process"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {content.benefitsTitle}
            </h2>
            <p className="text-xl text-gray-600">
              {content.benefitsSubtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.benefits.map((benefit: any, index: number) => {
              const IconComponent = getIconComponent(benefit.icon)
              return (
                <div key={index} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Steps Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {content.processTitle}
            </h2>
            <p className="text-xl text-gray-600">
              {content.processSubtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.processSteps.map((step: any, index: number) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {content.applicationsTitle}
            </h2>
            <p className="text-xl text-gray-600">
              {content.applicationsSubtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.applications.map((app: any, index: number) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img
                  src={app.image}
                  alt={app.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-3">{app.title}</h3>
                  {app.description && (
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{app.description}</p>
                  )}
                  <ul className="space-y-2">
                    {parseJsonSafely(app.items).map((item: string, itemIndex: number) => (
                      <li key={itemIndex} className="flex items-center text-gray-700">
                        <Check className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Industries We Serve
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by leading manufacturers across diverse sectors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.industries.map((industry: any, index: number) => {
              const IconComponent = getIconComponent(industry.icon)
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg mr-4">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {industry.name}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {parseJsonSafely(industry.examples).map((example: string, exampleIndex: number) => (
                      <li key={exampleIndex} className="text-gray-700">
                        • {example}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quality Assurance Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {content.qualityTitle}
            </h2>
            <p className="text-xl text-gray-600">
              {content.qualityDescription}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.qualityChecks.map((check: any, index: number) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {check.title}
                </h3>
                <p className="text-gray-600">
                  {check.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {content.ctaTitle}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {content.ctaDescription}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get Started Today
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default ElectrolessNickelPlating 
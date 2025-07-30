'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Check, Zap, Layers, Activity, Cpu, CircuitBoard, TestTube2, Wrench, Plane, HardHat, Anchor, Shield, Award } from 'lucide-react'

const ZincPlating = () => {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content/zinc-plating')
      if (response.ok) {
        const data = await response.json()
        setContent(data)
      } else {
        // If no content exists, use default content
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
    heroTitle: "Premium Zinc Plating & Colour Passivates Services",
    heroSubtitle: "Corrosion Protection with Aesthetic Appeal",
    heroDescription: "Advanced zinc plating with colour passivation treatments providing superior corrosion resistance and attractive finishes for steel components.",
    heroImage: "/uploads/zinc-plating/hero.jpg",
    whatIsTitle: "What is Zinc Plating & Colour Passivates?",
    whatIsDescription: "Zinc plating deposits a protective zinc layer on steel and iron components through electrochemical processes. Combined with colour passivation treatments, it provides enhanced corrosion resistance while offering attractive color finishes including yellow, black, blue, and clear chromate conversions.",
    whatIsImage: "/uploads/zinc-plating/what-is.jpg",
    whatIsBestFor: "Steel fasteners\nAutomotive components\nHardware items\nIndustrial equipment\nDecorative applications",
    whatIsMaterials: "Carbon steel\nLow alloy steel\nCast iron\nMalleable iron\nPowdered metal parts",
    whatIsAlkalineOffers: "Alkalyne offers comprehensive zinc plating services including alkaline, acid, and chloride zinc systems with full range of colour passivation treatments.",
    benefitsTitle: "Key Advantages",
    benefitsSubtitle: "Why leading manufacturers choose zinc plating for critical applications",
    processTitle: "Our Zinc Plating Process",
    processSubtitle: "Precision-controlled deposition for consistent quality",
    applicationsTitle: "Zinc Plating Applications",
    applicationsSubtitle: "Critical for industries requiring optimal corrosion protection and aesthetic appeal",
    qualityTitle: "Quality Commitment",
    qualityDescription: "Alkalyne maintains rigorous quality standards for every zinc-plated component",
    ctaTitle: "Need Precision Zinc Plating?",
    ctaDescription: "From prototype batches to high-volume production, we deliver zinc plating that meets exacting standards",
    benefits: [
      { icon: "Shield", title: "Corrosion Protection", description: "Excellent barrier protection against rust and corrosion" },
      { icon: "Award", title: "Aesthetic Finishes", description: "Wide range of attractive colour passivation options" },
      { icon: "Layers", title: "Sacrificial Protection", description: "Zinc acts as sacrificial anode protecting base metal" },
      { icon: "Activity", title: "Cost Effective", description: "Economical protection for high-volume applications" },
      { icon: "TestTube2", title: "Chemical Resistance", description: "Resistance to various environmental conditions" },
      { icon: "Check", title: "Easy Processing", description: "Suitable for complex geometries and mass production" }
    ],
    processSteps: [
      { step: "1", title: "Surface Preparation", description: "Degreasing, pickling, and activation", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
      { step: "2", title: "Zinc Deposition", description: "Electrochemical zinc plating process", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" },
      { step: "3", title: "Colour Passivation", description: "Chromate conversion coating application", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
      { step: "4", title: "Final Inspection", description: "Quality control and finishing", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" }
    ],
    applications: [
      { title: "Automotive Components", image: "/uploads/zinc-plating/automotive.jpg", items: ["Fasteners", "Brackets", "Hardware", "Body components"] },
      { title: "Construction Hardware", image: "/uploads/zinc-plating/construction.jpg", items: ["Bolts and screws", "Brackets", "Structural components", "Roofing hardware"] },
      { title: "Industrial Equipment", image: "/uploads/zinc-plating/industrial.jpg", items: ["Machine parts", "Enclosures", "Tooling", "Agricultural equipment"] }
    ],
    industries: [
      { name: "Automotive", icon: "Wrench", examples: ["Fasteners", "Brackets", "Hardware"], image: "/uploads/zinc-plating/automotive-industry.jpg" },
      { name: "Construction", icon: "HardHat", examples: ["Bolts and screws", "Brackets", "Structural components"], image: "/uploads/zinc-plating/construction-industry.jpg" },
      { name: "Industrial", icon: "Cpu", examples: ["Machine parts", "Enclosures", "Tooling"], image: "/uploads/zinc-plating/industrial-industry.jpg" }
    ],
    qualityChecks: [
      { title: "Thickness Testing", description: "Magnetic and X-ray fluorescence testing" },
      { title: "Adhesion Testing", description: "ASTM B571 bend and impact tests" },
      { title: "Corrosion Testing", description: "Salt spray testing per ASTM B117" },
      { title: "Appearance Inspection", description: "Visual and color matching verification" }
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
          <p className="mt-4 text-gray-600">Loading Zinc Plating content...</p>
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
                alt="Zinc Plating Process"
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
                alt="Zinc Plating Process"
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {app.title}
                  </h3>
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

export default ZincPlating 
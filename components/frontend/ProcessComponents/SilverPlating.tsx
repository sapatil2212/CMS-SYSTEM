'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Check, Zap, Layers, Activity, Cpu, CircuitBoard, TestTube2, Wrench, Plane, HardHat, Anchor, Shield, Thermometer, Microscope } from 'lucide-react'

const SilverPlating = () => {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content/silver-plating')
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
    heroTitle: "High-Performance Silver Plating Solutions",
    heroSubtitle: "Industrial-Grade Silver Plating Services",
    heroDescription: "99.9% Pure Silver • Highest Electrical Conductivity • Superior Thermal Resistance",
    heroImage: "/uploads/silver-plating/hero.jpg",
    whatIsTitle: "What is Silver Plating?",
    whatIsDescription: "At Alkalyne, we offer industrial-grade silver plating services tailored to meet the most demanding technical requirements. Using 99.9% pure silver anodes and advanced electrolytic processes, we deliver finishes that combine functionality with durability.",
    whatIsImage: "/uploads/silver-plating/what-is.jpg",
    whatIsBestFor: "High-frequency electronics\nMedical devices\nAerospace components\nElectrical contacts",
    whatIsMaterials: "Copper and copper alloys\nBrass and bronze\nSteel (with barrier layer)\nAluminum (special process)",
    benefitsTitle: "Benefits of Silver Plating",
    benefitsSubtitle: "Why leading manufacturers choose silver plating for critical applications",
    processTitle: "Our Silver Plating Process",
    processSubtitle: "Alkalyne's systematic approach ensures consistent, high-quality silver plating for both prototype and production volumes",
    applicationsTitle: "Silver Plating Applications",
    applicationsSubtitle: "Critical for industries requiring optimal electrical performance and reliable plating foundations",
    qualityTitle: "Quality Assurance",
    qualityDescription: "Alkalyne maintains rigorous quality standards for every silver-plated component",
    ctaTitle: "Ready to Enhance Your Performance?",
    ctaDescription: "Whether you need prototype plating or high-volume production, our team is ready to deliver exceptional results",
    benefits: [
      { icon: "Zap", title: "Highest Electrical Conductivity", description: "Highest electrical conductivity of all metals (63 x 10^6 S/m)" },
      { icon: "Thermometer", title: "Excellent Thermal Resistance", description: "Superior thermal resistance and oxidation resistance" },
      { icon: "Shield", title: "Anti-Galling Properties", description: "Anti-galling & anti-fretting properties for moving parts" },
      { icon: "Activity", title: "High-Temperature Performance", description: "Stable performance in high-temperature environments" },
      { icon: "TestTube2", title: "Corrosion Resistance", description: "Corrosion resistance against industrial chemicals" },
      { icon: "Microscope", title: "Antibacterial Surface", description: "Antibacterial surface ideal for medical applications" }
    ],
    processSteps: [
      { step: "1", title: "Surface Prep", description: "Degreasing, acid cleaning & activation", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
      { step: "2", title: "Electrolytic Bath", description: "Immersion in silver solution", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" },
      { step: "3", title: "Plating", description: "Current-controlled deposition", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
      { step: "4", title: "Finishing", description: "Rinsing, drying & inspection", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" }
    ],
    applications: [
      { title: "Electrical & Electronics", image: "/uploads/silver-plating/electronics.jpg", items: ["Terminals", "Contacts", "Circuit boards", "Connectors"] },
      { title: "Aerospace & Defense", image: "/uploads/silver-plating/aerospace.jpg", items: ["High-temperature components", "Corrosion-prone environments", "Mission-critical parts", "Electrical systems"] },
      { title: "Medical Devices", image: "/uploads/silver-plating/medical.jpg", items: ["Surgical instruments", "Medical fittings", "Antibacterial surfaces", "Precision components"] }
    ],
    qualityChecks: [
      { title: "ISO 9001:2015 Certified", description: "Certified excellence in all processes" },
      { title: "ISO 14001 Environmental", description: "Environmental standards compliance" },
      { title: "Automated Thickness Measurement", description: "Precise thickness verification" },
      { title: "Material Certifications", description: "Available material certifications" }
    ]
  })

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Zap, Layers, Activity, Check, CircuitBoard, TestTube2, Cpu, Wrench, Plane, HardHat, Anchor, Shield, Thermometer, Microscope
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
      console.error('Error parsing JSON data:', error, 'Data:', data);
      return [];
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
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
      <section className="mb-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
        <div className="absolute inset-0">
          <img 
            src={content.heroImage} 
            alt="Silver plating process" 
            className="w-full h-full object-cover opacity-30"
            loading="eager"
          />
        </div>
        <div className="relative z-10 max-w-4xl">
          <span className="inline-block bg-gray-500/20 text-gray-300 text-sm font-medium px-3 py-1 rounded-full mb-6">
            {content.heroSubtitle}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {content.heroTitle}
          </h1>
          <p className="text-xl text-gray-100 mb-8">
            {content.heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg"
            >
              Get a Free Consultation <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* What is Silver Plating */}
      <section className="mb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{content.whatIsTitle}</h2>
            <p className="text-lg text-gray-600 mb-6">
              {content.whatIsDescription}
            </p>
            <div className="bg-gray-50 border-l-4 border-gray-500 p-4 mb-6">
              <p className="text-gray-800 font-medium">
                We can apply everything from thin flash coatings (0.5μm) to heavy plating (8μm+) based on your application needs.
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
                alt="Silver plating example"
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
              <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 group">
                <div className="bg-gray-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6 group-hover:bg-gray-200 transition-colors duration-300">
                  <IconComponent className="h-6 w-6 text-gray-600" />
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
          <div className="hidden md:block absolute top-[44px] left-0 right-0 h-0.5 border-t-2 border-dotted border-gray-300 z-0"></div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            {(content.processSteps || []).map((step: any, index: number) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                {/* Dot for desktop */}
                <div className="hidden md:block w-5 h-5 bg-gray-600 rounded-full border-4 border-white absolute top-[34px] left-1/2 transform -translate-x-1/2 z-10"></div>

                {/* Card */}
                <div className="mt-0 md:mt-16 bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 w-full">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 mb-4 mx-auto">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                    </svg>
                  </div>
                  <div className="flex justify-center items-center mb-2 space-x-2">
                    <span className="text-gray-600 font-bold text-lg">{step.step}</span>
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
                <h3 className="font-semibold text-gray-900 text-lg mb-4">{app.title}</h3>
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

      {/* Industries Section */}
      <section className="mb-20 bg-gray-50 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Industries We Serve</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Trusted by leading manufacturers across diverse sectors
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Electronics Manufacturing", icon: "Cpu", items: ["Circuit boards", "Connectors", "RF components", "High-frequency circuits"] },
            { title: "Automotive OEMs", icon: "Wrench", items: ["Electrical systems", "Sensors", "Switchgear", "Battery terminals"] },
            { title: "Aerospace Components", icon: "Plane", items: ["High-temperature parts", "Electrical systems", "Mission-critical components", "Corrosion protection"] },
            { title: "Power & Energy Sector", icon: "Zap", items: ["Busbars", "Switchgear", "Power distribution", "Electrical contacts"] },
            { title: "Railways & Infrastructure", icon: "HardHat", items: ["Electrical systems", "Signal equipment", "Power distribution", "Safety components"] },
            { title: "Medical Technology", icon: "Microscope", items: ["Surgical instruments", "Medical devices", "Antibacterial surfaces", "Precision components"] }
          ].map((industry: any, index: number) => {
            const IconComponent = getIconComponent(industry.icon)
            return (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300">
                <div className="bg-gray-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <IconComponent className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-4">{industry.title}</h3>
                <ul className="space-y-2">
                  {industry.items.map((item: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
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
                  <div className="bg-gray-100 p-2 rounded-full mr-4 flex-shrink-0">
                    <Check className="h-5 w-5 text-gray-600" />
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
                src={content.qualityImage || "/uploads/silver-plating/quality-inspection.jpg"} 
                alt="Quality inspection process"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-3xl p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-1/4 translate-y-1/4"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{content.ctaTitle}</h2>
          <p className="text-gray-100 text-xl mb-8">
            {content.ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-gray-800 hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all duration-300 hover:shadow-lg"
            >
              Get a Free Consultation <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SilverPlating 
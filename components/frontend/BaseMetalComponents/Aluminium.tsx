'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ChevronRight, Check, Shield, Zap, Layers, 
  Thermometer, Plane, Car, CircuitBoard, 
  Rocket, HardHat, Battery, Factory, 
  Award, ClipboardCheck, Package 
} from 'lucide-react'

const Aluminium = () => {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content/aluminium')
      if (response.ok) {
        const data = await response.json()
        setContent(data)
      } else {
        console.error('Failed to fetch aluminium content')
        setContent(getDefaultContent())
      }
    } catch (error) {
      console.error('Error fetching aluminium content:', error)
      setContent(getDefaultContent())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultContent = () => ({
    heroTitle: "Specialised Aluminium Plating Services Across India",
    heroSubtitle: "Advanced Metal Finishing Solutions",
    heroDescription: "Reliable Protection, Enhanced Functionality, and Precision Finishing for Modern Industries",
    heroImage: "/uploads/aluminium/hero.jpg",
    whatIsTitle: "What is Aluminium Plating?",
    whatIsDescription: "Aluminium is a lightweight metal known for its strength-to-weight ratio and natural corrosion resistance. Plating enhances these properties for demanding applications, providing improved durability, conductivity, wear resistance, and decorative finishes.",
    whatIsImage: "/uploads/aluminium/what-is.jpg",
    whatIsBestFor: "Complex geometries\nPrecision components\nCorrosion resistance\nWear resistance\nUniform thickness",
    whatIsMaterials: "Steel alloys\nAluminum\nCopper alloys\nPlastics\nCeramics",
    whatIsAlkalineOffers: "Our specialised plating processes overcome aluminium's natural oxide layer challenges to ensure perfect adhesion and long-lasting performance.",
    benefitsTitle: "Key Benefits of Aluminium Plating",
    benefitsSubtitle: "Enhance your components with our specialised plating solutions",
    processTitle: "Our Plating Process",
    processSubtitle: "Precision steps to ensure optimal results for your aluminium components",
    applicationsTitle: "Aluminium Applications",
    applicationsSubtitle: "Critical for industries requiring enhanced functionality",
    industriesTitle: "Industries We Serve",
    industriesSubtitle: "Our aluminium plating solutions support critical applications across sectors",
    qualityTitle: "Quality Commitment",
    qualityDescription: "Alkalyne maintains rigorous quality standards for every aluminium-plated component",
    qualityImage: "/uploads/aluminium/quality.jpg",
    ctaTitle: "Ready to Enhance Your Aluminium Components?",
    ctaDescription: "Our team is ready to discuss your specific plating requirements and provide a tailored solution",
    benefits: [
      { icon: "Shield", title: "Corrosion Resistance", description: "Protection against rust, oxidation, and chemicals" },
      { icon: "Zap", title: "Enhanced Conductivity", description: "Improved electrical performance with silver/gold plating" },
      { icon: "Layers", title: "Wear Resistance", description: "Increased durability for high-friction applications" },
      { icon: "Thermometer", title: "Thermal Management", description: "Better heat dissipation for electronics" },
      { icon: "Award", title: "Aesthetic Finishes", description: "Decorative and functional surface treatments" },
      { icon: "Factory", title: "Chemical Resistance", description: "Withstands harsh industrial environments" }
    ],
    processSteps: [
      { step: "1", title: "Surface Preparation", description: "Thorough cleaning and degreasing to remove contaminants" },
      { step: "2", title: "Zincating", description: "Specialized zinc immersion for optimal adhesion" },
      { step: "3", title: "Plating Bath", description: "Precision deposition in controlled solutions" },
      { step: "4", title: "Quality Control", description: "Rigorous testing for thickness and performance" },
      { step: "5", title: "Packaging", description: "Secure packaging for transportation" }
    ],
    applications: [
      { title: "Precision Components", image: "/uploads/aluminium/precision.jpg", items: ["Valves", "Pumps", "Bearings", "Gears"] },
      { title: "Electronics", image: "/uploads/aluminium/electronics.jpg", items: ["Connectors", "Switches", "Circuit boards", "Housings"] },
      { title: "Aerospace", image: "/uploads/aluminium/aerospace.jpg", items: ["Engine parts", "Landing gear", "Hydraulic systems", "Fasteners"] }
    ],
    industries: [
      { name: "Aerospace & Aviation", icon: "Rocket", examples: ["Fuselage parts", "Landing gear", "Avionics housings"], image: "/uploads/aluminium/aerospace-industry.jpg" },
      { name: "Automotive & EV", icon: "Car", examples: ["Battery enclosures", "Motor components", "Structural parts"], image: "/uploads/aluminium/automotive-industry.jpg" },
      { name: "Defence & Security", icon: "Shield", examples: ["Armor components", "Marine hardware", "Aircraft parts"], image: "/uploads/aluminium/defence-industry.jpg" },
      { name: "Electronics", icon: "CircuitBoard", examples: ["Heat sinks", "Connectors", "RF shielding"], image: "/uploads/aluminium/electronics-industry.jpg" }
    ],
    qualityChecks: [
      { title: "Thickness Testing", description: "Magnetic and X-ray fluorescence testing" },
      { title: "Adhesion Testing", description: "ASTM B571 bend and impact tests" },
      { title: "Corrosion Testing", description: "Salt spray testing per ASTM B117" },
      { title: "Appearance Inspection", description: "Visual and finish verification" }
    ]
  })

  useEffect(() => {
    fetchContent()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-3xl mb-8"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      Shield: <Shield className="h-6 w-6 text-blue-600" />,
      Zap: <Zap className="h-6 w-6 text-blue-600" />,
      Layers: <Layers className="h-6 w-6 text-blue-600" />,
      Thermometer: <Thermometer className="h-6 w-6 text-blue-600" />,
      Award: <Award className="h-6 w-6 text-blue-600" />,
      Factory: <Factory className="h-6 w-6 text-blue-600" />,
      Rocket: <Rocket className="h-6 w-6 text-blue-600" />,
      Car: <Car className="h-6 w-6 text-blue-600" />,
      CircuitBoard: <CircuitBoard className="h-6 w-6 text-blue-600" />,
      Plane: <Plane className="h-6 w-6 text-blue-600" />
    }
    return iconMap[iconName] || <Shield className="h-6 w-6 text-blue-600" />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="mb-20 bg-gradient-to-r from-blue-900 to-gray-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-30">
          <img 
            src={content?.heroImage || "/uploads/aluminium/hero.jpg"} 
            alt="Aluminium plating process" 
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        <div className="relative z-10 max-w-4xl">
          <span className="inline-block bg-blue-500/20 text-blue-300 text-xs md:text-sm font-medium px-3 py-1 rounded-full mb-6">
            Advanced Metal Finishing Solutions
          </span>
          <h1 className="text-2xl md:text-5xl font-bold mb-6 leading-tight">
            {content?.heroTitle || "Specialised Aluminium Plating Services Across India"}
          </h1>
          <p className="text-sm md:text-xl text-blue-100 mb-8">
            {content?.heroDescription || "Reliable Protection, Enhanced Functionality, and Precision Finishing for Modern Industries"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg"
            >
              Get a Quote <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="mb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{content?.whatIsTitle || "What is Aluminium Plating?"}</h2>
            <p className="text-gray-600 mb-6">
              {content?.whatIsDescription || "Aluminium is a lightweight metal known for its strength-to-weight ratio and natural corrosion resistance. Plating enhances these properties for demanding applications, providing improved durability, conductivity, wear resistance, and decorative finishes."}
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-blue-800 font-medium">
                {content?.whatIsAlkalineOffers || "Our specialised plating processes overcome aluminium's natural oxide layer challenges to ensure perfect adhesion and long-lasting performance."}
              </p>
            </div>
          </div>
          <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
            <div className="mb-4 rounded-lg overflow-hidden">
              <img 
                src={content?.whatIsImage || "/uploads/aluminium/what-is.jpg"} 
                alt="Aluminium plating samples"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{content?.benefitsTitle || "Key Benefits of Aluminium Plating"}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {content?.benefitsSubtitle || "Enhance your components with our specialised plating solutions"}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content?.benefits?.map((item: any, index: number) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                {getIconComponent(item.icon)}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Industries Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{content?.industriesTitle || "Industries We Serve"}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {content?.industriesSubtitle || "Our aluminium plating solutions support critical applications across sectors"}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {content?.industries?.map((industry: any, index: number) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden border border-gray-200">
              <div className="relative h-48">
                <img 
                  src={industry.image} 
                  alt={industry.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4 text-blue-600">
                      {getIconComponent(industry.icon)}
                    </div>
                    <h3 className="text-xl font-bold text-white">{industry.name}</h3>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Common Applications:</h4>
                <ul className="space-y-2">
                  {industry.examples?.map((example: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{content?.processTitle || "Our Plating Process"}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {content?.processSubtitle || "Precision steps to ensure optimal results for your aluminium components"}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
          <div className="grid md:grid-cols-5 gap-6">
            {content?.processSteps?.map((step: any, index: number) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto">
                  {step.step}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <img 
                src={content?.qualityImage || "/uploads/aluminium/quality.jpg"} 
                alt="Quality aluminium plating"
                className="w-full h-auto rounded-lg"
                loading="lazy"
              />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Alkalyne?</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 flex-shrink-0">
                  <ClipboardCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Industry Expertise</h4>
                  <p className="text-gray-600">Decades of experience in aluminium surface treatment</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 flex-shrink-0">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Full-Service Solutions</h4>
                  <p className="text-gray-600">From prototype to high-volume production runs</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 flex-shrink-0">
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Quality Assurance</h4>
                  <p className="text-gray-600">Stringent testing protocols for consistent results</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 flex-shrink-0">
                  <Factory className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Advanced Facilities</h4>
                  <p className="text-gray-600">State-of-the-art plating equipment and technology</p>
                </div>
              </div>
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
          <h2 className="text-xl md:text-4xl font-bold text-white mb-6">{content?.ctaTitle || "Ready to Enhance Your Aluminium Components?"}</h2>
          <p className="text-blue-100 mb-8 text-sm md:text-lg">
            {content?.ctaDescription || "Our team is ready to discuss your specific plating requirements and provide a tailored solution"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-blue-600 hover:bg-gray-100 font-bold py-2 px-5 rounded-full transition-all duration-300 hover:shadow-lg"
            >
              Get a Free Quote <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Aluminium 
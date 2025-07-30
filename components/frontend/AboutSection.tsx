'use client'

import React, { useState, useEffect } from 'react';
import { Crown, Users, Award, Heart, Shield, Clock, Star, CheckCircle, Zap, Cog, Target, Eye } from 'lucide-react';

interface AboutContent {
  title: string
  subtitle: string
  description: string
  image: string
}

interface AboutValue {
  id: string
  icon: string
  title: string
  description: string
  order: number
  isActive: boolean
}

interface AboutCapability {
  id: string
  icon: string
  title: string
  description: string
  order: number
  isActive: boolean
}

interface AboutMissionVision {
  id: string
  type: string
  title: string
  description: string
  icon: string
}

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: React.ReactElement } = {
    Crown: <Crown className="h-8 w-8" />,
    Shield: <Shield className="h-8 w-8" />,
    Zap: <Zap className="h-8 w-8" />,
    Cog: <Cog className="h-8 w-8" />,
    CheckCircle: <CheckCircle className="h-6 w-6" />,
    Users: <Users className="h-6 w-6" />,
    Award: <Award className="h-6 w-6" />,
    Clock: <Clock className="h-6 w-6" />,
    Target: <Target className="h-12 w-12" />,
    Eye: <Eye className="h-12 w-12" />,
    Star: <Star className="h-6 w-6" />,
    Heart: <Heart className="h-6 w-6" />
  }
  
  return iconMap[iconName] || <CheckCircle className="h-6 w-6" />
}

const AboutSection: React.FC = () => {
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    title: '',
    subtitle: '',
    description: '',
    image: ''
  })
  const [values, setValues] = useState<AboutValue[]>([])
  const [capabilities, setCapabilities] = useState<AboutCapability[]>([])
  const [missionVision, setMissionVision] = useState<AboutMissionVision[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      const [contentResponse, valuesResponse, capabilitiesResponse, missionVisionResponse] = await Promise.all([
        fetch('/api/content/about-content'),
        fetch('/api/content/about-values'),
        fetch('/api/content/about-capabilities'),
        fetch('/api/content/about-mission-vision')
      ])

      if (contentResponse.ok) {
        const contentData = await contentResponse.json()
        setAboutContent(contentData)
      }

      if (valuesResponse.ok) {
        const valuesData = await valuesResponse.json()
        setValues(valuesData)
      }

      if (capabilitiesResponse.ok) {
        const capabilitiesData = await capabilitiesResponse.json()
        setCapabilities(capabilitiesData)
      }

      if (missionVisionResponse.ok) {
        const missionVisionData = await missionVisionResponse.json()
        setMissionVision(missionVisionData)
      }
    } catch (error) {
      console.error('Failed to fetch about data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded mb-6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  const activeValues = values.filter(v => v.isActive).sort((a, b) => a.order - b.order)
  const activeCapabilities = capabilities.filter(c => c.isActive).sort((a, b) => a.order - b.order)
  const mission = missionVision.find(mv => mv.type === 'mission')
  const vision = missionVision.find(mv => mv.type === 'vision')

  return (
    <div>
      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-inter">
                {aboutContent.title || 'About Alkalyne'}
              </h2>
              <h3 className="text-xl md:text-2xl font-semibold text-blue-700 mb-6">
                {aboutContent.subtitle || 'Precision in Every Layer. Commitment in Every Process.'}
              </h3>
              
              <p className="text-sm lg:text-lg text-gray-600 mb-8 leading-relaxed">
                {aboutContent.description || 'Alkalyne is a trusted name in the field of metal finishing and surface treatment, known for delivering high-performance plating solutions that meet the rigorous demands of modern industries.'}
              </p>
            </div>
            
            <div className="relative max-h-96 lg:max-h-[550px] overflow-hidden rounded-xl">
              <img
                src={aboutContent.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'}
                alt="Alkalyne Metal Finishing Facility"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      {(mission || vision) && (
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-inter">Mission & Vision</h2>
              <p className="text-sm lg:text-xl text-blue-600">Our guiding principles that shape everything we do</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {mission && (
                <div className="bg-white p-8 rounded-xl border">
                  <div className="text-blue-600 mb-4">
                    {getIconComponent(mission.icon)}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 font-inter">{mission.title}</h3>
                  <p className="text-gray-600 text-xs lg:text-[15px] leading-relaxed">
                    {mission.description}
                  </p>
                </div>
              )}

              {vision && (
                <div className="bg-white p-8 rounded-xl border">
                  <div className="text-blue-600 mb-4">
                    {getIconComponent(vision.icon)}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 font-inter">{vision.title}</h3>
                  <p className="text-gray-600 text-xs lg:text-[15px] leading-relaxed">
                    {vision.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Our Values */}
      {activeValues.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 font-inter">Our Values</h2>
              <p className="text-sm lg:text-xl text-gray-600">The principles that guide our commitment to excellence</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              {activeValues.map((value, index) => (
                <div key={value.id} className="text-center group border p-8 rounded-xl bg-blue-50/50">
                  <div className="bg-blue-50 w-8 lg:w-20 h-8 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-600 group-hover:bg-blue-100 transition-colors duration-300">
                    {getIconComponent(value.icon)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-inter">{value.title}</h3>
                  <p className="text-gray-600 text-xs lg:text-[15px] leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Capabilities Section */}
      {activeCapabilities.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 font-inter">Driven by Expertise. Backed by Technology.</h2>
              <p className="text-sm lg:text-xl text-gray-600">What sets us apart in metal finishing and surface treatment</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeCapabilities.map((capability, index) => (
                <div key={capability.id} className="bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow duration-300">
                  <div className="text-amber-600 mb-4">
                    {getIconComponent(capability.icon)}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 font-inter">{capability.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{capability.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AboutSection; 
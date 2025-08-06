'use client'

import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import {  Users, Mic, Palette, Calendar, ChevronRight, Star, Crown, MapPin, Home, Sparkles, Utensils, ParkingCircle, Brain, FlaskConical, RotateCcw, Settings, Zap, Truck, UserCheck  } from 'lucide-react';;

interface WhyChooseUsFeature {
  id: string
  icon: string
  title: string
  description: string
  color: string
  bg: string
  order: number
  isActive: boolean
}

interface WhyChooseUsData {
  title: string
  description: string
  image: string
  rating: number
  ratingText: string
  technologyText: string
}

const WhyChooseUs: React.FC = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [features, setFeatures] = useState<WhyChooseUsFeature[]>([]);
  const [content, setContent] = useState<WhyChooseUsData>({
    title: '',
    description: '',
    image: '',
    rating: 5,
    ratingText: '',
    technologyText: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWhyChooseUsData();
  }, []);

  const fetchWhyChooseUsData = async () => {
    try {
      const [featuresResponse, contentResponse] = await Promise.all([
        fetch('/api/content/why-choose-us-features'),
        fetch('/api/content/why-choose-us-content')
      ]);

      if (featuresResponse.ok) {
        const featuresData = await featuresResponse.json();
        setFeatures(featuresData);
      }

      if (contentResponse.ok) {
        const contentData = await contentResponse.json();
        setContent(contentData);
      }
    } catch (error) {
      logger.error('Failed to fetch why choose us data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Brain, FlaskConical, RotateCcw, Settings, Zap, Truck, UserCheck, Crown,
      Users, Mic, Palette, Calendar, Star, MapPin, Home, Sparkles, Utensils, ParkingCircle
    };
    return iconMap[iconName] || Brain;
  };

  if (loading) {
    return (
      <section className="relative py-20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Skeleton */}
            <div className="order-2 lg:order-1 relative">
              <div className="relative overflow-hidden rounded-3xl border border-gray-100 h-[600px] animate-pulse bg-gray-200"></div>
            </div>

            {/* Content Skeleton */}
            <div className="order-1 lg:order-2 space-y-8 px-8 sm:px-6 lg:px-8">
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3 lg:gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="p-3 rounded-2xl border border-gray-100 animate-pulse">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="order-2 lg:order-1 relative group">
            <div className="relative overflow-hidden rounded-3xl border border-gray-100 transform transition-all duration-700 group-hover:scale-[1.02] h-[600px]">
              {/* Surface technology image */}
              {content.image ? (
                <img
                  src={content.image}
                  alt="Surface Technologies and Plating"
                  className="w-full h-full object-cover"
                  onLoad={() => setIsImageLoaded(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center">
                    <Zap className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Surface Technology</p>
                  </div>
                </div>
              )}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

              {/* Floating stats card */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 transform transition-all duration-500 hover:scale-105">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(content.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{content.rating || 5}.0</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{content.ratingText || 'Decades of Experience'}</p>
              </div>

              {/* Technology indicator */}
              <div className="absolute bottom-6 left-6 bg-blue-600/90 backdrop-blur-sm text-white rounded-2xl px-4 py-2 transform transition-all duration-500 hover:bg-blue-600">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span className="font-semibold">{content.technologyText || 'Advanced Tech'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="order-1 lg:order-2 space-y-8 px-8 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-inter">
                {content.title || 'Why Choose Alkalyne Surface Technologies?'}
              </h2>
              
              <p className="text-sm lg:text-md text-gray-600 leading-relaxed">
                {content.description || 'We understand the challenges of finding a reliable, technically sound plating partner. At Alkalyne, we are committed to delivering precision, performance, and peace of mind — every time.'}
              </p>
            </div>

            {/* Interactive Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3 lg:gap-4">
              {features
                .filter(feature => feature.isActive)
                .sort((a, b) => a.order - b.order)
                .map((feature, index) => {
                  const IconComponent = getIconComponent(feature.icon);
                  return (
                    <div
                      key={feature.id}
                      className={`relative p-3 rounded-2xl border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        hoveredFeature === index ? feature.bg : 'bg-white hover:bg-gray-50'
                      }`}
                      onMouseEnter={() => setHoveredFeature(index)}
                      onMouseLeave={() => setHoveredFeature(null)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-xl ${feature.bg} ${feature.color} transition-all duration-300 ${
                          hoveredFeature === index ? 'scale-110' : ''
                        }`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs md:text-sm font-semibold text-gray-900 mb-1">{feature.title}</h4>
                          <p className="text-xs text-gray-600 leading-tight">{feature.description}</p>
                        </div>
                      </div>
                      
                      {/* Hover indicator */}
                      <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 ${
                        hoveredFeature === index ? `border-blue-300 shadow-lg` : 'border-transparent'
                      }`}></div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs; 
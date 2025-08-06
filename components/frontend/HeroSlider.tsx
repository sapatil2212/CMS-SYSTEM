'use client'

import { useState, useEffect } from 'react'
import { logger } from '@/lib/logger';
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link';

interface HeroSlide {
  id: string
  title: string
  subtitle?: string
  description?: string
  image: string
  mobileImage?: string
  ctaText?: string
  ctaLink?: string
}

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<HeroSlide[]>([])

  useEffect(() => {
    fetchSlides()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/content/hero-slider')
      if (response.ok) {
        const data = await response.json()
        setSlides(data)
      }
    } catch (error) {
      logger.error('Failed to fetch hero slides:', error)
      // Fallback slides with dummy images
      setSlides([
        {
          id: '1',
          title: 'Precision Plating, Engineered to Last',
          subtitle: 'Boost durability and corrosion resistance with our advanced metal finishing solutions.',
          description: 'Advanced metal finishing solutions for industrial applications',
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop',
          mobileImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=800&fit=crop',
          ctaText: 'Contact us',
          ctaLink: '/contact'
        },
        {
          id: '2',
          title: 'Innovation in Every Layer',
          subtitle: 'Cutting-edge plating and finishing that enhance product quality and value.',
          description: 'Cutting-edge plating and finishing solutions',
          image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&h=800&fit=crop',
          mobileImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=800&fit=crop',
          ctaText: 'Contact us',
          ctaLink: '/contact'
        },
        {
          id: '3',
          title: 'Surface Perfection for Every Application',
          subtitle: 'Tailored treatments that meet the toughest industry standards.',
          description: 'Tailored treatments for industry standards',
          image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&h=800&fit=crop',
          mobileImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=800&fit=crop',
          ctaText: 'Contact us',
          ctaLink: '/contact'
        },
      ])
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (slides.length === 0) {
    return (
      <div className="relative h-[60vh] md:h-[85vh] bg-gray-200 animate-pulse rounded-3xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 pt-0 pb-8 group">
      <div className="relative h-[60vh] md:h-[85vh] overflow-hidden rounded-3xl">
        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 left-0 z-30 flex items-center justify-center w-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={prevSlide}
            className="p-2 rounded-full bg-black bg-opacity-40 text-white hover:bg-opacity-60 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 z-30 flex items-center justify-center w-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={nextSlide}
            className="p-2 rounded-full bg-black bg-opacity-40 text-white hover:bg-opacity-60 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Mobile Image (hidden on desktop) */}
            <div className="md:hidden">
              <div className="absolute inset-0 bg-black bg-opacity-40 z-10 rounded-3xl" />
              <Image
                src={slide.mobileImage || slide.image}
                alt={slide.title}
                fill
                className="object-cover object-center rounded-3xl"
                priority={index === 0}
              />
            </div>
            
            {/* Desktop Image */}
            <div className="hidden md:block">
              <div className="absolute inset-0 bg-black bg-opacity-40 z-10 rounded-3xl" />
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover object-center rounded-3xl"
                priority={index === 0}
              />
            </div>
            
            <div className="absolute inset-0 z-20 flex items-center justify-center md:justify-start">
              <div className={`text-center md:text-left text-white max-w-4xl px-6 lg:px-[60px] transform md:translate-y-0 -translate-y-[90px] transition-all duration-1000 ease-out ${
                index === currentSlide 
                  ? 'opacity-100 md:translate-y-0 -translate-y-8' 
                  : 'opacity-0 -translate-y-8'
              }`}
              style={{ 
                transitionDelay: index === currentSlide ? '500ms' : '0ms' 
              }}>
                <h1 className="text-3xl md:text-6xl lg:text-6xl font-bold mb-4 md:mb-6">
                  {slide.title}
                </h1>
                <p className="text-base md:text-xl lg:text-2xl mb-6 md:mb-8">
                  {slide.subtitle}
                </p>
                {slide.ctaLink && slide.ctaText && (
                  <Link
                    href={slide.ctaLink}
                    className="inline-block px-6 py-2 md:px-8 md:py-3 rounded-lg text-sm md:text-lg font-medium transition-all duration-200 transform hover:scale-105 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    {slide.ctaText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Slide Indicators - Always visible */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide ? 'bg-blue-700' : 'bg-white bg-opacity-30'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
} 
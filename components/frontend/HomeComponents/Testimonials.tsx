'use client'

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, User, Star, Quote, Play, Pause, Factory, HardHat, Shield, Award, ClipboardCheck } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Testimonial {
  id: string
  name: string
  avatar: string
  company: string
  quote: string
  rating: number
  date: string
  verified: boolean
  industry: string
  isActive: boolean
  order: number
}

interface TestimonialContent {
  title: string
  subtitle: string
  description: string
  stats: {
    averageRating: string
    totalClients: string
    qualityCompliance: string
  }
}

// Industry icons mapping
const industryIcons = {
  Automotive: <Factory className="h-4 w-4" />,
  Aerospace: <HardHat className="h-4 w-4" />,
  Electronics: <ClipboardCheck className="h-4 w-4" />,
  Energy: <Shield className="h-4 w-4" />,
  Medical: <Award className="h-4 w-4" />
};

const Testimonials: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const swiperRef = useRef<any>(null);
  
  // Data states
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialContent, setTestimonialContent] = useState<TestimonialContent>({
    title: '',
    subtitle: '',
    description: '',
    stats: {
      averageRating: '4.9',
      totalClients: '200+',
      qualityCompliance: '100%'
    }
  });

  // Fetch testimonial data
  useEffect(() => {
    fetchTestimonialData();
  }, []);

  const fetchTestimonialData = async () => {
    try {
      const [testimonialsResponse, contentResponse] = await Promise.all([
        fetch('/api/content/testimonials'),
        fetch('/api/content/testimonial-content')
      ]);

      if (testimonialsResponse.ok) {
        const testimonialsData = await testimonialsResponse.json();
        setTestimonials(testimonialsData);
      }

      if (contentResponse.ok) {
        const contentData = await contentResponse.json();
        setTestimonialContent(contentData);
      }
    } catch (error) {
      console.error('Failed to fetch testimonial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 transition-all duration-200 ${
          i < rating
            ? "text-amber-400 fill-amber-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const renderTestimonialCard = (testimonial: Testimonial, index: number) => (
    <div
      key={testimonial.id}
      className={`group relative bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden h-full ${
        hoveredCard === index ? "border-blue-400" : ""
      }`}
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
        <Quote className="h-8 w-8 text-blue-600" />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center font-bold text-blue-700 text-lg">
              {testimonial.avatar}
            </div>
            {testimonial.verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
              <div className="flex items-center space-x-1">
                {renderStars(testimonial.rating)}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{testimonial.company}</p>
            <div className="flex items-center mt-1">
              <span className="text-xs text-gray-500 mr-2">
                {industryIcons[testimonial.industry as keyof typeof industryIcons]}
              </span>
              <span className="text-xs text-gray-500">{testimonial.industry} Sector</span>
            </div>
          </div>
        </div>

        <blockquote className="text-sm text-gray-700 mb-4 flex-grow">
          "{testimonial.quote}"
        </blockquote>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{testimonial.date}</span>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-medium text-blue-600">Verified Client</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const toggleAutoplay = () => {
    if (swiperRef.current) {
      if (isAutoPlaying) {
        swiperRef.current.autoplay.stop();
      } else {
        swiperRef.current.autoplay.start();
      }
      setIsAutoPlaying(!isAutoPlaying);
    }
  };

  if (isLoading) {
    return (
      <section className="bg-white py-8 relative">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-6 bg-blue-600/10 backdrop-blur-sm px-6 py-2 rounded-full border border-blue-500/20 text-blue-800">
              <ClipboardCheck className="h-4 w-4" />
              <span className="text-xs sm:text-sm font-medium text-blue-800 tracking-widest pl-2">Loading testimonials...</span>
            </div>
            <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const activeTestimonials = testimonials.filter(t => t.isActive).sort((a, b) => a.order - b.order);

  if (activeTestimonials.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-8 relative">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6 bg-blue-600/10 backdrop-blur-sm px-6 py-2 rounded-full border border-blue-500/20 text-blue-800">
            <ClipboardCheck className="h-4 w-4" />
            <span className="text-xs sm:text-sm font-medium text-blue-800 tracking-widest pl-2">
              {testimonialContent.subtitle || 'CLIENT TESTIMONIALS'}
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {testimonialContent.title || 'Trusted by Industry Leaders'}
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {testimonialContent.description || 'What leading manufacturers say about our metal finishing services'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            {[
              { value: testimonialContent.stats.averageRating, label: "Average Rating" },
              { value: testimonialContent.stats.totalClients, label: "Industrial Clients" },
              { value: testimonialContent.stats.qualityCompliance, label: "Quality Compliance" }
            ].map((stat, index) => (
              <div key={index} className="bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1.2 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            className="pb-12"
          >
            {activeTestimonials.map((testimonial, index) => (
              <SwiperSlide key={testimonial.id}>
                {renderTestimonialCard(testimonial, index)}
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex items-center justify-center space-x-4 mt-6">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            
            <button
              onClick={toggleAutoplay}
              className="p-2 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors"
            >
              {isAutoPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 
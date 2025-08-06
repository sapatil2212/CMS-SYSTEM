'use client'

import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import Link from 'next/link';;
import { 
  ChevronRight, Check, Shield, Zap, Layers, 
  Thermometer, CircuitBoard, Car, Battery, Factory, 
  Award, ClipboardCheck, Package 
} from 'lucide-react';

interface ContentData {
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroImage?: string;
  whatIsTitle?: string;
  whatIsDescription?: string;
  whatIsImage?: string;
  whatIsBestFor?: string;
  whatIsMaterials?: string;
  whatIsAlkalineOffers?: string;
  benefitsTitle?: string;
  benefitsSubtitle?: string;
  processTitle?: string;
  processSubtitle?: string;
  applicationsTitle?: string;
  applicationsSubtitle?: string;
  industriesTitle?: string;
  industriesSubtitle?: string;
  qualityTitle?: string;
  qualityDescription?: string;
  qualityImage?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  benefits?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  processSteps?: Array<{
    step: string;
    title: string;
    description: string;
    icon: string;
  }>;
  applications?: Array<{
    title: string;
    image: string;
    items: string | string[];
  }>;
  industries?: Array<{
    name: string;
    icon: string;
    examples: string | string[];
    image: string;
  }>;
  qualityChecks?: Array<{
    title: string;
    description: string;
  }>;
}

const StainlessSteelPlating = () => {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  const defaultBenefits = [
    { icon: "Shield", title: "Superior Corrosion Resistance", description: "Exceptional resistance to rust, staining, and chemical attack" },
    { icon: "Layers", title: "High Strength", description: "Outstanding mechanical properties and durability" },
    { icon: "Thermometer", title: "Temperature Resistance", description: "Excellent performance at high and low temperatures" },
    { icon: "Award", title: "Aesthetic Finish", description: "Beautiful mirror-like or brushed surface finishes" },
    { icon: "Factory", title: "Hygienic Properties", description: "Easy to clean and maintain for food and medical applications" },
    { icon: "Battery", title: "Recyclability", description: "100% recyclable and environmentally friendly" }
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  // Auto-refresh content every 30 seconds to pick up dashboard changes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchContent();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/content/stainless-steel?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        setContent(data);
        setLastUpdate(Date.now());
      }
    } catch (error) {
      logger.error('Error fetching stainless steel content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (imageSrc: string) => {
    setImageErrors(prev => new Set(prev).add(imageSrc));
  };

  const getImageSrc = (imageSrc: string) => {
    if (imageErrors.has(imageSrc)) {
      return '/uploads/fallback/placeholder.jpg';
    }
    return `${imageSrc}?t=${lastUpdate}`;
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      Zap, Shield, Layers, Thermometer, Award, Factory, CircuitBoard, Car, Battery, ClipboardCheck, Package
    };
    const IconComponent = iconMap[iconName] || Shield;
    return <IconComponent className="h-6 w-6 text-blue-600" />;
  };

  const benefits = content?.benefits || defaultBenefits;

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="mb-20 bg-gradient-to-r from-blue-900 to-gray-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-30">
          <img 
            src={getImageSrc(content?.heroImage || "/uploads/stainless-steel/hero-stainless-steel-plating.svg")} 
            alt="Stainless steel plating process" 
            className="w-full h-full object-cover"
            loading="eager"
            onError={() => handleImageError(content?.heroImage || "/uploads/stainless-steel/hero-stainless-steel-plating.svg")}
          />
        </div>
        <div className="relative z-10 max-w-4xl">
          <span className="inline-block bg-blue-500/20 text-blue-300 text-xs md:text-sm font-medium px-3 py-1 rounded-full mb-6">
            Premium Stainless Steel Solutions
          </span>
          <h1 className="text-2xl md:text-5xl font-bold mb-6 leading-tight">
            {content?.heroTitle || "Advanced Stainless Steel Plating for Superior Performance"}
          </h1>
          <p className="text-sm md:text-xl text-blue-100 mb-8">
            {content?.heroDescription || "Premium finishing solutions for applications requiring exceptional strength, hygiene, and aesthetic appeal"}
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {content?.whatIsTitle || "What is Stainless Steel Plating?"}
            </h2>
            <p className="text-gray-600 mb-6">
              {content?.whatIsDescription || "Stainless steel plating involves applying a thin layer of stainless steel alloy to enhance corrosion resistance, strength, and appearance. This process provides exceptional protection against rust, staining, and chemical attack while maintaining the aesthetic appeal of polished steel."}
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-blue-800 font-medium">
                {content?.whatIsAlkalineOffers || "Our advanced stainless steel plating processes deliver superior corrosion resistance, hygiene properties, and aesthetic finishes for demanding industrial and commercial applications."}
              </p>
            </div>
          </div>
          <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
            <div className="mb-4 rounded-lg overflow-hidden">
              <img 
                src={getImageSrc(content?.whatIsImage || "/uploads/stainless-steel/stainless-process.jpg")} 
                alt="Stainless steel plating samples"
                className="w-full h-auto object-cover"
                loading="lazy"
                onError={() => handleImageError(content?.whatIsImage || "/uploads/stainless-steel/stainless-process.jpg")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Best For:</h4>
                <div className="text-gray-600 space-y-1">
                  {(content?.whatIsBestFor || "Corrosion resistance\nHigh-temperature applications\nFood-grade surfaces\nMedical devices\nArchitectural elements").split('\n').map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center">
                      <Check className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Materials:</h4>
                <div className="text-gray-600 space-y-1">
                  {(content?.whatIsMaterials || "Carbon steel\nMild steel\nAluminum substrates\nCopper alloys\nCast iron components").split('\n').map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center">
                      <Check className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {content?.benefitsTitle || "Key Benefits of Stainless Steel Plating"}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {content?.benefitsSubtitle || "Enhance your components with our specialized stainless steel plating solutions"}
          </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse">
                <div className="bg-gray-200 rounded-full w-12 h-12 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {getIconComponent(item.icon)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-orange-600 rounded-3xl p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-1/4 translate-y-1/4"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-xl md:text-4xl font-bold text-white mb-6">
            {content?.ctaTitle || "Ready to Enhance Your Stainless Steel Components?"}
          </h2>
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
  );
};

export default StainlessSteelPlating;
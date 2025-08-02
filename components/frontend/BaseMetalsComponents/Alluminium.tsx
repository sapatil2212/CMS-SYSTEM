'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, Check, Shield, Zap, Layers, 
  Thermometer, Plane, Car, CircuitBoard, 
  Rocket, HardHat, Battery, Factory, 
  Award, ClipboardCheck, Package, Lightbulb
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

const AluminiumPlating = () => {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  const defaultBenefits = [
    { icon: "Shield", title: "Lightweight Strength", description: "Superior strength-to-weight ratio for aerospace and automotive applications" },
    { icon: "Zap", title: "Enhanced Conductivity", description: "Improved electrical and thermal conductivity with plating" },
    { icon: "Layers", title: "Corrosion Resistance", description: "Advanced protection against oxidation and environmental damage" },
    { icon: "Thermometer", title: "Thermal Management", description: "Excellent heat dissipation for electronics and heat exchangers" },
    { icon: "Award", title: "Aesthetic Finishes", description: "Decorative and functional surface treatments" },
    { icon: "Factory", title: "Chemical Resistance", description: "Withstands harsh industrial environments" }
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
      const response = await fetch(`/api/content/aluminium?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        setContent(data);
        setLastUpdate(Date.now());
      }
    } catch (error) {
      console.error('Error fetching aluminium content:', error);
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
      Zap, Shield, Layers, Thermometer, Award, Factory, CircuitBoard, Car, Battery, ClipboardCheck, Package, Lightbulb, Rocket, HardHat, Plane
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
      <section className="mb-20 bg-gradient-to-r from-gray-900 to-blue-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-30">
          <img 
            src={getImageSrc(content?.heroImage || "/uploads/aluminium/hero-aluminium-plating.jpg")} 
            alt="Aluminium plating process" 
            className="w-full h-full object-cover"
            loading="eager"
            onError={() => handleImageError(content?.heroImage || "/uploads/aluminium/hero-aluminium-plating.jpg")}
          />
        </div>
        <div className="relative z-10 max-w-4xl">
          <span className="inline-block bg-blue-500/20 text-blue-300 text-xs md:text-sm font-medium px-3 py-1 rounded-full mb-6">
            Premium Aluminium Plating Solutions
          </span>
          <h1 className="text-2xl md:text-5xl font-bold mb-6 leading-tight">
            {content?.heroTitle || "Professional Aluminium Plating for Lightweight Excellence"}
          </h1>
          <p className="text-sm md:text-xl text-blue-100 mb-8">
            {content?.heroDescription || "Combining lightweight properties with enhanced conductivity and corrosion resistance for aerospace and automotive applications"}
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
              {content?.whatIsTitle || "What is Aluminium Plating?"}
            </h2>
            <p className="text-gray-600 mb-6">
              {content?.whatIsDescription || "Aluminium plating involves depositing a layer of aluminium onto various substrates. This process enhances the natural properties of aluminium, providing lightweight strength, improved conductivity, and corrosion resistance for demanding applications."}
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-blue-800 font-medium">
                {content?.whatIsAlkalineOffers || "Our precision aluminium plating delivers uniform finishes with excellent adhesion, combining lightweight properties with enhanced performance for aerospace and automotive applications."}
              </p>
            </div>
          </div>
          <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
            <div className="mb-4 rounded-lg overflow-hidden">
              <img 
                src={getImageSrc(content?.whatIsImage || "/uploads/aluminium/aluminium-process.jpg")} 
                alt="Aluminium plating samples"
                className="w-full h-auto object-cover"
                loading="lazy"
                onError={() => handleImageError(content?.whatIsImage || "/uploads/aluminium/aluminium-process.jpg")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Best For:</h4>
                <div className="text-gray-600 space-y-1">
                  {(content?.whatIsBestFor || "Aerospace components\nAutomotive parts\nElectronics housings\nHeat exchangers\nLightweight structures").split('\n').map((item: string, idx: number) => (
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
                  {(content?.whatIsMaterials || "Steel substrates\nIron components\nZinc die castings\nPlastic housings\nComposite materials").split('\n').map((item: string, idx: number) => (
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
            {content?.benefitsTitle || "Key Benefits of Aluminium Plating"}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {content?.benefitsSubtitle || "Enhance your components with our specialized aluminium plating solutions"}
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

      {/* Process Steps Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {content?.processTitle || "Our Aluminium Plating Process"}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {content?.processSubtitle || "Precision techniques for consistent, high-quality aluminium finishes"}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {(content?.processSteps || [
            { step: "1", title: "Surface Preparation", description: "Comprehensive cleaning and surface activation for optimal aluminium adhesion", icon: "ClipboardCheck" },
            { step: "2", title: "Zinc Immersion", description: "Zincate treatment for enhanced aluminium deposition on substrates", icon: "Layers" },
            { step: "3", title: "Aluminium Deposition", description: "Controlled electroplating in specialized aluminium solution baths", icon: "Zap" },
            { step: "4", title: "Quality Verification", description: "Thickness testing, conductivity measurement, and adhesion verification", icon: "Award" },
            { step: "5", title: "Protective Finishing", description: "Clear coating application and secure packaging for delivery", icon: "Package" }
          ]).map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 text-center">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                {step.step}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Applications Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {content?.applicationsTitle || "Aluminium Plating Applications"}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {content?.applicationsSubtitle || "Versatile solutions for lightweight and conductive requirements"}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(content?.applications || [
            { title: "Aerospace Components", image: "/uploads/aluminium/aerospace-components.jpg", items: ["Fuselage parts", "Landing gear", "Avionics housings", "Engine components"] },
            { title: "Automotive Parts", image: "/uploads/aluminium/automotive-parts.jpg", items: ["Battery enclosures", "Motor components", "Structural parts", "Heat exchangers"] },
            { title: "Electronics & Heat Sinks", image: "/uploads/aluminium/electronics-heatsinks.jpg", items: ["Heat sinks", "Connectors", "RF shielding", "Antenna components"] }
          ]).map((application, index) => {
            const items = Array.isArray(application.items) ? application.items : JSON.parse(application.items || '[]');
            return (
              <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={getImageSrc(application.image)} 
                    alt={application.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={() => handleImageError(application.image)}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{application.title}</h3>
                  <ul className="space-y-2">
                    {items.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Industries Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {content?.industriesTitle || "Industries We Serve"}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {content?.industriesSubtitle || "Aluminium plating solutions across diverse sectors requiring lightweight and conductive properties"}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(content?.industries || [
            { name: "Aerospace & Aviation", icon: "Rocket", examples: ["Aircraft components", "Satellite parts", "Avionics systems", "Engine parts"], image: "/uploads/aluminium/aerospace-industry.jpg" },
            { name: "Automotive & EV", icon: "Car", examples: ["Electric vehicles", "Hybrid systems", "Automotive electronics", "Battery systems"], image: "/uploads/aluminium/automotive-industry.jpg" },
            { name: "Electronics", icon: "CircuitBoard", examples: ["Consumer electronics", "Industrial electronics", "Telecommunications", "Heat management"], image: "/uploads/aluminium/electronics-industry.jpg" },
            { name: "Defence & Security", icon: "Shield", examples: ["Military equipment", "Security systems", "Armor components", "Communication gear"], image: "/uploads/aluminium/defence-industry.jpg" }
          ]).map((industry, index) => {
            const examples = Array.isArray(industry.examples) ? industry.examples : JSON.parse(industry.examples || '[]');
            return (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  {getIconComponent(industry.icon)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{industry.name}</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {examples.map((example: string, idx: number) => (
                    <li key={idx}>{example}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quality Section */}
      <section className="mb-20">
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {content?.qualityTitle || "Quality Assurance"}
              </h2>
              <p className="text-gray-600 mb-8">
                {content?.qualityDescription || "Each aluminium-plated component is thoroughly tested for conductivity, thermal performance, and corrosion resistance to meet industry standards"}
              </p>
              <div className="space-y-4">
                {(content?.qualityChecks || [
                  { title: "Conductivity Testing", description: "Electrical and thermal conductivity measurement and verification" },
                  { title: "Thickness Control", description: "Precision measurement for uniform coating thickness" },
                  { title: "Adhesion Testing", description: "Bond strength verification through standardized test methods" },
                  { title: "Corrosion Resistance", description: "Salt spray testing and environmental exposure verification" }
                ]).map((check, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-lg mr-4 mt-1">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{check.title}</h4>
                      <p className="text-gray-600 text-sm">{check.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <img 
                src={getImageSrc(content?.qualityImage || "/uploads/aluminium/quality-testing.jpg")} 
                alt="Quality control process"
                className="w-full h-auto rounded-lg"
                loading="lazy"
                onError={() => handleImageError(content?.qualityImage || "/uploads/aluminium/quality-testing.jpg")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-gray-600 rounded-3xl p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-1/4 translate-y-1/4"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-xl md:text-4xl font-bold text-white mb-6">
            {content?.ctaTitle || "Ready to Enhance Your Aluminium Components?"}
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

export default AluminiumPlating;
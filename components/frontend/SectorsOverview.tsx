"use client";

import React, { useState, useEffect } from 'react';
import { FiArrowRight, FiMail, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { logger } from '@/lib/logger';
import {  useRouter  } from 'next/navigation';;

interface Sector {
  id: string;
  name: string;
  description: string;
  details: string;
  image?: string;
  category: string;
  features: string[];
  applications: string[];
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SectorsOverviewContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  whyChooseTitle: string;
  whyChooseDescription: string;
  whyChooseFeatures: string[];
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const Sectors = () => {
  const router = useRouter();
  const [expandedSector, setExpandedSector] = useState<number | null>(null);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [content, setContent] = useState<SectorsOverviewContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch sectors and content in parallel
      const [sectorsResponse, contentResponse] = await Promise.all([
        fetch('/api/sectors'),
        fetch('/api/sectors-overview')
      ]);

      if (sectorsResponse.ok && contentResponse.ok) {
        const [sectorsData, contentData] = await Promise.all([
          sectorsResponse.json(),
          contentResponse.json()
        ]);

        setSectors(sectorsData);
        setContent(contentData);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      logger.error('Error fetching data:', error);
      setError('Failed to load sectors data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSector = (index: number) => {
    setExpandedSector(expandedSector === index ? null : index);
  };

  const handleConsultationClick = () => {
    if (content?.ctaLink) {
      router.push(content.ctaLink);
    } else {
      router.push('/contact');
    }
  };

  const getSectorImage = (sector: Sector) => {
    if (sector.image) {
      return sector.image;
    }
    // Fallback to placeholder image
    return '/assets/sectors/placeholder.svg';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!content || sectors.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-gray-600 text-lg">No content available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{content.title}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          {content.subtitle}
        </p>
        <p className="text-lg text-gray-700 max-w-5xl mx-auto">
          {content.description}
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {sectors.map((sector, index) => (
          <div 
            key={sector.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="h-48 bg-gray-200 overflow-hidden">
              <img 
                src={getSectorImage(sector)} 
                alt={sector.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/assets/sectors/placeholder.svg';
                }}
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{sector.name}</h2>
              <p className="text-gray-600 mb-4">{sector.description}</p>
              
              <button 
                onClick={() => toggleSector(index)}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                {expandedSector === index ? (
                  <>
                    <span>Show less</span>
                    <FiChevronUp className="ml-1" />
                  </>
                ) : (
                  <>
                    <span>Learn more</span>
                    <FiChevronDown className="ml-1" />
                  </>
                )}
              </button>
              
              {expandedSector === index && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-gray-700">{sector.details}</p>
                  <button 
                    onClick={handleConsultationClick}
                    className="mt-4 flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    {content.ctaText}
                    <FiArrowRight className="ml-2" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 rounded-xl p-8 md:p-12 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.whyChooseTitle}</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {content.whyChooseFeatures.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-blue-600 font-medium">✓ {item}</div>
              </div>
            ))}
          </div>
          <p className="text-lg text-gray-700 mb-6">
            {content.whyChooseDescription}
          </p>
          <button
            onClick={handleConsultationClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
          >
            {content.ctaText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sectors;
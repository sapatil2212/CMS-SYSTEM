'use client'

import React, { useState, useEffect } from 'react';
import { Mail, Settings, CheckCircle, Package, ArrowRight } from 'lucide-react';

interface OrderProcessStep {
  id: string
  title: string
  description: string
  details: string[]
  icon: string
  order: number
  gradientFrom: string
  gradientTo: string
  bgColor: string
  borderColor: string
  textColor: string
}

const OrderProcess = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [steps, setSteps] = useState<OrderProcessStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderProcessSteps();
  }, []);

  const fetchOrderProcessSteps = async () => {
    try {
      const response = await fetch('/api/content/home-order-process');
      if (response.ok) {
        const data = await response.json();
        setSteps(data);
      }
    } catch (error) {
      console.error('Failed to fetch order process steps:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="mt-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="inline-flex items-center justify-center mb-6 bg-blue-600/10 backdrop-blur-sm px-6 py-2 rounded-full border border-blue-500/20">
                <div className="h-5 w-5 bg-blue-600/20 rounded mr-2"></div>
                <div className="h-4 w-32 bg-blue-600/20 rounded"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded mb-6 mx-auto w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded mx-auto w-2/3"></div>
            </div>
          </div>

          {/* Steps Grid Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border-2 border-gray-200 p-8 animate-pulse">
                <div className="absolute -top-4 left-8">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                </div>
                <div className="w-14 h-14 rounded-xl bg-gray-200 mb-6"></div>
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2 mt-4">
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
           <div className="inline-flex items-center justify-center mb-6 bg-blue-600/10 backdrop-blur-sm px-6 py-2 rounded-full border border-blue-500/20">
        <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="text-xs sm:text-sm font-medium text-blue-800 tracking-widest">  Simple & Efficient Process</span>
      </div>
         
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            From Inquiry to{' '}
            <span className="text-blue-700 ">
              Delivery
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At Alkalyne Surface Technologies, we've streamlined metal finishing to be seamless and transparent every step of the way.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps
            .sort((a, b) => a.order - b.order)
            .map((step, index) => (
            <div
              key={step.id}
              className={`group relative bg-white rounded-2xl border-2 ${step.borderColor} p-8 transition-all duration-300 hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 cursor-pointer ${
                activeStep === step.order ? 'ring-1 ring-blue/20 ring-offset-2' : ''
              }`}
              onMouseEnter={() => setActiveStep(step.order)}
              onMouseLeave={() => setActiveStep(null)}
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-8">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.gradientFrom} ${step.gradientTo} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                  {step.order}
                </div>
              </div>

              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${step.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <span className={`text-2xl ${step.textColor}`}>{step.icon}</span>
              </div>

              {/* Content */}
              <h3 className={`text-xl font-bold text-gray-900 mb-3 group-hover:${step.textColor} transition-colors`}>
                {step.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {step.description}
              </p>

              {/* Details */}
              <div className="space-y-3">
                {step.details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${step.gradientFrom} ${step.gradientTo} flex-shrink-0`} />
                    <span className="text-gray-700 text-sm">{detail}</span>
                  </div>
                ))}
              </div>

              {/* Hover Arrow */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrderProcess; 
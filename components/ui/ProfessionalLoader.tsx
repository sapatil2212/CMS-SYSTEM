'use client'

import React from 'react'

interface ProfessionalLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  title: string
  subtitle: string
}

const ProfessionalLoader: React.FC<ProfessionalLoaderProps> = ({ 
  size = 'lg', 
  title, 
  subtitle 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <style jsx>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes rotate-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        
        .spinner-outer {
          animation: rotate 2s linear infinite;
        }
        
        .spinner-middle {
          animation: rotate-reverse 1.5s linear infinite;
        }
        
        .spinner-inner {
          animation: rotate 3s linear infinite;
        }
        
        .fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .dot-1 { animation: bounce-dot 1.4s infinite 0.1s; }
        .dot-2 { animation: bounce-dot 1.4s infinite 0.2s; }
        .dot-3 { animation: bounce-dot 1.4s infinite 0.3s; }
      `}</style>
      
      {/* Professional Multi-Ring Spinner */}
      <div className="relative">
        <div className={`${sizeClasses[size]} relative`}>
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-500 spinner-outer opacity-90"></div>
          
          {/* Middle ring */}
          <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-purple-500 border-l-purple-400 spinner-middle opacity-70"></div>
          
          {/* Inner ring */}
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-indigo-500 border-b-indigo-400 spinner-inner opacity-50"></div>
          
          {/* Center dot with pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-10 blur-md animate-pulse"></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute -top-2 -left-2 h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce opacity-60" 
             style={{ animationDelay: '0.1s' }}></div>
        <div className="absolute -top-2 -right-2 h-1 w-1 bg-purple-400 rounded-full animate-bounce opacity-60" 
             style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute -bottom-2 -left-2 h-1 w-1 bg-indigo-400 rounded-full animate-bounce opacity-60" 
             style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute -bottom-2 -right-2 h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce opacity-60" 
             style={{ animationDelay: '0.7s' }}></div>
      </div>
      
      {/* Loading text with animations */}
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 fade-in-up">
          {title}
        </h3>
        <p className="text-gray-600 fade-in-up" style={{ animationDelay: '0.2s' }}>
          {subtitle}
        </p>
        
        {/* Animated loading dots */}
        <div className="flex justify-center mt-4 space-x-1">
          <div className="h-2 w-2 bg-blue-500 rounded-full dot-1"></div>
          <div className="h-2 w-2 bg-purple-500 rounded-full dot-2"></div>
          <div className="h-2 w-2 bg-indigo-500 rounded-full dot-3"></div>
        </div>
      </div>
    </div>
  )
}

export default ProfessionalLoader
'use client'

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Sparkles, RefreshCw } from "lucide-react";

interface GalleryImage {
  id: string
  title: string
  description: string
  image: string
  order: number
  isActive: boolean
}

interface GalleryContent {
  title: string
  subtitle: string
  description: string
}

const HomeGallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Data states
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryContent, setGalleryContent] = useState<GalleryContent>({
    title: '',
    subtitle: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const totalSlides = galleryImages.filter(img => img.isActive).length;

  // Determine images per view based on screen size
  const getImagesPerView = () => {
    if (windowWidth < 768) return 1;
    if (windowWidth < 1024) return 2;
    return 3;
  };

  const imagesPerView = getImagesPerView();
  const activeImages = galleryImages.filter(img => img.isActive).sort((a, b) => a.order - b.order);
  const extendedImages = [...activeImages, ...activeImages.slice(0, imagesPerView)];
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // Fetch gallery data
  useEffect(() => {
    fetchGalleryData();
    
    // Refresh data every 30 seconds to catch updates
    const interval = setInterval(() => {
      fetchGalleryData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchGalleryData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    }
    
    try {
      const [imagesResponse, contentResponse] = await Promise.all([
        fetch('/api/content/gallery-images'),
        fetch('/api/content/gallery-content')
      ]);

      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json();
        setGalleryImages(imagesData);
      }

      if (contentResponse.ok) {
        const contentData = await contentResponse.json();
        setGalleryContent(contentData);
      }
    } catch (error) {
      console.error('Failed to fetch gallery data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (totalSlides > 0) {
      const timer = setInterval(() => nextSlide(), 5000);
      return () => clearInterval(timer);
    }
  }, [currentIndex, totalSlides]);

  // Handle transition end
  useEffect(() => {
    const handleTransitionEnd = () => {
      if (currentIndex >= totalSlides) {
        setIsTransitioning(false);
        setCurrentIndex(0);
      } else {
        setIsTransitioning(false);
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("transitionend", handleTransitionEnd);
      return () => carousel.removeEventListener("transitionend", handleTransitionEnd);
    }
  }, [currentIndex, totalSlides]);

  const nextSlide = () => {
    if (totalSlides === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (totalSlides === 0) return;
    if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(totalSlides - 1);
      setTimeout(() => {
        setIsTransitioning(true);
        setCurrentIndex(totalSlides - 1);
      }, 50);
    } else {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  const getTransformValue = () => {
    const slideWidth = 100 / imagesPerView;
    return `translateX(-${currentIndex * slideWidth}%)`;
  };

  // Modal functions
  const openModal = (index: number) => {
    setModalImageIndex(index % totalSlides);
    setIsModalOpen(true);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextModalImage = () => {
    setModalImageIndex((prev) => (prev + 1) % totalSlides);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const prevModalImage = () => {
    setModalImageIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  const zoomOut = () => {
    setZoomLevel((prev) => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) setImagePosition({ x: 0, y: 0 });
      return newZoom;
    });
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      switch (e.key) {
        case 'Escape': closeModal(); break;
        case 'ArrowLeft': prevModalImage(); break;
        case 'ArrowRight': nextModalImage(); break;
        case '+':
        case '=': zoomIn(); break;
        case '-': zoomOut(); break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Handle mouse drag for zoomed images
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  if (loading) {
    return (
      <section className="bg-white py-12 md:py-0 mt-16">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-8 md:mb-16">
            <div className="inline-flex items-center justify-center mb-6 bg-blue-600/10 backdrop-blur-sm px-6 py-2 rounded-full border border-blue-500/20">
              <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-xs sm:text-sm font-medium text-blue-800 tracking-widest">Loading gallery...</span>
            </div>
            <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
          </div>
          <div className="relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 md:h-96 lg:h-[28rem] bg-gray-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (totalSlides === 0) {
    return null;
  }

  return (
    <>
      <section className="bg-white py-12 md:py-0 mt-16">
        <div className="container mx-auto px-6 md:px-8">
          {/* Luxury Heading Section */}
          <div className="text-center mb-8 md:mb-16 relative">
            <div className="inline-flex items-center justify-center mb-6 bg-blue-600/10 backdrop-blur-sm px-6 py-2 rounded-full border border-blue-500/20">
              <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-xs sm:text-sm font-medium text-blue-800 tracking-widest">
                {galleryContent.subtitle || 'Precision Unleashed'}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 font-inter">
              {galleryContent.title || 'Our Advanced Plating & Surface Finishing Facilities'}
            </h2>
            {galleryContent.description && (
              <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
                {galleryContent.description}
              </p>
            )}
            {/* Refresh Button */}
            <button
              onClick={() => fetchGalleryData(true)}
              disabled={refreshing}
              className="absolute top-0 right-0 p-2 text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50"
              title="Refresh gallery data"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Gallery Carousel */}
          <div className="relative overflow-hidden group">
            {/* Navigation Arrows - Hidden on mobile by default, shown on hover */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-gray-50 transition-all z-10 focus:outline-none group/btn
                         md:opacity-100 opacity-0 group-hover:opacity-100 
                         translate-x-[-100%] group-hover:translate-x-0 md:translate-x-0"
              aria-label="Previous slide"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-800 text-white group-hover/btn:bg-blue-600 transition-colors">
                <ChevronLeft size={24} />
              </div>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-gray-50 transition-all z-10 focus:outline-none group/btn
                         md:opacity-100 opacity-0 group-hover:opacity-100 
                         translate-x-[100%] group-hover:translate-x-0 md:translate-x-0"
              aria-label="Next slide"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-800 text-white group-hover/btn:bg-blue-600 transition-colors">
                <ChevronRight size={24} />
              </div>
            </button>

            {/* Carousel Container */}
            <div className="carousel-container overflow-hidden mx-2 md:mx-4">
              <div
                ref={carouselRef}
                className={`flex ${
                  isTransitioning ? "transition-transform duration-700 ease-out" : ""
                }`}
                style={{ transform: getTransformValue() }}
              >
                {extendedImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={`${
                      windowWidth < 768 ? "w-full" : windowWidth < 1024 ? "w-1/2" : "w-1/3"
                    } flex-shrink-0 px-2 md:px-3`}
                  >
                    <div className="relative overflow-hidden rounded-xl h-80 md:h-96 lg:h-[28rem] group/card cursor-pointer transition-all duration-300 hover:shadow-3xl">
                      <img
                        src={image.image}
                        alt={image.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                        onClick={() => openModal(index)}
                      />
                      {/* Luxury overlay effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex items-end p-6">
                        <div className="text-white">
                          <h3 className="text-lg font-semibold mb-1">{image.title}</h3>
                          {image.description && (
                            <p className="text-sm text-gray-200">{image.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-8 space-x-2">
            {activeImages.slice(0, Math.min(5, totalSlides)).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex % totalSlides === index ? "bg-blue-600 w-6" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Modal */}
      {isModalOpen && activeImages.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 p-2 text-white hover:text-blue-400 transition-colors z-60"
            aria-label="Close modal"
          >
            <X size={36} className="opacity-80 hover:opacity-100" />
          </button>

          {/* Zoom Controls */}
          <div className="absolute top-6 left-6 flex gap-3 z-60">
            <button
              onClick={zoomIn}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-lg"
              disabled={zoomLevel >= 3}
              aria-label="Zoom in"
            >
              <ZoomIn size={24} />
            </button>
            <button
              onClick={zoomOut}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-lg"
              disabled={zoomLevel <= 1}
              aria-label="Zoom out"
            >
              <ZoomOut size={24} />
            </button>
          </div>

          {/* Image Counter */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-white bg-blue-600 px-4 py-2 rounded-full z-60 font-medium">
            {modalImageIndex + 1} / {totalSlides}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevModalImage}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 p-4 text-white hover:text-blue-400 transition-colors z-60 group"
            aria-label="Previous image"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-blue-600 rounded-full group-hover:bg-blue-700 transition-colors shadow-lg">
              <ChevronLeft size={32} />
            </div>
          </button>

          {/* Main Image */}
          <div className="max-w-full max-h-full flex items-center justify-center overflow-hidden">
            <img
              src={activeImages[modalImageIndex]?.image}
              alt={activeImages[modalImageIndex]?.title}
              className="max-w-full max-h-full object-contain transition-transform duration-200 cursor-grab active:cursor-grabbing"
              style={{
                transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
                cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
              onMouseDown={handleMouseDown}
              draggable={false}
            />
          </div>

          <button
            onClick={nextModalImage}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 p-4 text-white hover:text-blue-400 transition-colors z-60 group"
            aria-label="Next image"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-blue-600 rounded-full group-hover:bg-blue-700 transition-colors shadow-lg">
              <ChevronRight size={32} />
            </div>
          </button>

          {/* Thumbnail Navigation */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 bg-black/50 p-3 rounded-full backdrop-blur-sm">
            {activeImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => {
                  setModalImageIndex(index);
                  setZoomLevel(1);
                  setImagePosition({ x: 0, y: 0 });
                }}
                className={`w-16 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                  index === modalImageIndex ? 'border-blue-400' : 'border-transparent hover:border-white/50'
                }`}
              >
                <img
                  src={image.image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default HomeGallery; 
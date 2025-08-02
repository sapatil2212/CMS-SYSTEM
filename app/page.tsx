import { Suspense } from 'react'
import HeroSlider from '@/components/frontend/HeroSlider'
import HomeAboutSection from '@/components/frontend/HomeComponents/HomeAboutSection'
import HomeProcesses from '@/components/frontend/HomeComponents/HomeProcesses'
import HomeOrderProcess from '@/components/frontend/HomeComponents/HomeOrderProcess'
import WhyChooseUs from '@/components/frontend/HomeComponents/WhyChooseUs'
import HomeGallery from '@/components/frontend/HomeComponents/HomeGallery'
import Testimonials from '@/components/frontend/HomeComponents/Testimonials'
import AboutSection from '@/components/frontend/AboutSection'
import ServicesSection from '@/components/frontend/ServicesSection'
import ContactSection from '@/components/frontend/ContactSection'
import OfferPopup from '@/components/frontend/OfferPopup'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<div className="h-96 bg-gray-200 animate-pulse" />}>
        <HeroSlider />
      </Suspense>
      <Suspense fallback={<div className="py-20 bg-gray-100" />}>
        <HomeAboutSection />
      </Suspense>
      <Suspense fallback={<div className="py-20 bg-gray-100" />}>
        <HomeProcesses />
      </Suspense>
      <Suspense fallback={<div className="py-20 bg-gray-100" />}>
        <HomeOrderProcess />
      </Suspense>
      <Suspense fallback={<div className="py-20 bg-gray-100" />}>
        <WhyChooseUs />
      </Suspense>
      <Suspense fallback={<div className="py-20 bg-gray-100" />}>
        <HomeGallery />
      </Suspense>
      <Suspense fallback={<div className="py-20 bg-gray-100" />}>
        <Testimonials />
      </Suspense>
      
      {/* Offer Popup Modal */}
      <OfferPopup />
    </main>
  )
} 
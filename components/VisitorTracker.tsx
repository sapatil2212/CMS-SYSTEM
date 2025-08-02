'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function VisitorTracker() {
  const pathname = usePathname()
  const hasTrackedRef = useRef(false)

  useEffect(() => {
    // Only track visits on frontend pages, not admin pages
    if (pathname.startsWith('/admin')) {
      return
    }

    // Only track on homepage (root path)
    if (pathname !== '/') {
      return
    }

    // Check if we've already tracked this session
    const hasTracked = sessionStorage.getItem('visitorTracked')
    if (hasTracked || hasTrackedRef.current) {
      return
    }

    // Mark as tracking to prevent double calls
    hasTrackedRef.current = true

    const trackVisitor = async () => {
      try {
        console.log('VisitorTracker: Tracking visitor visit on homepage')
        const response = await fetch('/api/visitors/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          console.log('VisitorTracker: Visit tracked successfully:', data)
          // Mark as tracked for this session
          sessionStorage.setItem('visitorTracked', 'true')
        } else {
          console.error('VisitorTracker: Failed to track visit:', response.status)
          // Reset tracking flag on failure
          hasTrackedRef.current = false
        }
      } catch (error) {
        console.error('VisitorTracker: Error tracking visit:', error)
        // Reset tracking flag on error
        hasTrackedRef.current = false
      }
    }

    // Track visitor only on homepage and only once per session
    trackVisitor()
  }, [pathname])

  // This component doesn't render anything
  return null
} 
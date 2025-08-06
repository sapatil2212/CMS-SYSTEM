'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger';
import {  toast  } from 'react-hot-toast';

interface ContentUpdateNotifierProps {
  onContentSaved: () => void
}

const ContentUpdateNotifier: React.FC<ContentUpdateNotifierProps> = ({ onContentSaved }) => {
  useEffect(() => {
    // Listen for custom events from the admin dashboard
    const handleContentUpdate = (event: CustomEvent) => {
      const { slug, type } = event.detail
      logger.log(`Content updated for ${slug} (${type})`)
      
      // Notify other components to refresh
      onContentSaved()
      
      // Don't show toast here - the admin component will handle the success modal
    }

    window.addEventListener('contentUpdated', handleContentUpdate as EventListener)
    
    return () => {
      window.removeEventListener('contentUpdated', handleContentUpdate as EventListener)
    }
  }, [onContentSaved])

  return null
}

export default ContentUpdateNotifier
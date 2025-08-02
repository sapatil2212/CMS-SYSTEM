'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/frontend/Header'
import Footer from '@/components/frontend/Footer'

interface FrontendLayoutProps {
  children: React.ReactNode
}

export default function FrontendLayout({ children }: FrontendLayoutProps) {
  const pathname = usePathname()
  
  // Check if this is an admin page
  const isAdminPage = pathname.startsWith('/admin')
  
  // Check if this is login or signup page
  const isAuthPage = pathname === '/login' || pathname === '/signup'
  
  // Hide header and footer for admin pages and auth pages
  const shouldHideHeaderFooter = isAdminPage || isAuthPage
  
  return (
    <>
      {!shouldHideHeaderFooter && <Header />}
      <main>
        {children}
      </main>
      {!shouldHideHeaderFooter && <Footer />}
    </>
  )
} 
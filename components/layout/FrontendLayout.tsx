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
  
  return (
    <>
      {!isAdminPage && <Header />}
      <main>
        {children}
      </main>
      {!isAdminPage && <Footer />}
    </>
  )
} 
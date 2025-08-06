import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/lib/auth-provider'
import FrontendLayout from '@/components/layout/FrontendLayout'
import VisitorTracker from '@/components/VisitorTracker'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'High-Precision Metal Plating & Finishing Services | Alkalyne Metal Plating Services in Nashik',
  description: 'Leading provider of advanced plating and surface treatment solutions for eco-conscious manufacturing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/assets/svg.png" />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        <AuthProvider>
          <VisitorTracker />
          <FrontendLayout>
            {children}
          </FrontendLayout>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
} 
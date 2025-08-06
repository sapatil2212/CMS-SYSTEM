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
  title: 'ALKALYNE - Advancing Eco-Conscious Technologies',
  description: 'Leading provider of advanced plating and surface treatment solutions for eco-conscious manufacturing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
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
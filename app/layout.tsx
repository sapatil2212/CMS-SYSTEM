import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/lib/auth-provider'
import FrontendLayout from '@/components/layout/FrontendLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CMS System',
  description: 'Full-stack CMS system with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <FrontendLayout>
            {children}
          </FrontendLayout>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
} 
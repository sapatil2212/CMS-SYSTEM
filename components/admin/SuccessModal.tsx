'use client'

import { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

interface SuccessModalProps {
  isOpen: boolean
  message: string
  onClose: () => void
}

export default function SuccessModal({ isOpen, message, onClose }: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 1500) // Show for 1.5 seconds

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <p className="text-center text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  )
} 
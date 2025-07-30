'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react'

export type ModalType = 'success' | 'error' | 'warning'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  type: ModalType
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false
}: ConfirmationModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm()
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
    }
  }

  const getIcon = () => {
    const iconClasses = "w-12 h-12"
    
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClasses} text-green-600`} />
      case 'error':
        return <XCircle className={`${iconClasses} text-red-600`} />
      case 'warning':
        return <AlertTriangle className={`${iconClasses} text-yellow-600`} />
      default:
        return <AlertTriangle className={`${iconClasses} text-blue-600`} />
    }
  }

  const getButtonStyles = () => {
    switch (type) {
      case 'success':
        return {
          confirm: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
          cancel: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }
      case 'error':
        return {
          confirm: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          cancel: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }
      case 'warning':
        return {
          confirm: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          cancel: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }
      default:
        return {
          confirm: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          cancel: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }
    }
  }

  if (!isVisible) return null

  const buttonStyles = getButtonStyles()

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-200 ${
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative w-full max-w-md transform rounded-lg bg-white p-6 text-left shadow-xl transition-all duration-200 ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-sm text-gray-600 text-center mb-6">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 ${buttonStyles.cancel}`}
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50 ${buttonStyles.confirm}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 
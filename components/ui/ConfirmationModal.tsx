'use client'

import { Dialog } from '@headlessui/react'
import { 
  ExclamationTriangleIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  type?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  type = 'danger',
  loading = false
}: ConfirmationModalProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        }
      case 'warning':
        return {
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
        }
      case 'info':
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        }
      default:
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        }
    }
  }

  const styles = getTypeStyles()

  const handleConfirm = () => {
    if (!loading) {
      onConfirm()
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  return (
    <Dialog 
      open={isOpen} 
      onClose={handleClose} 
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-xl shadow-2xl">
          <div className="p-6">
            <div className="flex items-start">
              <div className={`flex-shrink-0 ${styles.iconBg} rounded-full p-2`}>
                <ExclamationTriangleIcon 
                  className={`h-6 w-6 ${styles.iconColor}`} 
                  aria-hidden="true" 
                />
              </div>
              
              <div className="ml-4 flex-1">
                <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
                  {title}
                </Dialog.Title>
                <Dialog.Description className="text-sm text-gray-600 leading-relaxed">
                  {message}
                </Dialog.Description>
              </div>

              <button
                onClick={handleClose}
                disabled={loading}
                className="ml-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors ${styles.confirmButton}`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  confirmLabel
                )}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
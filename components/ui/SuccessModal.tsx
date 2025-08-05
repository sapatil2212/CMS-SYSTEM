'use client'

import { Dialog } from '@headlessui/react'
import { 
  CheckCircleIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline'
import { useEffect } from 'react'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  actionLabel?: string
  autoCloseAfter?: number // milliseconds
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  actionLabel = 'Continue',
  autoCloseAfter
}: SuccessModalProps) {

  useEffect(() => {
    if (isOpen && autoCloseAfter) {
      const timer = setTimeout(() => {
        onClose()
      }, autoCloseAfter)

      return () => clearTimeout(timer)
    }
  }, [isOpen, autoCloseAfter, onClose])

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-xl shadow-2xl">
          <div className="p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                <CheckCircleIcon 
                  className="h-6 w-6 text-green-600" 
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
                onClick={onClose}
                className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                {actionLabel}
              </button>
            </div>

            {autoCloseAfter && (
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">
                  This modal will close automatically in {Math.ceil(autoCloseAfter / 1000)} seconds
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                  <div 
                    className="bg-green-600 h-1 rounded-full transition-all duration-1000 ease-linear"
                    style={{
                      animation: `shrink ${autoCloseAfter}ms linear forwards`
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </Dialog>
  )
}
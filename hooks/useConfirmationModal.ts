import { useState, useCallback } from 'react'
import { ModalType } from '@/components/admin/ConfirmationModal'

interface ConfirmationModalState {
  isOpen: boolean
  type: ModalType
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
}

export function useConfirmationModal() {
  const [modalState, setModalState] = useState<ConfirmationModalState>({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel'
  })

  const showConfirmation = useCallback((
    type: ModalType,
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText?: string,
    cancelText?: string
  ) => {
    setModalState({
      isOpen: true,
      type,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm
    })
  }, [])

  const hideConfirmation = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }))
  }, [])

  const handleConfirm = useCallback(() => {
    if (modalState.onConfirm) {
      modalState.onConfirm()
    }
    hideConfirmation()
  }, [modalState.onConfirm, hideConfirmation])

  return {
    modalState,
    showConfirmation,
    hideConfirmation,
    handleConfirm
  }
} 
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-provider'

interface ProfileFormData {
  name: string
  email: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface OTPFormData {
  otp: string
  newEmail?: string
  newPassword?: string
  confirmPassword?: string
}

export default function ProfileManagement() {
  const { user, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [otpAction, setOtpAction] = useState<'email' | 'password'>('email')
  const [pendingEmail, setPendingEmail] = useState('')
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [otpData, setOtpData] = useState<OTPFormData>({
    otp: ''
  })

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }))
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleOTPInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setOtpData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const updateProfile = async () => {
    if (!user) return

    setIsLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        if (data.requiresOTP) {
          // Email change requires OTP verification
          setOtpAction('email')
          setPendingEmail(formData.email)
          setShowOTPModal(true)
          setMessage('OTP sent to your current email for verification')
        } else {
          setMessage(data.message)
          // Clear password fields
          setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }))
        }
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOTP = async () => {
    if (!user) return

    setIsLoading(true)
    setError('')

    try {
      if (otpAction === 'email') {
        // Verify email change OTP
        const response = await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: user.id,
            otp: otpData.otp,
            newEmail: pendingEmail
          })
        })

        const data = await response.json()

        if (response.ok) {
          setMessage(data.message)
          setShowOTPModal(false)
          setOtpData({ otp: '' })
          setPendingEmail('')
          // Refresh user data
          window.location.reload()
        } else {
          setError(data.error)
        }
      } else {
        // Verify password reset OTP
        const response = await fetch('/api/auth/reset-password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: user.email,
            otp: otpData.otp,
            newPassword: otpData.newPassword
          })
        })

        const data = await response.json()

        if (response.ok) {
          setMessage(data.message)
          setShowOTPModal(false)
          setOtpData({ otp: '' })
          // Clear password fields
          setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }))
        } else {
          setError(data.error)
        }
      }
    } catch (error) {
      setError('Failed to verify OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const requestPasswordReset = async () => {
    if (!user) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email
        })
      })

      const data = await response.json()

      if (response.ok) {
        setOtpAction('password')
        setShowOTPModal(true)
        setMessage(data.message)
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('Failed to request password reset')
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    if (formData.newPassword && !formData.currentPassword) {
      setError('Current password is required to change password')
      return false
    }
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      return false
    }
    if (formData.newPassword && formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return false
    }
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!validateForm()) return

    updateProfile()
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      

      {/* Success/Error Messages */}
      {message && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{message}</p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h3>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Changing your email will require OTP verification
                </p>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="role"
                    value={user?.role || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    disabled
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </div>
                ) : (
                  'Update Profile'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Password Management Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Security Settings
            </h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.current ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.new ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.confirm ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </div>
                  ) : (
                    'Change Password'
                  )}
                </button>

                <button
                  type="button"
                  onClick={requestPasswordReset}
                  disabled={isLoading}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto">
            <div className="px-6 py-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-primary-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                {otpAction === 'email' ? 'Email Change Verification' : 'Password Reset Verification'}
              </h3>
              
              <p className="text-sm text-gray-600 text-center mb-6">
                {otpAction === 'email' 
                  ? 'Enter the OTP sent to your current email address to complete the email change.'
                  : 'Enter the OTP sent to your email address to reset your password.'
                }
              </p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={otpData.otp}
                    onChange={handleOTPInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center text-lg font-mono"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>

                {otpAction === 'password' && (
                  <>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={otpData.newPassword || ''}
                        onChange={handleOTPInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={otpData.confirmPassword || ''}
                        onChange={handleOTPInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={verifyOTP}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </div>
                  ) : (
                    'Verify OTP'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowOTPModal(false)
                    setOtpData({ otp: '' })
                    setPendingEmail('')
                  }}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
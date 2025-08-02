'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-provider'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Edit3, 
  Check, 
  X, 
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Smartphone
} from 'lucide-react'

interface ProfileData {
  name: string
  email: string
  role: string
  createdAt: string
}

interface FormData {
  name: string
  email: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const spinnerClass = `
  inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]
`

const SuccessModal = ({ isOpen, message, onClose }: { isOpen: boolean; message: string; onClose: () => void }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 relative shadow-xl"
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="mb-4 mt-1">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-600"
            >
              <Check className="h-6 w-6 text-white" />
            </motion.div>
          </div>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Success!
            </h3>
            <p className="text-sm text-gray-600">{message}</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const OTPModal = ({ 
  isOpen, 
  onClose, 
  onVerify, 
  loading, 
  error 
}: { 
  isOpen: boolean
  onClose: () => void
  onVerify: (otp: string) => void
  loading: boolean
  error: string
}) => {
  const [otp, setOtp] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length === 6) {
      onVerify(otp)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setOtp(value)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative shadow-xl"
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Verify Your Identity
            </h3>
            <p className="text-sm text-gray-600">
              We've sent a 6-digit verification code to your email address. Please enter it below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono tracking-widest"
                placeholder="000000"
                maxLength={6}
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className={spinnerClass}></span>
                    <span className="ml-2">Verifying...</span>
                  </>
                ) : (
                  'Verify'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [editing, setEditing] = useState(false)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [sendingOTP, setSendingOTP] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: new Date().toLocaleDateString(),
      })
      setFormData({
        name: user.name,
        email: user.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    }
  }, [user])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password'
      }
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters'
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const sendOTP = async () => {
    try {
      setSendingOTP(true)
      setOtpError('')
      
      const response = await fetch('/api/auth/profile-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ userId: user?.id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send OTP')
      }

      setShowOTPModal(true)
    } catch (error: any) {
      setOtpError(error.message || 'Failed to send OTP')
    } finally {
      setSendingOTP(false)
    }
  }

  const verifyOTP = async (otp: string) => {
    try {
      setOtpLoading(true)
      setOtpError('')
      
      const response = await fetch('/api/auth/profile-otp', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ userId: user?.id, otp }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Invalid OTP')
      }

      // OTP verified, now update profile
      await updateProfile()
      
    } catch (error: any) {
      setOtpError(error.message || 'Failed to verify OTP')
    } finally {
      setOtpLoading(false)
    }
  }

  const updateProfile = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      setShowOTPModal(false)
      setShowSuccessModal(true)
      setEditing(false)
      
      // Refresh user data
      window.location.reload()
    } catch (error: any) {
      setOtpError(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    // Check if any changes were made
    const hasChanges = formData.name !== user?.name || 
                      formData.email !== user?.email || 
                      formData.newPassword

    if (!hasChanges) {
      setEditing(false)
      return
    }

    // Send OTP for verification
    await sendOTP()
  }

  const handleCancel = () => {
    setEditing(false)
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setErrors({})
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="mr-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            </div>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{profileData?.name}</h2>
                <p className="text-blue-100 capitalize">{profileData?.role.toLowerCase()}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={sendingOTP}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                  >
                    {sendingOTP ? (
                      <>
                        <span className={spinnerClass}></span>
                        <span className="ml-2">Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-gray-900 py-3">{profileData?.name}</p>
                )}
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                ) : (
                  <p className="text-gray-900 py-3">{profileData?.email}</p>
                )}
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Role Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Role
                </label>
                <p className="text-gray-900 py-3 capitalize">{profileData?.role.toLowerCase()}</p>
              </div>

              {/* Member Since Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Member Since
                </label>
                <p className="text-gray-900 py-3">{profileData?.createdAt}</p>
              </div>

              {/* Password Change Section */}
              {editing && (
                <div className="border-t pt-6 mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Change Password (Optional)</h4>
                  
                  {/* Current Password */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>}
                  </div>

                  {/* New Password */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Lock className="w-4 h-4 inline mr-2" />
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.newPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Modals */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={verifyOTP}
        loading={otpLoading}
        error={otpError}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        message="Your profile has been updated successfully!"
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  )
} 
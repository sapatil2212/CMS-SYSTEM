'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-provider'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { logger } from '@/lib/logger';
import {  EyeIcon, EyeSlashIcon, EnvelopeIcon, ArrowLeftIcon, PhoneIcon  } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'email' | 'otp' | 'password'>('email')
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      logger.log('Attempting login...')
      await login(formData.email, formData.password)
      logger.log('Login successful, redirecting...')
      toast.success('Login successful!')
    } catch (error) {
      logger.error('Login error:', error)
      toast.error('Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleForgotPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForgotPasswordData({
      ...forgotPasswordData,
      [e.target.name]: e.target.value,
    })
  }

  const sendOTP = async () => {
    if (!forgotPasswordData.email) {
      toast.error('Please enter your email address')
      return
    }

    setForgotPasswordLoading(true)
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordData.email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('OTP sent to your email')
        setForgotPasswordStep('otp')
      } else {
        toast.error(data.error || 'Failed to send OTP')
      }
    } catch (error) {
      toast.error('Failed to send OTP')
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  const verifyOTPAndResetPassword = async () => {
    if (!forgotPasswordData.otp || !forgotPasswordData.newPassword || !forgotPasswordData.confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (forgotPasswordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setForgotPasswordLoading(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: forgotPasswordData.email,
          otp: forgotPasswordData.otp,
          newPassword: forgotPasswordData.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Password reset successfully!')
        setShowForgotPassword(false)
        setForgotPasswordStep('email')
        setForgotPasswordData({
          email: '',
          otp: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        toast.error(data.error || 'Failed to reset password')
      }
    } catch (error) {
      toast.error('Failed to reset password')
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  const goBackToLogin = () => {
    setShowForgotPassword(false)
    setForgotPasswordStep('email')
    setForgotPasswordData({
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {showForgotPassword ? 'Reset Password' : 'Sign in to your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {showForgotPassword ? (
            'Enter your email to receive a password reset OTP'
          ) : (
            <>
              Or{' '}
              <Link href="/signup" className="font-medium text-primary-600 hover:text-primary-500">
                create a new account
              </Link>
            </>
          )}
        </p>
      </div>

             <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
           {!showForgotPassword ? (
             // Login Form
             <form className="space-y-6" onSubmit={handleSubmit}>
               <div>
                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                   Email address
                 </label>
                 <div className="mt-1 relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                   </div>
                   <input
                     id="email"
                     name="email"
                     type="email"
                     autoComplete="email"
                     required
                     value={formData.email}
                     onChange={handleChange}
                     className="input-field pl-10"
                     placeholder="Enter your email"
                   />
                 </div>
               </div>
 
               <div>
                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                   Password
                 </label>
                 <div className="mt-1 relative">
                   <input
                     id="password"
                     name="password"
                     type={showPassword ? 'text' : 'password'}
                     autoComplete="current-password"
                     required
                     value={formData.password}
                     onChange={handleChange}
                     className="input-field pr-10"
                     placeholder="Enter your password"
                   />
                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                     <button
                       type="button"
                       onClick={() => setShowPassword(!showPassword)}
                       className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                     >
                       {showPassword ? (
                         <EyeSlashIcon className="h-5 w-5" />
                       ) : (
                         <EyeIcon className="h-5 w-5" />
                       )}
                     </button>
                   </div>
                 </div>
               </div>
 
               <div className="flex items-center justify-end">
                 <div className="text-sm">
                   <button
                     type="button"
                     onClick={() => setShowForgotPassword(true)}
                     className="font-medium text-primary-600 hover:text-primary-500"
                   >
                     Forgot your password?
                   </button>
                 </div>
               </div>
 
               <div>
                 <button
                   type="submit"
                   disabled={loading}
                   className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {loading ? 'Signing in...' : 'Sign in'}
                 </button>
               </div>
             </form>
           ) : (
             // Forgot Password Form
             <div className="space-y-6">
               {forgotPasswordStep === 'email' && (
                 <>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                       Email Address
                     </label>
                     <div className="relative">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                       </div>
                       <input
                         type="email"
                         name="email"
                         value={forgotPasswordData.email}
                         onChange={handleForgotPasswordChange}
                         className="input-field pl-10"
                         placeholder="Enter your email"
                         required
                       />
                     </div>
                   </div>
                   <div className="flex space-x-3">
                     <button
                       onClick={goBackToLogin}
                       className="flex-1 btn-secondary"
                     >
                       Back to Login
                     </button>
                     <button
                       onClick={sendOTP}
                       disabled={forgotPasswordLoading}
                       className="flex-1 btn-primary disabled:opacity-50"
                     >
                       {forgotPasswordLoading ? 'Sending OTP...' : 'Send OTP'}
                     </button>
                   </div>
                 </>
               )}
 
               {forgotPasswordStep === 'otp' && (
                 <>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                       OTP Code
                     </label>
                     <input
                       type="text"
                       name="otp"
                       value={forgotPasswordData.otp}
                       onChange={handleForgotPasswordChange}
                       className="input-field"
                       placeholder="Enter 6-digit OTP"
                       maxLength={6}
                       required
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                       New Password
                     </label>
                     <div className="relative">
                       <input
                         type={showPassword ? 'text' : 'password'}
                         name="newPassword"
                         value={forgotPasswordData.newPassword}
                         onChange={handleForgotPasswordChange}
                         className="input-field pr-10"
                         placeholder="Enter new password"
                         required
                       />
                       <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                         <button
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                         >
                           {showPassword ? (
                             <EyeSlashIcon className="h-5 w-5" />
                           ) : (
                             <EyeIcon className="h-5 w-5" />
                           )}
                         </button>
                       </div>
                     </div>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                       Confirm New Password
                     </label>
                     <div className="relative">
                       <input
                         type={showPassword ? 'text' : 'password'}
                         name="confirmPassword"
                         value={forgotPasswordData.confirmPassword}
                         onChange={handleForgotPasswordChange}
                         className="input-field pr-10"
                         placeholder="Confirm new password"
                         required
                       />
                       <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                         <button
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                         >
                           {showPassword ? (
                             <EyeSlashIcon className="h-5 w-5" />
                           ) : (
                             <EyeIcon className="h-5 w-5" />
                           )}
                         </button>
                       </div>
                     </div>
                   </div>
                   <div className="flex space-x-3">
                     <button
                       onClick={() => setForgotPasswordStep('email')}
                       className="flex-1 btn-secondary"
                     >
                       Back
                     </button>
                     <button
                       onClick={verifyOTPAndResetPassword}
                       disabled={forgotPasswordLoading}
                       className="flex-1 btn-primary disabled:opacity-50"
                     >
                       {forgotPasswordLoading ? 'Resetting...' : 'Reset Password'}
                     </button>
                   </div>
                 </>
               )}
             </div>
           )}
 
           {/* Back to Home Link */}
           <div className="mt-6 text-center">
             <Link 
               href="/" 
               className="inline-flex items-center justify-center text-xs text-gray-500 hover:text-gray-800 transition-colors duration-200"
             >
               <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
               <span>Back to Home</span>
             </Link>
           </div>
         </div>
       </div>
 
       {/* Help and Support Section */}
       <div className="mt-4 text-center text-xs text-gray-500">
         <p className="font-semibold mb-1 text-gray-600">
           Can't login/sign up? Connect with Support
         </p>
         <div className="flex items-center justify-center space-x-4">
           <div className="flex items-center space-x-1.5">
             <PhoneIcon className="h-3.5 w-3.5" />
             <span>8830553868</span>
           </div>
           <div className="flex items-center space-x-1.5">
             <EnvelopeIcon className="h-3.5 w-3.5" />
             <span>saptechnoeditors@gmail.com</span>
           </div>
         </div>
       </div>
     </div>
   )
 } 
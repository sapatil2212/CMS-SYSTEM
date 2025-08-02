'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-provider'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, UserIcon, ArrowLeftIcon, PhoneIcon } from '@heroicons/react/24/outline'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleSendOtp = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/auth/signup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, name: formData.name }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP.');
      }
      toast.success('Verification OTP sent to your email.');
      setIsOtpSent(true);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isOtpSent) {
      handleSendOtp()
      return
    }

    setLoading(true)

    try {
      // Pass the OTP along with other registration data
      await register(formData.name, formData.email, formData.password, formData.otp)
      toast.success('Registration successful! Welcome to our platform!')
      router.push('/admin') // Redirect to admin dashboard
    } catch (error: any) {
      console.error('Registration error:', error)
      if (error.message.includes('Invalid or expired OTP')) {
        toast.error('Invalid or expired OTP. Please request a new one.')
        setIsOtpSent(false)
        setFormData(prev => ({ ...prev, otp: '' }))
      } else if (error.message.includes('already exists')) {
        toast.error('An account with this email already exists. Please login instead.')
      } else {
        toast.error(error.message || 'Registration failed. Please try again.')
      }
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

             <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
           <form className="space-y-6" onSubmit={handleSubmit}>
             {/* Fields for user details */}
             {!isOtpSent && (
               <>
                 <div>
                   <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                     Full Name
                   </label>
                   <div className="mt-1 relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <UserIcon className="h-5 w-5 text-gray-400" />
                     </div>
                     <input
                       id="name"
                       name="name"
                       type="text"
                       autoComplete="name"
                       required
                       value={formData.name}
                       onChange={handleChange}
                       className="input-field pl-10"
                       placeholder="Enter your full name"
                     />
                   </div>
                 </div>
 
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
                       autoComplete="new-password"
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
 
                 <div>
                   <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                     Confirm Password
                   </label>
                   <div className="mt-1 relative">
                     <input
                       id="confirmPassword"
                       name="confirmPassword"
                       type={showConfirmPassword ? 'text' : 'password'}
                       autoComplete="new-password"
                       required
                       value={formData.confirmPassword}
                       onChange={handleChange}
                       className="input-field pr-10"
                       placeholder="Confirm your password"
                     />
                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                       <button
                         type="button"
                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                         className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                       >
                         {showConfirmPassword ? (
                           <EyeSlashIcon className="h-5 w-5" />
                         ) : (
                           <EyeIcon className="h-5 w-5" />
                         )}
                       </button>
                     </div>
                   </div>
                 </div>
 
                 <div className="flex items-center">
                   <input
                     id="agree-terms"
                     name="agree-terms"
                     type="checkbox"
                     required
                     className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                   />
                   <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                     I agree to the{' '}
                     <a href="#" className="text-primary-600 hover:text-primary-500">
                       Terms of Service
                     </a>{' '}
                     and{' '}
                     <a href="#" className="text-primary-600 hover:text-primary-500">
                       Privacy Policy
                     </a>
                   </label>
                 </div>
               </>
             )}
 
             {isOtpSent && (
               <div>
                 <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                   Verification Code
                 </label>
                 <div className="mt-1">
                   <input
                     id="otp"
                     name="otp"
                     type="text"
                     required
                     value={formData.otp}
                     onChange={handleChange}
                     className="input-field"
                     placeholder="Enter OTP"
                   />
                 </div>
               </div>
             )}
 
             <div>
               <button
                 type="submit"
                 disabled={loading}
                 className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {loading ? (isOtpSent ? 'Registering...' : 'Sending OTP...') : (isOtpSent ? 'Register' : 'Send OTP')}
               </button>
             </div>
           </form>
 
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
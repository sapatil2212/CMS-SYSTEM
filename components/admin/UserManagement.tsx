'use client'

import { useState, useEffect } from 'react'
import { 
  Edit, 
  Trash2, 
  Save, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Shield, 
  Mail, 
  Eye,
  EyeOff,
  Calendar,
  ArrowRight
} from 'lucide-react'
import ProfessionalLoader from '@/components/ui/ProfessionalLoader'
import { logger } from '@/lib/logger';

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'USER'
  createdAt: string
  updatedAt: string
}

interface UserForm {
  name: string
  email: string
  password: string
  role: 'ADMIN' | 'USER'
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [formData, setFormData] = useState<UserForm>({
    name: '',
    email: '',
    password: '',
    role: 'USER'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showPasswordUpdateModal, setShowPasswordUpdateModal] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        throw new Error('Failed to fetch users')
      }
    } catch (error) {
      logger.error('Error fetching users:', error)
      setMessage({ type: 'error', text: 'Failed to load users' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const method = editingUser ? 'PUT' : 'POST'
      const url = '/api/admin/users'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser ? { ...formData, id: editingUser } : formData)
      })
      
             if (response.ok) {
         await fetchUsers()
         resetForm()
         setSuccessMessage(`User ${editingUser ? 'updated' : 'created'} successfully!`)
         setShowSuccessModal(true)
         setTimeout(() => setShowSuccessModal(false), 3000)
       } else {
         const error = await response.json()
         throw new Error(error.error || 'Failed to save user')
       }
               } catch (error) {
        logger.error('Error saving user:', error)
        setSuccessMessage(error instanceof Error ? error.message : 'Failed to save user')
        setShowSuccessModal(true)
        setTimeout(() => setShowSuccessModal(false), 3000)
      }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user.id)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    })
    setShowEditModal(true)
  }

  const handleDelete = (user: User) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const sendOTP = async () => {
    if (!userToDelete) return
    
    try {
      setOtpLoading(true)
      const response = await fetch('/api/admin/users/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userToDelete.id })
      })
      
      if (response.ok) {
        const data = await response.json()
        setOtpSent(true)
        setShowOTPModal(true)
        
        // If OTP is provided in response (for development/testing)
        if (data.otp) {
          setOtp(data.otp)
          setSuccessMessage(`OTP generated: ${data.otp} (check console for details)`)
          setShowSuccessModal(true)
          setTimeout(() => setShowSuccessModal(false), 3000)
        } else {
          setSuccessMessage('OTP sent to user email')
          setShowSuccessModal(true)
          setTimeout(() => setShowSuccessModal(false), 3000)
        }
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send OTP')
      }
    } catch (error) {
      logger.error('Error sending OTP:', error)
      setSuccessMessage(error instanceof Error ? error.message : 'Failed to send OTP')
      setShowSuccessModal(true)
      setTimeout(() => setShowSuccessModal(false), 3000)
    } finally {
      setOtpLoading(false)
    }
  }

  const verifyOTPAndDelete = async () => {
    if (!userToDelete || !otp) return
    
    try {
      setOtpLoading(true)
      
      // Verify OTP
      const verifyResponse = await fetch('/api/admin/users/otp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userToDelete.id, otp })
      })
      
      if (!verifyResponse.ok) {
        const error = await verifyResponse.json()
        throw new Error(error.error || 'Invalid OTP')
      }
      
      // Delete user
      const deleteResponse = await fetch(`/api/admin/users?id=${userToDelete.id}`, {
        method: 'DELETE'
      })
      
      if (deleteResponse.ok) {
        await fetchUsers()
        setShowOTPModal(false)
        setShowDeleteModal(false)
        setUserToDelete(null)
        setOtp('')
        setOtpSent(false)
        setSuccessMessage('User deleted successfully!')
        setShowSuccessModal(true)
        setTimeout(() => setShowSuccessModal(false), 3000)
      } else {
        const error = await deleteResponse.json()
        throw new Error(error.error || 'Failed to delete user')
      }
    } catch (error) {
      logger.error('Error deleting user:', error)
      setSuccessMessage(error instanceof Error ? error.message : 'Failed to delete user')
      setShowSuccessModal(true)
      setTimeout(() => setShowSuccessModal(false), 3000)
    } finally {
      setOtpLoading(false)
    }
  }

  const sendOTPForPasswordUpdate = async () => {
    if (!editingUser) return
    
    try {
      setOtpLoading(true)
      const response = await fetch('/api/admin/users/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: editingUser })
      })
      
      if (response.ok) {
        const data = await response.json()
        setOtpSent(true)
        setShowPasswordUpdateModal(true)
        
        // If OTP is provided in response (for development/testing)
        if (data.otp) {
          setOtp(data.otp)
          setSuccessMessage(`OTP generated: ${data.otp} (check console for details)`)
          setShowSuccessModal(true)
          setTimeout(() => setShowSuccessModal(false), 3000)
        } else {
          setSuccessMessage('OTP sent to user email')
          setShowSuccessModal(true)
          setTimeout(() => setShowSuccessModal(false), 3000)
        }
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send OTP')
      }
    } catch (error) {
      logger.error('Error sending OTP:', error)
      setSuccessMessage(error instanceof Error ? error.message : 'Failed to send OTP')
      setShowSuccessModal(true)
      setTimeout(() => setShowSuccessModal(false), 3000)
    } finally {
      setOtpLoading(false)
    }
  }

  const verifyOTPAndUpdatePassword = async () => {
    if (!editingUser || !otp) return
    
    try {
      setOtpLoading(true)
      
      // Verify OTP
      const verifyResponse = await fetch('/api/admin/users/otp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: editingUser, otp })
      })
      
      if (!verifyResponse.ok) {
        const error = await verifyResponse.json()
        throw new Error(error.error || 'Invalid OTP')
      }
      
      // Update password
      const updateResponse = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: editingUser, 
          name: formData.name, 
          email: formData.email, 
          password: newPassword, 
          role: formData.role 
        })
      })
      
      if (updateResponse.ok) {
        await fetchUsers()
        setShowPasswordUpdateModal(false)
        setShowEditModal(false)
        setOtp('')
        setOtpSent(false)
        setNewPassword('')
        setConfirmPassword('')
        setSuccessMessage('Password updated successfully!')
        setShowSuccessModal(true)
        setTimeout(() => setShowSuccessModal(false), 3000)
      } else {
        const error = await updateResponse.json()
        throw new Error(error.error || 'Failed to update password')
      }
    } catch (error) {
      logger.error('Error updating password:', error)
      setSuccessMessage(error instanceof Error ? error.message : 'Failed to update password')
      setShowSuccessModal(true)
      setTimeout(() => setShowSuccessModal(false), 3000)
    } finally {
      setOtpLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', role: 'USER' })
    setEditingUser(null)
    setShowEditModal(false)
    setShowPassword(false)
    setShowPasswordUpdateModal(false)
    setNewPassword('')
    setConfirmPassword('')
    setShowNewPassword(false)
    setShowConfirmPassword(false)
  }

  const filteredUsers = users

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <ProfessionalLoader 
          size="lg"
          title="Loading Users"
          subtitle="Fetching user management data..."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
             {/* Header */}
       <div className="flex justify-between items-center">
         <div>
           <h2 className="text-2xl font-bold text-gray-900 flex items-center">
             <Users className="h-6 w-6 mr-2 text-blue-600" />
             User Management
           </h2>
           <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
         </div>
       </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center space-x-3 shadow-sm border ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border-green-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      

      

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Users ({filteredUsers.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered at</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-700 p-1 rounded"
                        title="Edit user"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-red-600 hover:text-red-700 p-1 rounded"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

                    {/* Delete Confirmation Modal */}
       {showDeleteModal && userToDelete && !showOTPModal && (
         <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] w-full h-full">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4 relative">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                <p className="text-gray-600">Are you sure you want to delete <strong>{userToDelete.name}</strong>?</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">This action requires OTP verification</p>
                  <p>A 6-digit OTP will be sent to <strong>{userToDelete.email}</strong></p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={sendOTP}
                disabled={otpLoading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all duration-200"
              >
                {otpLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                <span>{otpLoading ? 'Sending...' : 'Send OTP'}</span>
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setUserToDelete(null)
                  setOtpSent(false)
                }}
                className="bg-gray-600 hover:bg-gray-700 flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all duration-200"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}

             {/* OTP Verification Modal */}
       {showOTPModal && userToDelete && (
         <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] w-full h-full">
           <div className="bg-white rounded-3xl shadow-2xl max-w-md mx-4 relative w-full">
             {/* Header */}
             <div className="px-8 py-6 border-b border-gray-100">
               <div className="flex justify-between items-center">
                 <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                     <Shield className="h-5 w-5 text-red-600" />
                   </div>
                                       <div>
                      <h3 className="text-xl font-bold text-gray-900">OTP Verification</h3>
                      <p className="text-xs text-gray-500">Enter the 6-digit OTP sent to <strong>{userToDelete.email}</strong></p>
                    </div>
                 </div>
                 <button
                   onClick={() => {
                     setShowOTPModal(false)
                     setOtp('')
                     setOtpSent(false)
                   }}
                   className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                 >
                   <X className="h-4 w-4 text-gray-600" />
                 </button>
               </div>
             </div>

             {/* Form Content */}
             <div className="px-8 py-6 space-y-6">
               {/* OTP Input */}
               <div className="space-y-2">
                 <label className="block text-sm font-semibold text-gray-700">OTP Code</label>
                 <input
                   type="text"
                   value={otp}
                   onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                   className="w-full px-4 py-3.5 text-center text-2xl font-mono border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                   placeholder="000000"
                   maxLength={6}
                 />
                 <p className="text-xs text-gray-500">Enter the 6-digit OTP sent to your email</p>
               </div>

               {/* Action Buttons */}
               <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                 <button
                   type="button"
                   onClick={() => {
                     setShowOTPModal(false)
                     setOtp('')
                     setOtpSent(false)
                   }}
                   className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm font-medium"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={verifyOTPAndDelete}
                   disabled={otp.length !== 6 || otpLoading}
                   className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center space-x-2"
                 >
                   {otpLoading ? (
                     <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                   ) : (
                     <Trash2 className="h-3 w-3" />
                   )}
                   <span>{otpLoading ? 'Verifying...' : 'Delete User'}</span>
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

                            {/* Edit User Modal */}
       {showEditModal && !showPasswordUpdateModal && (
         <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] w-full h-full">
           <div className="bg-white rounded-3xl shadow-2xl max-w-2xl mx-4 relative w-full max-h-[90vh] overflow-y-auto">
             {/* Header */}
             <div className="sticky top-0 bg-white rounded-t-3xl px-8 py-6 border-b border-gray-100">
               <div className="flex justify-between items-center">
                 <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                     <Edit className="h-5 w-5 text-blue-600" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-gray-900">Edit User</h3>
                     <p className="text-sm text-gray-500">Update user information and permissions</p>
                   </div>
                 </div>
                 <button
                   onClick={resetForm}
                   className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                 >
                   <X className="h-4 w-4 text-gray-600" />
                 </button>
               </div>
             </div>

             {/* Form Content */}
             <div className="px-8 py-6">
               <form onSubmit={handleSubmit} className="space-y-6">
                 {/* Name and Email Row */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                     <input
                       type="text"
                       value={formData.name}
                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                       className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                       placeholder="Enter full name"
                       required
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                     <input
                       type="email"
                       value={formData.email}
                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                       className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                       placeholder="Enter email address"
                       required
                     />
                   </div>
                 </div>

                 {/* Password and Role Row */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                       <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-semibold text-gray-700">Password</label>
                                                 {/* Send OTP Button */}
                         <button
                           type="button"
                           onClick={sendOTPForPasswordUpdate}
                           disabled={otpLoading}
                           className="flex items-center space-x-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                         >
                           {otpLoading ? (
                             <>
                               <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                               <span>Sending...</span>
                             </>
                           ) : (
                             <>
                               <span>Send OTP</span>
                               <ArrowRight className="h-4 w-4" />
                             </>
                           )}
                         </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full px-4 py-3.5 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                          placeholder="Leave blank to keep current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                                             </div>
                      </div>
                                         <div className="space-y-2">
                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                         <div className="flex items-start space-x-2">
                           <span className="text-blue-600 font-semibold text-xs">*</span>
                           <div className="text-xs text-blue-800">
                             <p className="font-medium mb-1 text-xs">Password Reset Process:</p>
                             <ol className="list-decimal list-inside space-y-1 text-xs">
                               <li>Leave password field empty to keep current password</li>
                               <li>For password reset: Send OTP → Verify OTP → Reset Password</li>
                             </ol>
                           </div>
                         </div>
                       </div>
                     </div>
                 </div>

                                   {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center space-x-2"
                    >
                      <Save className="h-3 w-3" />
                      <span>Update User</span>
                    </button>
                  </div>
               </form>
             </div>
           </div>
         </div>
       )}

                      {/* Password Update Modal */}
       {showPasswordUpdateModal && (
         <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] w-full h-full">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md mx-4 relative w-full">
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Update Password</h3>
                      <p className="text-sm text-gray-500">Enter OTP and new password</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowPasswordUpdateModal(false)
                      setOtp('')
                      setNewPassword('')
                      setConfirmPassword('')
                    }}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="px-8 py-6 space-y-6">
                {/* OTP Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">OTP Code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-3.5 text-center text-2xl font-mono border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="000000"
                    maxLength={6}
                  />
                  <p className="text-xs text-gray-500">Enter the 6-digit OTP sent to your email</p>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3.5 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3.5 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordUpdateModal(false)
                      setOtp('')
                      setNewPassword('')
                      setConfirmPassword('')
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={verifyOTPAndUpdatePassword}
                    disabled={otp.length !== 6 || !newPassword || newPassword !== confirmPassword || otpLoading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl transition-all duration-200 font-medium flex items-center space-x-2"
                  >
                    {otpLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{otpLoading ? 'Updating...' : 'Update Password'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

               {/* Success Modal */}
       {showSuccessModal && (
         <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] w-full h-full">
            <div className="bg-white rounded-2xl p-6 max-w-md mx-4 relative">
              {/* Close button */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Success!</h3>
                  <p className="text-gray-600">{successMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  )
} 
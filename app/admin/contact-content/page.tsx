'use client';

import { useState, useEffect } from 'react';
import { Save, Edit, Trash2, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ImageUpload from '@/components/admin/ImageUpload';
import ProfessionalLoader from '@/components/ui/ProfessionalLoader';

interface ContactContent {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  phone: string;
  email: string;
  address: string;
  mapLink?: string;
  image?: string;
  isActive: boolean;
}

export default function ContactContentPage() {
  const [contactContent, setContactContent] = useState<ContactContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    mapLink: '',
    image: ''
  });

  useEffect(() => {
    fetchContactContent();
  }, []);

  // Auto-hide message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchContactContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/content/contact');
      if (response.ok) {
        const data = await response.json();
        setContactContent(data);
        setFormData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          mapLink: data.mapLink || '',
          image: data.image || ''
        });
      } else {
        throw new Error('Failed to fetch contact content');
      }
    } catch (error) {
      console.error('Error fetching contact content:', error);
      setMessage({ type: 'error', text: 'Failed to load contact content' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (imageUrl: string) => {
    console.log('Image upload callback called with URL:', imageUrl);
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const method = contactContent?.id ? 'PUT' : 'POST';
      const url = '/api/admin/content/contact';
      const body = contactContent?.id 
        ? { ...formData, id: contactContent.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Contact content saved successfully!' });
        setIsEditing(false);
        await fetchContactContent();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save contact content');
      }
    } catch (error: any) {
      console.error('Error saving contact content:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save contact content' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!contactContent?.id) return;

    if (!confirm('Are you sure you want to delete this contact content?')) {
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch(`/api/admin/content/contact?id=${contactContent.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Contact content deleted successfully!' });
        setContactContent(null);
        setFormData({
          title: '',
          subtitle: '',
          description: '',
          phone: '',
          email: '',
          address: '',
          mapLink: '',
          image: ''
        });
        setIsEditing(false);
      } else {
        throw new Error('Failed to delete contact content');
      }
    } catch (error) {
      console.error('Error deleting contact content:', error);
      setMessage({ type: 'error', text: 'Failed to delete contact content' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (contactContent) {
      setFormData({
        title: contactContent.title || '',
        subtitle: contactContent.subtitle || '',
        description: contactContent.description || '',
        phone: contactContent.phone || '',
        email: contactContent.email || '',
        address: contactContent.address || '',
        mapLink: contactContent.mapLink || '',
        image: contactContent.image || ''
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="lg:pl-64">
          <AdminHeader setSidebarOpen={setSidebarOpen} />
          <div className="flex-1 flex items-center justify-center">
            <ProfessionalLoader 
              size="lg"
              title="Loading Contact Content"
              subtitle="Preparing content management interface..."
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="lg:pl-64">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Contact Content Management</h1>
                <p className="text-gray-600 mt-1">Manage contact page content and information</p>
              </div>
              <div className="flex space-x-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Content
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-md flex items-center justify-between ${
                message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center">
                  {message.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  <span className={`text-sm ${
                    message.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {message.text}
                  </span>
                </div>
                <button
                  onClick={() => setMessage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      placeholder="Contact Us"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      placeholder="Get in touch with us"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      placeholder="We'd love to hear from you. Send us a message and we'll respond as soon as possible."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      placeholder="+91 93731 02887"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      placeholder="asgoals0494@gmail.com"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      placeholder="123 Industrial Area, Nashik, Maharashtra - 422009"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Map Link
                    </label>
                    <input
                      type="url"
                      name="mapLink"
                      value={formData.mapLink}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      placeholder="https://maps.app.goo.gl/example"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Image
                    </label>
                    {isEditing ? (
                      <ImageUpload
                        label="Contact Image"
                        value={formData.image}
                        onChange={handleImageUpload}
                        className="w-full"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center">
                        {formData.image ? (
                          <img
                            src={formData.image}
                            alt="Contact"
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <span className="text-gray-500">No image uploaded</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              {contactContent?.id && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleDelete}
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Contact Content
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
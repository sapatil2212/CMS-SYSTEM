'use client';

import { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import EmailPreview from '@/components/email/EmailPreview';

export default function EmailPreviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    mobile: '+91 98765 43210',
    processType: 'Zinc Plating',
    message: 'I need a quote for zinc plating services for automotive parts. Please provide detailed pricing and timeline.',
    timestamp: new Date().toLocaleString()
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="lg:pl-72">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Email Template Preview</h1>
              <p className="mt-2 text-gray-600">
                Preview how contact form emails will look with the current logo and branding.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Controls */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Test Data</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Process Type
                    </label>
                    <select
                      name="processType"
                      value={formData.processType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Zinc Plating">Zinc Plating</option>
                      <option value="Nickel Plating">Nickel Plating</option>
                      <option value="Copper Plating">Copper Plating</option>
                      <option value="Gold Plating">Gold Plating</option>
                      <option value="Silver Plating">Silver Plating</option>
                      <option value="Bright Tin Plating">Bright Tin Plating</option>
                      <option value="Dull Tin Plating">Dull Tin Plating</option>
                      <option value="Electroless Nickel Plating">Electroless Nickel Plating</option>
                      <option value="Busbar Plating">Busbar Plating</option>
                      <option value="Rack Barrel Plating">Rack Barrel Plating</option>
                      <option value="Zinc Flake Coating">Zinc Flake Coating</option>
                      <option value="Molykote">Molykote</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">Logo Information</h3>
                    <p className="text-sm text-blue-700">
                      The logo will be automatically fetched from your header settings. 
                      Make sure you have uploaded a logo in the Header Management section.
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Preview */}
              <div>
                <EmailPreview data={formData} />
              </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Instructions</h2>
              <div className="prose prose-sm text-gray-600">
                <ul className="space-y-2">
                  <li>• Update the test data above to see how different information appears in the emails</li>
                  <li>• The logo is automatically fetched from your header settings</li>
                  <li>• Switch between Admin and User email tabs to see both templates</li>
                  <li>• These are the exact templates used when contact forms are submitted</li>
                  <li>• The preview shows how emails will look in different email clients</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 
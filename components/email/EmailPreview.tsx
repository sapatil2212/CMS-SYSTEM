'use client';

import { useState, useEffect } from 'react';
import { AdminEmailTemplate } from './AdminEmailTemplate';
import { UserEmailTemplate } from './UserEmailTemplate';

interface EmailPreviewProps {
  data: {
    fullName: string;
    email: string;
    mobile: string;
    processType: string;
    message?: string;
    timestamp: string;
    logoUrl?: string;
    logoAlt?: string;
  };
}

export default function EmailPreview({ data }: EmailPreviewProps) {
  const [activeTab, setActiveTab] = useState<'admin' | 'user'>('admin');
  const [logoData, setLogoData] = useState<{ logoUrl?: string; logoAlt?: string }>({});

  // Fetch logo data from header settings
  useEffect(() => {
    const fetchLogoData = async () => {
      try {
        const response = await fetch('/api/content/header');
        if (response.ok) {
          const headerData = await response.json();
          setLogoData({
            logoUrl: headerData.logoUrl,
            logoAlt: headerData.logoAlt
          });
        }
      } catch (error) {
        console.error('Error fetching logo data:', error);
      }
    };

    fetchLogoData();
  }, []);

  // Combine data with logo
  const emailData = {
    ...data,
    logoUrl: data.logoUrl || logoData.logoUrl,
    logoAlt: data.logoAlt || logoData.logoAlt
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('admin')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'admin'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Admin Email
          </button>
          <button
            onClick={() => setActiveTab('user')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'user'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            User Email
          </button>
        </nav>
      </div>

      {/* Logo Information */}
      {emailData.logoUrl && (
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Logo:</span> {emailData.logoAlt || 'Company Logo'} 
            <span className="text-gray-400 ml-2">(Will appear in email header)</span>
          </p>
        </div>
      )}

      {/* Email Preview */}
      <div className="p-6">
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Template Features:</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Professional design with Tailwind CSS styling</li>
            <li>• Responsive layout that works across email clients</li>
            <li>• Dynamic logo integration from header settings</li>
            <li>• Interactive elements (clickable email/phone links)</li>
            <li>• Modern card-based layout with proper spacing</li>
            <li>• Color-coded sections for better readability</li>
          </ul>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {activeTab === 'admin' ? (
            <AdminEmailTemplate data={emailData} />
          ) : (
            <UserEmailTemplate data={emailData} />
          )}
        </div>
      </div>
    </div>
  );
} 
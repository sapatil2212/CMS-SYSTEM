'use client';

import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Clock, 
  MessageSquare, 
  CheckCircle,
  ArrowRight,
  Info,
  PhoneCall,
  Star,
  Shield,
  Zap,
  ChevronRight
} from 'lucide-react';

interface UserEmailData {
  fullName: string;
  email: string;
  mobile: string;
  processType: string;
  message?: string;
  timestamp: string;
  logoUrl?: string;
  logoAlt?: string;
  companyName?: string;
}

interface UserEmailTemplateProps {
  data: UserEmailData;
  className?: string;
}

export const UserEmailTemplate: React.FC<UserEmailTemplateProps> = ({ 
  data, 
  className = '' 
}) => {
  return (
    <div className={`max-w-2xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="bg-white p-6 border-b border-gray-100">
        {data.logoUrl && (
          <div className="mb-4">
            <img 
              src={data.logoUrl} 
              alt={data.logoAlt || 'Company Logo'} 
              className="h-10 mx-auto object-contain"
            />
          </div>
        )}
        
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-blue-600" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Thank you, {data.fullName.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">
            We've received your inquiry about <span className="font-medium text-blue-600">{data.processType}</span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Confirmation */}
        <div className="bg-blue-50 rounded-lg p-5 mb-6 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <CheckCircle className="w-5 h-5 text-blue-600" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Inquiry confirmed</h3>
              <p className="text-gray-600 text-sm">
                We've received your details and our team will review your request shortly.
                Expect a response within 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-400" />
            Inquiry details
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3 text-gray-500">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">Service</span>
              </div>
              <span className="font-medium text-gray-900">{data.processType}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3 text-gray-500">
                <Mail className="w-4 h-4" />
                <span className="text-sm">Email</span>
              </div>
              <span className="font-medium text-gray-900">{data.email}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3 text-gray-500">
                <Phone className="w-4 h-4" />
                <span className="text-sm">Phone</span>
              </div>
              <span className="font-medium text-gray-900">{data.mobile}</span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3 text-gray-500">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Submitted</span>
              </div>
              <span className="font-medium text-gray-900">{data.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Message */}
        {data.message && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              Your message
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="text-gray-700 whitespace-pre-wrap">{data.message}</p>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-gray-400" />
            Next steps
          </h3>
          
          <div className="space-y-3">
            {[
              {
                step: 1,
                title: "Expert review",
                description: "Our specialist will assess your requirements",
                icon: Star,
                color: "text-blue-600"
              },
              {
                step: 2,
                title: "Personalized proposal",
                description: "You'll receive a tailored solution and quote",
                icon: Shield,
                color: "text-green-600"
              },
              {
                step: 3,
                title: "Consultation",
                description: "We'll schedule a call to discuss details",
                icon: Zap,
                color: "text-purple-600"
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-6 h-6 rounded-full bg-${item.color.split('-')[1]}-50 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <item.icon className={`w-3.5 h-3.5 ${item.color}`} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-400">Step {item.step}</span>
                    <ChevronRight className="w-3 h-3 text-gray-300" />
                  </div>
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support */}
        <div className="border border-gray-100 rounded-lg p-5 bg-gray-50">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-blue-600" />
            Need immediate help?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            For urgent inquiries, our support team is available to assist you.
          </p>
          <a 
            href="tel:+919373102887"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Call +91 93731 02887
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-6 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-500 mb-2">
          This is an automated confirmation. Please do not reply to this email.
        </p>
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} {data.companyName || 'All Rights Reserved'}
        </p>
      </div>
    </div>
  );
};

// HTML version for backward compatibility
export const createUserEmailTemplate = (data: UserEmailData): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Your Inquiry</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
          line-height: 1.5;
          color: #374151;
        }
        .border-bottom { border-bottom: 1px solid #f3f4f6; }
      </style>
    </head>
    <body style="background-color: #f9fafb; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <!-- Header -->
        <div style="padding: 24px; border-bottom: 1px solid #f3f4f6; background-color: #ffffff;">
          ${data.logoUrl ? `
          <div style="margin-bottom: 16px; text-align: center;">
            <img src="${data.logoUrl}" alt="${data.logoAlt || 'Company Logo'}" style="height: 40px; margin: 0 auto;">
          </div>
          ` : ''}
          
          <div style="text-align: center;">
            <div style="width: 56px; height: 56px; margin: 0 auto 16px; background-color: #eff6ff; border-radius: 9999px; display: flex; align-items: center; justify-content: center;">
              <svg style="width: 24px; height: 24px; color: #2563eb;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h1 style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 8px;">
              Thank you, ${data.fullName.split(' ')[0]}!
            </h1>
            <p style="color: #4b5563;">
              We've received your inquiry about <span style="font-weight: 500; color: #2563eb;">${data.processType}</span>
            </p>
          </div>
        </div>

        <!-- Content -->
        <div style="padding: 24px;">
          <!-- Confirmation -->
          <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; margin-bottom: 24px; border: 1px solid #dbeafe;">
            <div style="display: flex; align-items: flex-start; gap: 12px;">
              <div style="flex-shrink: 0; margin-top: 2px;">
                <svg style="width: 20px; height: 20px; color: #2563eb;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 style="font-weight: 500; color: #111827; margin-bottom: 4px;">Inquiry confirmed</h3>
                <p style="color: #4b5563; font-size: 14px;">
                  We've received your details and our team will review your request shortly.
                  Expect a response within 24 hours.
                </p>
              </div>
            </div>
          </div>

          <!-- Details -->
          <div style="margin-bottom: 32px;">
            <h3 style="font-size: 12px; font-weight: 600; color: #6b7280; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
              <svg style="width: 16px; height: 16px; color: #9ca3af;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Inquiry details
            </h3>
            
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                <div style="display: flex; align-items: center; gap: 12px; color: #6b7280;">
                  <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  <span style="font-size: 14px;">Service</span>
                </div>
                <span style="font-weight: 500; color: #111827;">${data.processType}</span>
              </div>
              
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                <div style="display: flex; align-items: center; gap: 12px; color: #6b7280;">
                  <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span style="font-size: 14px;">Email</span>
                </div>
                <span style="font-weight: 500; color: #111827;">${data.email}</span>
              </div>
              
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                <div style="display: flex; align-items: center; gap: 12px; color: #6b7280;">
                  <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span style="font-size: 14px;">Phone</span>
                </div>
                <span style="font-weight: 500; color: #111827;">${data.mobile}</span>
              </div>
              
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0;">
                <div style="display: flex; align-items: center; gap: 12px; color: #6b7280;">
                  <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span style="font-size: 14px;">Submitted</span>
                </div>
                <span style="font-weight: 500; color: #111827;">${data.timestamp}</span>
              </div>
            </div>
          </div>

          <!-- Message -->
          ${data.message ? `
          <div style="margin-bottom: 32px;">
            <h3 style="font-size: 12px; font-weight: 600; color: #6b7280; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <svg style="width: 16px; height: 16px; color: #9ca3af;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              Your message
            </h3>
            <div style="background-color: #f9fafb; border-radius: 6px; padding: 16px; border: 1px solid #f3f4f6;">
              <p style="color: #374151; white-space: pre-wrap;">${data.message}</p>
            </div>
          </div>
          ` : ''}

          <!-- Next Steps -->
          <div style="margin-bottom: 32px;">
            <h3 style="font-size: 12px; font-weight: 600; color: #6b7280; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
              <svg style="width: 16px; height: 16px; color: #9ca3af;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
              Next steps
            </h3>
            
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; align-items: flex-start; gap: 16px; padding: 12px; border-radius: 8px; transition: background-color 0.2s;">
                <div style="width: 24px; height: 24px; border-radius: 9999px; background-color: #eff6ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
                  <svg style="width: 14px; height: 14px; color: #2563eb;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                  </svg>
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <span style="font-size: 12px; font-weight: 500; color: #9ca3af;">Step 1</span>
                    <svg style="width: 12px; height: 12px; color: #d1d5db;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                  <h4 style="font-weight: 500; color: #111827;">Expert review</h4>
                  <p style="font-size: 14px; color: #6b7280;">Our specialist will assess your requirements</p>
                </div>
              </div>
              
              <div style="display: flex; align-items: flex-start; gap: 16px; padding: 12px; border-radius: 8px; transition: background-color 0.2s;">
                <div style="width: 24px; height: 24px; border-radius: 9999px; background-color: #ecfdf5; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
                  <svg style="width: 14px; height: 14px; color: #059669;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <span style="font-size: 12px; font-weight: 500; color: #9ca3af;">Step 2</span>
                    <svg style="width: 12px; height: 12px; color: #d1d5db;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                  <h4 style="font-weight: 500; color: #111827;">Personalized proposal</h4>
                  <p style="font-size: 14px; color: #6b7280;">You'll receive a tailored solution and quote</p>
                </div>
              </div>
              
              <div style="display: flex; align-items: flex-start; gap: 16px; padding: 12px; border-radius: 8px; transition: background-color 0.2s;">
                <div style="width: 24px; height: 24px; border-radius: 9999px; background-color: #f5f3ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
                  <svg style="width: 14px; height: 14px; color: #7c3aed;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <span style="font-size: 12px; font-weight: 500; color: #9ca3af;">Step 3</span>
                    <svg style="width: 12px; height: 12px; color: #d1d5db;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                  <h4 style="font-weight: 500; color: #111827;">Consultation</h4>
                  <p style="font-size: 14px; color: #6b7280;">We'll schedule a call to discuss details</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Support -->
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background-color: #f9fafb;">
            <h3 style="font-weight: 500; color: #111827; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <svg style="width: 20px; height: 20px; color: #2563eb;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              Need immediate help?
            </h3>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 16px;">
              For urgent inquiries, our support team is available to assist you.
            </p>
            <a href="tel:+919373102887" style="display: inline-flex; align-items: center; gap: 8px; color: #2563eb; font-weight: 500; font-size: 14px; text-decoration: none;">
              Call +91 93731 02887
              <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">
            This is an automated confirmation. Please do not reply to this email.
          </p>
          <p style="font-size: 12px; color: #9ca3af;">
            © ${new Date().getFullYear()} ${data.companyName || 'All Rights Reserved'}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
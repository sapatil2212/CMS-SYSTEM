'use client';

import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Clock, 
  MessageSquare, 
  AlertTriangle,
  Reply,
  CheckCircle,
  TrendingUp,
  Calendar,
  MapPin,
  Zap,
  Target
} from 'lucide-react';

interface AdminEmailData {
  fullName: string;
  email: string;
  mobile: string;
  processType: string;
  message?: string;
  timestamp: string;
  logoUrl?: string;
  logoAlt?: string;
}

interface AdminEmailTemplateProps {
  data: AdminEmailData;
  className?: string;
}

export const AdminEmailTemplate: React.FC<AdminEmailTemplateProps> = ({ 
  data, 
  className = '' 
}) => {
  return (
    <div className={`max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 ${className}`}>
      {/* Modern Header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-10 text-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        </div>
        
        {data.logoUrl && (
          <div className="relative mb-6">
            <img 
              src={data.logoUrl} 
              alt={data.logoAlt || 'Company Logo'} 
              className="h-12 mx-auto object-contain filter brightness-0 invert opacity-90"
            />
          </div>
        )}
        
        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-3 tracking-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            New Lead Alert
          </h1>
          <p className="text-slate-200 text-lg font-medium">
            High-priority inquiry requires immediate attention
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-10">
        {/* Priority Alert */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-xl p-6 mb-8 flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-amber-900 font-semibold text-lg mb-2">High Priority Inquiry</h3>
            <p className="text-amber-800 text-sm leading-relaxed">
              This lead requires immediate response. Recommended response time: <strong>within 2 hours</strong> for optimal conversion.
            </p>
          </div>
        </div>

        {/* Lead Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Contact Details */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Contact Details
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <User className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                    Full Name
                  </div>
                  <div className="text-gray-900 font-semibold text-lg">
                    {data.fullName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                    Email Address
                  </div>
                  <div className="text-gray-900 font-semibold">
                    <a 
                      href={`mailto:${data.email}`}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {data.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                    Phone Number
                  </div>
                  <div className="text-gray-900 font-semibold">
                    <a 
                      href={`tel:${data.mobile}`}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {data.mobile}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Details */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Inquiry Details
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <Building2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                    Service Type
                  </div>
                  <div className="text-gray-900 font-semibold">
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                      <Building2 className="w-4 h-4" />
                      {data.processType}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <Clock className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                    Submitted
                  </div>
                  <div className="text-gray-700 font-medium">
                    {data.timestamp}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <Calendar className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                    Lead Age
                  </div>
                  <div className="text-gray-700 font-medium">
                    Just received
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Section */}
        {data.message && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">
                Customer Message
              </h4>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {data.message}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href={`mailto:${data.email}?subject=Re: ${data.processType} Inquiry - Thank you for contacting us`}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Reply className="w-5 h-5" />
              Reply via Email
            </a>
            <a 
              href={`tel:${data.mobile}`}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Phone className="w-5 h-5" />
              Call Customer
            </a>
          </div>
        </div>

        {/* Lead Score & Recommendations */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">Lead Analysis</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">High</div>
              <div className="text-sm text-blue-700 font-medium">Priority Score</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-1">24h</div>
              <div className="text-sm text-green-700 font-medium">Response Time</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <div className="text-2xl font-bold text-purple-600 mb-1">85%</div>
              <div className="text-sm text-purple-700 font-medium">Conversion Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Footer */}
      <div className="bg-gradient-to-br from-slate-900 to-gray-900 text-white p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-slate-300" />
          <span className="text-slate-300 text-sm">Automated Lead Notification System</span>
        </div>
        <p className="text-slate-400 text-sm mb-2">
          This notification was automatically generated from your website contact form.
        </p>
        <p className="text-slate-500 text-xs">
          Generated on {new Date().toLocaleString()} • Lead ID: {Date.now()}
        </p>
      </div>
    </div>
  );
};

// For backward compatibility - converts React component to HTML string
export const createAdminEmailTemplate = (data: AdminEmailData): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Lead Alert</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; }
        .gradient-text { background: linear-gradient(to right, #ffffff, #e5e7eb); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      </style>
    </head>
    <body>
      <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div class="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-10 text-center overflow-hidden">
          <div class="absolute inset-0 opacity-10">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.3),transparent_50%)]"></div>
          </div>
          
          ${data.logoUrl ? `
          <div class="relative mb-6">
            <img src="${data.logoUrl}" alt="${data.logoAlt || 'Company Logo'}" class="h-12 mx-auto object-contain filter brightness-0 invert opacity-90" />
          </div>
          ` : ''}
          
          <div class="relative">
            <div class="w-16 h-16 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <h1 class="text-3xl font-bold mb-3 tracking-tight gradient-text">New Lead Alert</h1>
            <p class="text-slate-200 text-lg font-medium">High-priority inquiry requires immediate attention</p>
          </div>
        </div>
        
        <div class="p-10">
          <div class="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-xl p-6 mb-8 flex items-start gap-4">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-amber-900 font-semibold text-lg mb-2">High Priority Inquiry</h3>
              <p class="text-amber-800 text-sm leading-relaxed">This lead requires immediate response. Recommended response time: <strong>within 2 hours</strong> for optimal conversion.</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-gradient-to-br from-slate-50 to-gray-50 border border-gray-200 rounded-2xl p-6">
              <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900">Contact Details</h3>
              </div>
              
              <div class="space-y-4">
                <div class="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <svg class="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <div class="flex-1">
                    <div class="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Full Name</div>
                    <div class="text-gray-900 font-semibold text-lg">${data.fullName}</div>
                  </div>
                </div>
                
                <div class="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <svg class="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <div class="flex-1">
                    <div class="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Email Address</div>
                    <div class="text-gray-900 font-semibold">
                      <a href="mailto:${data.email}" class="text-blue-600 hover:text-blue-700 transition-colors">${data.email}</a>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <svg class="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <div class="flex-1">
                    <div class="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Phone Number</div>
                    <div class="text-gray-900 font-semibold">
                      <a href="tel:${data.mobile}" class="text-blue-600 hover:text-blue-700 transition-colors">${data.mobile}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-gradient-to-br from-slate-50 to-gray-50 border border-gray-200 rounded-2xl p-6">
              <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900">Inquiry Details</h3>
              </div>
              
              <div class="space-y-4">
                <div class="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  <div class="flex-1">
                    <div class="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Service Type</div>
                    <div class="text-gray-900 font-semibold">
                      <span class="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                        ${data.processType}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                  <div class="flex-1">
                    <div class="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Submitted</div>
                    <div class="text-gray-700 font-medium">${data.timestamp}</div>
                  </div>
                </div>
                
                <div class="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <div class="flex-1">
                    <div class="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Lead Age</div>
                    <div class="text-gray-700 font-medium">Just received</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          ${data.message ? `
          <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <h4 class="text-lg font-bold text-gray-900">Customer Message</h4>
            </div>
            <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div class="text-gray-700 leading-relaxed whitespace-pre-wrap">${data.message}</div>
            </div>
          </div>
          ` : ''}
          
          <div class="bg-gradient-to-br from-slate-50 to-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="mailto:${data.email}?subject=Re: ${data.processType} Inquiry - Thank you for contacting us" class="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                </svg>
                Reply via Email
              </a>
              <a href="tel:${data.mobile}" class="flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                Call Customer
              </a>
            </div>
          </div>
          
          <div class="bg-white border border-gray-200 rounded-2xl p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
              <h4 class="text-lg font-bold text-gray-900">Lead Analysis</h4>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div class="text-2xl font-bold text-blue-600 mb-1">High</div>
                <div class="text-sm text-blue-700 font-medium">Priority Score</div>
              </div>
              <div class="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div class="text-2xl font-bold text-green-600 mb-1">24h</div>
                <div class="text-sm text-green-700 font-medium">Response Time</div>
              </div>
              <div class="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div class="text-2xl font-bold text-purple-600 mb-1">85%</div>
                <div class="text-sm text-purple-700 font-medium">Conversion Rate</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-gradient-to-br from-slate-900 to-gray-900 text-white p-8 text-center">
          <div class="flex items-center justify-center gap-2 mb-4">
            <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="text-slate-300 text-sm">Automated Lead Notification System</span>
          </div>
          <p class="text-slate-400 text-sm mb-2">This notification was automatically generated from your website contact form.</p>
          <p class="text-slate-500 text-xs">Generated on ${new Date().toLocaleString()} • Lead ID: ${Date.now()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
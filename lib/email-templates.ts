// Import React Email templates
import { renderAdminNotificationEmail, renderUserConfirmationEmail, type EmailData } from './react-email-templates';

/**
 * @deprecated Use renderAdminNotificationEmail from './react-email-templates' instead
 * This function is kept for backward compatibility
 */
export const createAdminEmailTemplate = async (data: EmailData): Promise<string> => {
  try {
    return await renderAdminNotificationEmail(data);
  } catch (error) {
    console.warn('React Email failed, falling back to legacy template:', error);
    // Fallback to original template
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          line-height: 1.5;
          color: #1a1a1a;
          background-color: #f8fafc;
        }
        .gradient-bg {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        }
        .badge {
          background-color: #e0e7ff;
          color: #4f46e5;
        }
      </style>
    </head>
    <body class="bg-gray-50">
      <div class="max-w-2xl mx-auto my-8 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <!-- Header -->
        <div class="gradient-bg text-white p-8 text-center relative overflow-hidden">
          <div class="absolute inset-0 opacity-5" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI0ZGRiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+');"></div>
          
          ${data.logoUrl ? `
          <div class="mb-6">
            <img src="${data.logoUrl}" alt="${data.logoAlt || 'Company Logo'}" class="h-10 mx-auto object-contain" />
          </div>
          ` : ''}
          
          <div class="relative z-10">
            <div class="w-14 h-14 mx-auto mb-5 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h1 class="text-2xl font-bold mb-2 tracking-tight">New Contact Inquiry</h1>
            <p class="text-blue-100 text-base opacity-90">A potential client has reached out</p>
          </div>
        </div>
        
        <!-- Content -->
        <div class="p-8">
          <!-- Alert -->
          <div class="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex items-start gap-3">
            <div class="flex-shrink-0">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-blue-800 mb-1">Action Required</h3>
              <p class="text-blue-700 text-sm">Please respond within 24 hours to maintain service quality.</p>
            </div>
          </div>
          
          <!-- Contact Card -->
          <div class="bg-white border border-gray-100 rounded-xl p-6 mb-8 shadow-xs">
            <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <h3 class="text-lg font-semibold text-gray-900">Contact Details</h3>
            </div>
            
            <div class="space-y-4">
              <!-- Name -->
              <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0 p-1.5 bg-blue-50 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Full Name</div>
                  <div class="text-gray-900 font-medium">${data.fullName}</div>
                </div>
              </div>
              
              <!-- Email -->
              <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0 p-1.5 bg-blue-50 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Email Address</div>
                  <div class="text-gray-900 font-medium">
                    <a href="mailto:${data.email}" class="text-blue-600 hover:text-blue-700 transition-colors">${data.email}</a>
                  </div>
                </div>
              </div>
              
              <!-- Phone -->
              <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0 p-1.5 bg-blue-50 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Phone Number</div>
                  <div class="text-gray-900 font-medium">
                    <a href="tel:${data.mobile}" class="text-blue-600 hover:text-blue-700 transition-colors">${data.mobile}</a>
                  </div>
                </div>
              </div>
              
              <!-- Service Type -->
              <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0 p-1.5 bg-blue-50 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Service Type</div>
                  <div class="text-gray-900 font-medium">
                    <span class="inline-flex items-center gap-1.5 badge px-3 py-1 rounded-full text-sm font-medium">
                      ${data.processType}
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Timestamp -->
              <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0 p-1.5 bg-blue-50 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Submitted</div>
                  <div class="text-gray-500 text-sm">${data.timestamp}</div>
                </div>
              </div>
            </div>
          </div>
          
          ${data.message ? `
          <!-- Message -->
          <div class="bg-white border border-gray-100 rounded-xl p-6 mb-8 shadow-xs">
            <div class="flex items-center gap-3 mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <h4 class="text-lg font-semibold text-gray-900">Client Message</h4>
            </div>
            <div class="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">${data.message}</div>
          </div>
          ` : ''}
          
          <!-- CTA -->
          <div class="text-center my-8">
            <a href="mailto:${data.email}?subject=Re: ${data.processType} Inquiry - Thank you for contacting us" class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
              </svg>
              Reply to ${data.fullName}
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="bg-gray-50 p-6 text-center border-t border-gray-100">
          <p class="text-gray-500 text-sm mb-1">This email was automatically generated from your website contact form.</p>
          <p class="text-gray-500 text-sm">For support, please contact your system administrator.</p>
          <p class="text-gray-400 text-xs mt-3">Generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
  }
};

/**
 * @deprecated Use renderUserConfirmationEmail from './react-email-templates' instead
 * This function is kept for backward compatibility
 */
export const createUserEmailTemplate = async (data: EmailData): Promise<string> => {
  try {
    return await renderUserConfirmationEmail(data);
  } catch (error) {
    console.warn('React Email failed, falling back to legacy template:', error);
    // Fallback to original template
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Your Inquiry</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          line-height: 1.5;
          color: #1a1a1a;
          background-color: #f8fafc;
        }
        .gradient-bg {
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
        }
        .badge {
          background-color: #e0e7ff;
          color: #4f46e5;
        }
      </style>
    </head>
    <body class="bg-gray-50">
      <div class="max-w-2xl mx-auto my-8 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <!-- Header -->
        <div class="gradient-bg text-white p-8 text-center relative overflow-hidden">
          <div class="absolute inset-0 opacity-5" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI0ZGRiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+');"></div>
          
          ${data.logoUrl ? `
          <div class="mb-6">
            <img src="${data.logoUrl}" alt="${data.logoAlt || 'Company Logo'}" class="h-10 mx-auto object-contain" />
          </div>
          ` : ''}
          
          <div class="relative z-10">
            <div class="w-14 h-14 mx-auto mb-5 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h1 class="text-2xl font-bold mb-2 tracking-tight">Thank You for Contacting Us</h1>
            <p class="text-blue-100 text-base opacity-90">We've received your message and will get back to you soon</p>
          </div>
        </div>
        
        <!-- Content -->
        <div class="p-8">
          <!-- Greeting -->
          <div class="text-center mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Dear ${data.fullName},</h2>
            <p class="text-gray-600">Thank you for your interest in our <strong>${data.processType}</strong> services.</p>
          </div>
          
          <!-- Confirmation -->
          <div class="bg-green-50 border border-green-100 rounded-xl p-6 mb-8 text-center relative overflow-hidden">
            <div class="absolute inset-0 opacity-5" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzA3QjEyNSIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+');"></div>
            <svg class="w-10 h-10 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Inquiry Received Successfully</h3>
            <p class="text-gray-600 leading-relaxed">We've received your inquiry and our team will review it shortly. You can expect a response within 24 hours.</p>
          </div>
          
          <!-- Details -->
          <div class="bg-white border border-gray-100 rounded-xl p-6 mb-8 shadow-xs">
            <div class="flex items-center gap-3 mb-6">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <h3 class="text-lg font-semibold text-gray-900">Your Inquiry Details</h3>
            </div>
            
            <div class="space-y-4">
              <!-- Service Type -->
              <div class="flex items-start gap-3 pb-4 border-b border-gray-100">
                <div class="flex-shrink-0 p-1.5 bg-blue-50 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Service Type</div>
                  <div class="text-gray-900 font-medium">
                    <span class="inline-block badge px-3 py-1 rounded-full text-sm font-medium">${data.processType}</span>
                  </div>
                </div>
              </div>
              
              <!-- Email -->
              <div class="flex items-start gap-3 pb-4 border-b border-gray-100">
                <div class="flex-shrink-0 p-1.5 bg-blue-50 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Email Address</div>
                  <div class="text-gray-900 font-medium">${data.email}</div>
                </div>
              </div>
              
              <!-- Phone -->
              <div class="flex items-start gap-3 pb-4 border-b border-gray-100">
                <div class="flex-shrink-0 p-1.5 bg-blue-50 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Phone Number</div>
                  <div class="text-gray-900 font-medium">${data.mobile}</div>
                </div>
              </div>
              
              ${data.message ? `
              <!-- Message -->
              <div class="flex items-start gap-3 pb-4 border-b border-gray-100">
                <div class="flex-shrink-0 p-1.5 bg-blue-50 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Your Message</div>
                  <div class="text-gray-700 bg-gray-50 p-3 rounded-lg">${data.message}</div>
                </div>
              </div>
              ` : ''}
              
              <!-- Timestamp -->
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 p-1.5 bg-blue-50 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Submitted On</div>
                  <div class="text-gray-500 text-sm">${data.timestamp}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Next Steps -->
          <div class="bg-white border border-gray-100 rounded-xl p-6 mb-8 shadow-xs">
            <div class="flex items-center gap-3 mb-6">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
              <h3 class="text-lg font-semibold text-gray-900">What Happens Next</h3>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                <div>
                  <h4 class="text-gray-900 font-medium mb-1">Initial Review</h4>
                  <p class="text-gray-600 text-sm">Our team will review your requirements within 24 hours</p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                <div>
                  <h4 class="text-gray-900 font-medium mb-1">Detailed Proposal</h4>
                  <p class="text-gray-600 text-sm">We'll contact you with a detailed proposal and quote</p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                <div>
                  <h4 class="text-gray-900 font-medium mb-1">Discussion</h4>
                  <p class="text-gray-600 text-sm">We'll discuss timelines, specifications, and answer your questions</p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mt-0.5">4</div>
                <div>
                  <h4 class="text-gray-900 font-medium mb-1">Finalization</h4>
                  <p class="text-gray-600 text-sm">We'll work together to finalize the solution</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- CTA -->
          <div class="text-center mb-8">
            <a href="tel:+919373102887" class="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              Call Now: +91 93731 02887
            </a>
          </div>
          
          <!-- Contact Info -->
          <div class="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center p-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                </div>
                <div>
                  <h4 class="text-gray-900 font-medium text-sm">Response Time</h4>
                  <p class="text-gray-600 text-sm">Typically within 24 hours</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center p-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <h4 class="text-gray-900 font-medium text-sm">Urgent Inquiries</h4>
                  <p class="text-gray-600 text-sm">Call us directly at +91 93731 02887</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center p-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <h4 class="text-gray-900 font-medium text-sm">Email</h4>
                  <p class="text-gray-600 text-sm">You can reply directly to this email</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="bg-gray-50 p-6 text-center border-t border-gray-100">
          <p class="text-gray-500 text-sm mb-1">This is an automated confirmation email. For immediate assistance, please call us.</p>
          <p class="text-gray-500 text-sm">© ${new Date().getFullYear()} All Rights Reserved</p>
          <p class="text-gray-400 text-xs mt-3">Generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
  }
};
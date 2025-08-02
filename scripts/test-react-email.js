const fs = require('fs');
const path = require('path');

// This is a demonstration script to test the React Email templates
// In a real application, you would use TypeScript and import the functions

console.log('React Email Template Test');
console.log('========================');

// Mock data for testing
const testData = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  mobile: '+91 98765 43210',
  processType: 'Zinc Plating',
  message: 'I need a quote for zinc plating services for automotive parts. Please provide detailed pricing and timeline.',
  timestamp: new Date().toISOString(),
  logoUrl: 'https://via.placeholder.com/120x40/2563eb/ffffff?text=Your+Logo',
  logoAlt: 'Your Company Name',
};

console.log('Test Data:');
console.log(JSON.stringify(testData, null, 2));
console.log('\n');

// In a real implementation, you would use:
/*
import { 
  renderAdminNotificationEmail, 
  renderUserConfirmationEmail,
  generateContactFormEmails 
} from '../lib/react-email-templates';

// Generate emails
const { adminEmailHtml, userEmailHtml } = generateContactFormEmails({
  fullName: testData.fullName,
  email: testData.email,
  mobile: testData.mobile,
  processType: testData.processType,
  message: testData.message,
});

// Save to files for preview
fs.writeFileSync('admin-email.html', adminEmailHtml);
fs.writeFileSync('user-email.html', userEmailHtml);

console.log('✅ Email templates generated successfully!');
console.log('📁 Check admin-email.html and user-email.html for preview');
*/

console.log('To test the React Email templates:');
console.log('1. Import the functions from lib/react-email-templates.ts');
console.log('2. Use generateContactFormEmails() with your form data');
console.log('3. Send the HTML output via your email service (Nodemailer, Resend, etc.)');
console.log('\n');

console.log('Example usage with Nodemailer:');
console.log(`
import nodemailer from 'nodemailer';
import { generateContactFormEmails } from './lib/react-email-templates';

const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

// Generate emails
const { adminEmailHtml, userEmailHtml } = generateContactFormEmails({
  fullName: 'John Doe',
  email: 'john@example.com',
  mobile: '+1234567890',
  processType: 'Zinc Plating',
  message: 'I need a quote for zinc plating services.',
});

// Send admin notification
await transporter.sendMail({
  from: 'noreply@yourdomain.com',
  to: 'admin@yourdomain.com',
  subject: 'New Contact Form Submission',
  html: adminEmailHtml,
});

// Send user confirmation
await transporter.sendMail({
  from: 'noreply@yourdomain.com',
  to: 'john@example.com',
  subject: 'Thank you for your inquiry',
  html: userEmailHtml,
});
`);

console.log('\n✅ React Email system is ready to use!');
console.log('📚 See REACT_EMAIL_SETUP.md for detailed documentation'); 
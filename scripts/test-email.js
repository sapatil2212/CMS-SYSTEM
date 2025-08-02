const nodemailer = require('nodemailer');

// Test email configuration
const testEmailConfig = {
  EMAIL_USERNAME: 'saptechnoeditors@gmail.com',
  EMAIL_PASSWORD: 'uyqhyiptjkarfgdq'
};

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: testEmailConfig.EMAIL_USERNAME,
      pass: testEmailConfig.EMAIL_PASSWORD,
    },
  });
};

// Test email data
const testData = {
  fullName: 'Test User',
  email: 'test@example.com',
  mobile: '+1234567890',
  processType: 'Zinc Plating',
  message: 'This is a test message',
  timestamp: new Date().toLocaleString(),
  adminEmail: 'saptechnoeditors@gmail.com',
  logoUrl: undefined,
  logoAlt: undefined
};

// Simple HTML template for testing
const createSimpleAdminTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test Email</title>
    </head>
    <body>
      <h1>Test Contact Form Email</h1>
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.mobile}</p>
      <p><strong>Process:</strong> ${data.processType}</p>
      <p><strong>Message:</strong> ${data.message}</p>
      <p><strong>Timestamp:</strong> ${data.timestamp}</p>
    </body>
    </html>
  `;
};

const createSimpleUserTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Thank You</title>
    </head>
    <body>
      <h1>Thank You for Your Inquiry</h1>
      <p>Dear ${data.fullName},</p>
      <p>We have received your inquiry about ${data.processType}.</p>
      <p>We will get back to you within 24 hours.</p>
      <p>Best regards,<br>Your Team</p>
    </body>
    </html>
  `;
};

// Send test email
const sendTestEmail = async () => {
  try {
    console.log('Testing email functionality...');
    
    const transporter = createTransporter();
    
    // Test admin email
    const adminHtml = createSimpleAdminTemplate(testData);
    const adminResult = await transporter.sendMail({
      from: `"Contact Form" <${testEmailConfig.EMAIL_USERNAME}>`,
      to: testData.adminEmail,
      subject: `Test Contact Form Submission - ${testData.processType}`,
      html: adminHtml,
    });
    
    console.log('Admin email sent successfully:', adminResult.messageId);
    
    // Test user email
    const userHtml = createSimpleUserTemplate(testData);
    const userResult = await transporter.sendMail({
      from: `"Contact Form" <${testEmailConfig.EMAIL_USERNAME}>`,
      to: testData.email,
      subject: 'Test: Thank You for Your Inquiry',
      html: userHtml,
    });
    
    console.log('User email sent successfully:', userResult.messageId);
    
    console.log('✅ Email test completed successfully!');
    
  } catch (error) {
    console.error('❌ Email test failed:', error);
  }
};

// Run the test
sendTestEmail(); 
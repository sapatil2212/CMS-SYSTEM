import nodemailer from 'nodemailer';
import { createAdminEmailTemplate, createUserEmailTemplate } from './email-templates';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send email function
export const sendEmail = async (
  to: string,
  subject: string,
  htmlContent: string
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Contact Form" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Send contact form emails
export const sendContactFormEmails = async (data: {
  fullName: string;
  email: string;
  mobile: string;
  processType: string;
  message?: string;
  timestamp: string;
  adminEmail: string;
  logoUrl?: string;
  logoAlt?: string;
}) => {
  try {
    // Send to admin
    const adminHtml = await createAdminEmailTemplate(data);
    const adminSent = await sendEmail(
      data.adminEmail,
      `New Contact Form Submission - ${data.processType}`,
      adminHtml
    );

    // Send confirmation to user
    const userHtml = await createUserEmailTemplate(data);
    const userSent = await sendEmail(
      data.email,
      'Thank You for Your Inquiry - We\'ll Get Back to You Soon',
      userHtml
    );

    return {
      adminSent,
      userSent,
      success: adminSent && userSent
    };
  } catch (error) {
    console.error('Error sending contact form emails:', error);
    return {
      adminSent: false,
      userSent: false,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}; 
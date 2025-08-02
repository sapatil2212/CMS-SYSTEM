import { render } from '@react-email/render';
import React from 'react';
import { AdminNotificationEmail } from '../components/emails/AdminNotificationEmail';
import { UserConfirmationEmail } from '../components/emails/UserConfirmationEmail';

interface EmailData {
  fullName: string;
  email: string;
  mobile: string;
  processType: string;
  message?: string;
  timestamp: string;
  logoUrl?: string;
  logoAlt?: string;
}

/**
 * Renders the admin notification email to HTML string
 * @param data - Email data containing user information
 * @returns HTML string for the admin notification email
 */
export const renderAdminNotificationEmail = async (data: EmailData): Promise<string> => {
  const emailComponent = React.createElement(AdminNotificationEmail, {
    fullName: data.fullName,
    email: data.email,
    mobile: data.mobile,
    processType: data.processType,
    message: data.message,
    timestamp: data.timestamp,
    logoUrl: data.logoUrl,
    logoAlt: data.logoAlt,
  });

  return await render(emailComponent);
};

/**
 * Renders the user confirmation email to HTML string
 * @param data - Email data containing user information
 * @returns HTML string for the user confirmation email
 */
export const renderUserConfirmationEmail = async (data: EmailData): Promise<string> => {
  const emailComponent = React.createElement(UserConfirmationEmail, {
    fullName: data.fullName,
    email: data.email,
    mobile: data.mobile,
    processType: data.processType,
    message: data.message,
    timestamp: data.timestamp,
    logoUrl: data.logoUrl,
    logoAlt: data.logoAlt,
  });

  return await render(emailComponent);
};

/**
 * Formats timestamp for email display
 * @param timestamp - ISO timestamp string
 * @returns Formatted timestamp string
 */
export const formatEmailTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Creates email data object with formatted timestamp
 * @param data - Raw email data
 * @returns Email data with formatted timestamp
 */
export const createEmailData = (data: Omit<EmailData, 'timestamp'> & { timestamp?: string }): EmailData => {
  return {
    ...data,
    timestamp: data.timestamp || new Date().toISOString(),
  };
};

/**
 * Example usage function to demonstrate how to use the React Email templates
 * This function shows how to generate both admin and user emails
 */
export const generateContactFormEmails = async (formData: {
  fullName: string;
  email: string;
  mobile: string;
  processType: string;
  message?: string;
}) => {
  const emailData = createEmailData({
    ...formData,
    logoUrl: 'https://your-domain.com/logo.png', // Replace with your actual logo URL
    logoAlt: 'Your Company Name',
  });

  // Generate admin notification email
  const adminEmailHtml = await renderAdminNotificationEmail(emailData);
  
  // Generate user confirmation email
  const userEmailHtml = await renderUserConfirmationEmail(emailData);

  return {
    adminEmailHtml,
    userEmailHtml,
    emailData,
  };
};

// Export types for use in other files
export type { EmailData }; 
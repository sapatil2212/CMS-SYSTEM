import React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Button,
  Row,
  Column,
} from '@react-email/components';

interface UserConfirmationEmailProps {
  fullName: string;
  email: string;
  mobile: string;
  processType: string;
  message?: string;
  timestamp: string;
  logoUrl?: string;
  logoAlt?: string;
}

export const UserConfirmationEmail: React.FC<UserConfirmationEmailProps> = ({
  fullName,
  email,
  mobile,
  processType,
  message,
  timestamp,
  logoUrl,
  logoAlt = 'Company Logo',
}) => {
  const formattedTimestamp = new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Html>
      <Head />
      <Preview>Thank you for your inquiry - We've received your message</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Row>
              <Column style={headerContent}>
                {logoUrl && (
                  <Img
                    src={logoUrl}
                    alt={logoAlt}
                    width="120"
                    height="40"
                    style={logo}
                  />
                )}
                <Heading style={h1}>Thank You for Contacting Us</Heading>
                <Text style={headerSubtitle}>
                  We've received your message and will get back to you soon
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Greeting */}
          <Section style={section}>
            <Text style={greeting}>Dear {fullName},</Text>
            <Text style={greetingText}>
              Thank you for your interest in our <strong>{processType}</strong> services.
            </Text>
          </Section>

          {/* Confirmation */}
          <Section style={confirmationSection}>
            <Text style={confirmationTitle}>Inquiry Received Successfully</Text>
            <Text style={confirmationText}>
              We've received your inquiry and our team will review it shortly. 
              You can expect a response within 24 hours.
            </Text>
          </Section>

          {/* Details */}
          <Section style={section}>
            <Heading style={h2}>Your Inquiry Details</Heading>
            <Row>
              <Column style={detailRow}>
                <Text style={detailLabel}>Service Type</Text>
                <Text style={serviceBadge}>{processType}</Text>
              </Column>
            </Row>
            <Row>
              <Column style={detailRow}>
                <Text style={detailLabel}>Email Address</Text>
                <Text style={detailValue}>{email}</Text>
              </Column>
            </Row>
            <Row>
              <Column style={detailRow}>
                <Text style={detailLabel}>Phone Number</Text>
                <Text style={detailValue}>{mobile}</Text>
              </Column>
            </Row>
            {message && (
              <Row>
                <Column style={detailRow}>
                  <Text style={detailLabel}>Your Message</Text>
                  <Text style={messageText}>{message}</Text>
                </Column>
              </Row>
            )}
            <Row>
              <Column style={detailRow}>
                <Text style={detailLabel}>Submitted On</Text>
                <Text style={detailValue}>{formattedTimestamp}</Text>
              </Column>
            </Row>
          </Section>

          {/* Next Steps */}
          <Section style={section}>
            <Heading style={h2}>What Happens Next</Heading>
            <Row>
              <Column style={stepRow}>
                <Text style={stepNumber}>1</Text>
                <Text style={stepTitle}>Initial Review</Text>
                <Text style={stepText}>Our team will review your requirements within 24 hours</Text>
              </Column>
            </Row>
            <Row>
              <Column style={stepRow}>
                <Text style={stepNumber}>2</Text>
                <Text style={stepTitle}>Detailed Proposal</Text>
                <Text style={stepText}>We'll contact you with a detailed proposal and quote</Text>
              </Column>
            </Row>
            <Row>
              <Column style={stepRow}>
                <Text style={stepNumber}>3</Text>
                <Text style={stepTitle}>Discussion</Text>
                <Text style={stepText}>We'll discuss timelines, specifications, and answer your questions</Text>
              </Column>
            </Row>
            <Row>
              <Column style={stepRow}>
                <Text style={stepNumber}>4</Text>
                <Text style={stepTitle}>Finalization</Text>
                <Text style={stepText}>We'll work together to finalize the solution</Text>
              </Column>
            </Row>
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Button href="tel:+919373102887" style={ctaButton}>
              Call Now: +91 93731 02887
            </Button>
          </Section>

          {/* Contact Info */}
          <Section style={contactSection}>
            <Row>
              <Column style={contactRow}>
                <Text style={contactTitle}>Response Time</Text>
                <Text style={contactText}>Typically within 24 hours</Text>
              </Column>
            </Row>
            <Row>
              <Column style={contactRow}>
                <Text style={contactTitle}>Urgent Inquiries</Text>
                <Text style={contactText}>Call us directly at +91 93731 02887</Text>
              </Column>
            </Row>
            <Row>
              <Column style={contactRow}>
                <Text style={contactTitle}>Email</Text>
                <Text style={contactText}>You can reply directly to this email</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This is an automated confirmation email. For immediate assistance, please call us.
            </Text>
            <Text style={footerText}>© {new Date().getFullYear()} All Rights Reserved</Text>
            <Text style={footerTimestamp}>
              Generated on {new Date().toLocaleString()}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f8fafc',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const header = {
  background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
  padding: '40px 20px',
  textAlign: 'center' as const,
  borderRadius: '12px 12px 0 0',
};

const headerContent = {
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto 20px',
  display: 'block',
};

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  lineHeight: '1.2',
};

const headerSubtitle = {
  color: '#e0e7ff',
  fontSize: '16px',
  margin: '0',
  opacity: '0.9',
};

const section = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '24px',
  margin: '20px 0',
};

const greeting = {
  color: '#111827',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 8px',
  textAlign: 'center' as const,
};

const greetingText = {
  color: '#6b7280',
  fontSize: '16px',
  margin: '0',
  textAlign: 'center' as const,
};

const confirmationSection = {
  backgroundColor: '#f0fdf4',
  border: '1px solid #bbf7d0',
  borderRadius: '8px',
  padding: '24px',
  margin: '20px 0',
  textAlign: 'center' as const,
};

const confirmationTitle = {
  color: '#166534',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const confirmationText = {
  color: '#166534',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0',
};

const h2 = {
  color: '#111827',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const detailRow = {
  padding: '12px 0',
  borderBottom: '1px solid #f3f4f6',
};

const detailLabel = {
  color: '#6b7280',
  fontSize: '12px',
  fontWeight: '500',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  margin: '0 0 4px',
};

const detailValue = {
  color: '#111827',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0',
};

const serviceBadge = {
  backgroundColor: '#e0e7ff',
  color: '#4f46e5',
  fontSize: '14px',
  fontWeight: '500',
  padding: '4px 12px',
  borderRadius: '16px',
  display: 'inline-block',
  margin: '0',
};

const messageText = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
  backgroundColor: '#f9fafb',
  padding: '16px',
  borderRadius: '8px',
};

const stepRow = {
  padding: '16px 0',
  borderBottom: '1px solid #f3f4f6',
};

const stepNumber = {
  backgroundColor: '#2563eb',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  display: 'inline-block',
  textAlign: 'center' as const,
  lineHeight: '24px',
  margin: '0 0 8px',
};

const stepTitle = {
  color: '#111827',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0 0 4px',
};

const stepText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const ctaButton = {
  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '500',
  padding: '16px 32px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
};

const contactSection = {
  backgroundColor: '#eff6ff',
  border: '1px solid #dbeafe',
  borderRadius: '8px',
  padding: '24px',
  margin: '20px 0',
};

const contactRow = {
  padding: '12px 0',
  borderBottom: '1px solid #dbeafe',
};

const contactTitle = {
  color: '#1e40af',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0 0 4px',
};

const contactText = {
  color: '#1e40af',
  fontSize: '14px',
  margin: '0',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const footer = {
  textAlign: 'center' as const,
  padding: '24px',
  backgroundColor: '#f9fafb',
  borderRadius: '0 0 12px 12px',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 4px',
};

const footerTimestamp = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '16px 0 0',
};

export default UserConfirmationEmail; 
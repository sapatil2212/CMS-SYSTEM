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

interface AdminNotificationEmailProps {
  fullName: string;
  email: string;
  mobile: string;
  processType: string;
  message?: string;
  timestamp: string;
  logoUrl?: string;
  logoAlt?: string;
}

export const AdminNotificationEmail: React.FC<AdminNotificationEmailProps> = ({
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
      <Preview>New Contact Form Submission - {fullName} ({processType})</Preview>
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
                <Heading style={h1}>New Contact Inquiry</Heading>
                <Text style={headerSubtitle}>A potential client has reached out</Text>
              </Column>
            </Row>
          </Section>

          {/* Alert */}
          <Section style={alertSection}>
            <Row>
              <Column style={alertContent}>
                <Text style={alertTitle}>Action Required</Text>
                <Text style={alertText}>
                  Please respond within 24 hours to maintain service quality.
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Contact Details */}
          <Section style={section}>
            <Heading style={h2}>Contact Details</Heading>
            <Row>
              <Column style={detailRow}>
                <Text style={detailLabel}>Full Name</Text>
                <Text style={detailValue}>{fullName}</Text>
              </Column>
            </Row>
            <Row>
              <Column style={detailRow}>
                <Text style={detailLabel}>Email Address</Text>
                <Link href={`mailto:${email}`} style={detailLink}>
                  {email}
                </Link>
              </Column>
            </Row>
            <Row>
              <Column style={detailRow}>
                <Text style={detailLabel}>Phone Number</Text>
                <Link href={`tel:${mobile}`} style={detailLink}>
                  {mobile}
                </Link>
              </Column>
            </Row>
            <Row>
              <Column style={detailRow}>
                <Text style={detailLabel}>Service Type</Text>
                <Text style={serviceBadge}>{processType}</Text>
              </Column>
            </Row>
            <Row>
              <Column style={detailRow}>
                <Text style={detailLabel}>Submitted</Text>
                <Text style={detailValue}>{formattedTimestamp}</Text>
              </Column>
            </Row>
          </Section>

          {/* Message */}
          {message && (
            <Section style={section}>
              <Heading style={h2}>Client Message</Heading>
              <Text style={messageText}>{message}</Text>
            </Section>
          )}

          {/* CTA */}
          <Section style={ctaSection}>
            <Button
              href={`mailto:${email}?subject=Re: ${processType} Inquiry - Thank you for contacting us`}
              style={ctaButton}
            >
              Reply to {fullName}
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This email was automatically generated from your website contact form.
            </Text>
            <Text style={footerText}>
              For support, please contact your system administrator.
            </Text>
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
  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
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

const alertSection = {
  backgroundColor: '#dbeafe',
  border: '1px solid #93c5fd',
  borderRadius: '8px',
  padding: '16px',
  margin: '20px 0',
};

const alertContent = {
  textAlign: 'left' as const,
};

const alertTitle = {
  color: '#1e40af',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 4px',
};

const alertText = {
  color: '#1e40af',
  fontSize: '14px',
  margin: '0',
};

const section = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '24px',
  margin: '20px 0',
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

const detailLink = {
  color: '#2563eb',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0',
  textDecoration: 'none',
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

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const ctaButton = {
  backgroundColor: '#2563eb',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '500',
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
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

export default AdminNotificationEmail; 
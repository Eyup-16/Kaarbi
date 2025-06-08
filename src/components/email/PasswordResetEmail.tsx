import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Row,
  Column,
  Heading,
  Link,
  Font,
} from "@react-email/components";

import * as React from "react";

interface PasswordResetEmailProps {
  resetUrl: string;
}

export default function PasswordResetEmail({ resetUrl }: PasswordResetEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <title>Reset Your Password - Kaarbi</title>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Reset your password for Kaarbi</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header Section */}
          <Section style={header}>
            <Row>
              <Column style={logoColumn}>
                <Text style={logoText}>
                  <strong>KAARBI</strong>
                </Text>
                <Text style={logoSubtext}>CAR MARKETPLACE</Text>
              </Column>
              <Column style={badgeColumn}>
                <Text style={badge}>Secure</Text>
              </Column>
            </Row>
            
            <Text style={emailIcon}>🔒</Text>
            <Heading as="h1" style={headerTitle}>
              Reset Your Password
            </Heading>
            <Text style={headerSubtitle}>
              We received a request to reset your password for your Kaarbi account.
            </Text>
          </Section>

          {/* Content Section */}
          <Section style={content}>
            <Text style={contentText}>
              Click the button below to create a new password. This link is secure and will expire in 24 hours for your protection.
            </Text>
            
            {resetUrl && (
              <table cellPadding="0" cellSpacing="0" border={0} style={{ margin: "0 auto 32px auto" }}>
                <tr>
                  <td 
                    style={{
                      backgroundColor: "#000000",
                      borderRadius: "8px",
                      textAlign: "center",
                      padding: "16px 32px",
                    }}
                  >
                    <a 
                      href={resetUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#ffffff",
                        textDecoration: "none",
                        fontWeight: "600",
                        fontSize: "16px",
                        lineHeight: "1.2",
                        display: "block",
                      }}
                    >
                      Reset My Password
                    </a>
                  </td>
                </tr>
              </table>
            )}
            
            <Text style={helpText}>
              If you didn&apos;t request a password reset, you can safely ignore this email. Your password won&apos;t be changed.
            </Text>
            
            <Text style={helpText}>
              Need help? Contact our support team at{" "}
              <Link href="mailto:support@kaarbi.com" style={supportLink}>
                support@kaarbi.com
              </Link>
            </Text>
          </Section>

          {/* Footer Section */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Need help?{" "}
              <Link href="mailto:support@kaarbi.com" style={footerLink}>
                Contact Support
              </Link>
            </Text>
            <Text style={footerCompany}>
              <strong>KAARBI</strong> • Your trusted car marketplace
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f8f9fa",
  fontFamily: "Inter, Arial, sans-serif",
  padding: "20px",
  lineHeight: "1.6",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  overflow: "hidden",
};

const header = {
  backgroundColor: "#dc2626", // Red color for password reset
  padding: "40px 32px",
  textAlign: "center" as const,
  color: "#ffffff",
};

const logoColumn = {
  textAlign: "left" as const,
  verticalAlign: "top" as const,
  width: "70%",
};

const badgeColumn = {
  textAlign: "right" as const,
  verticalAlign: "top" as const,
  width: "30%",
};

const logoText = {
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: "700",
  margin: "0 0 4px 0",
  lineHeight: "1.2",
};

const logoSubtext = {
  color: "#fecaca",
  fontSize: "11px",
  margin: "0",
  lineHeight: "1",
  letterSpacing: "0.5px",
};

const badge = {
  backgroundColor: "#b91c1c",
  color: "#ffffff",
  padding: "8px 14px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: "600",
  display: "inline-block",
  letterSpacing: "0.25px",
};

const emailIcon = {
  fontSize: "56px",
  margin: "32px 0 20px 0",
  lineHeight: "1",
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: "700",
  margin: "0 0 12px 0",
  lineHeight: "1.2",
};

const headerSubtitle = {
  color: "#fecaca",
  fontSize: "18px",
  margin: "0",
  lineHeight: "1.4",
  fontWeight: "400",
};

const content = {
  padding: "40px 32px",
  textAlign: "center" as const,
};

const contentText = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 32px 0",
  fontWeight: "400",
};

const helpText = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0 0 16px 0",
  lineHeight: "1.5",
  fontWeight: "400",
};

const supportLink = {
  color: "#dc2626",
  textDecoration: "underline",
  fontWeight: "500",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "0",
  borderWidth: "1px 0 0 0",
  borderStyle: "solid",
};

const footer = {
  backgroundColor: "#f9fafb",
  padding: "32px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0 0 12px 0",
  lineHeight: "1.5",
  fontWeight: "400",
};

const footerLink = {
  color: "#dc2626",
  textDecoration: "underline",
  fontWeight: "500",
};

const footerCompany = {
  color: "#9ca3af",
  fontSize: "12px",
  margin: "0",
  lineHeight: "1.4",
  fontWeight: "500",
};

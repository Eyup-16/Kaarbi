'use server'
import nodemailer, { SentMessageInfo } from "nodemailer";
import { render } from '@react-email/components';
import VerificationEmail from '@/components/email/EmailTemplate';
import PasswordResetEmail from '@/components/email/PasswordResetEmail';
// Types
interface EmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  message?: string;
}

// Constants
const DEV_EMAIL = 'dev@localhost.co';
const PROD_EMAIL = process.env.GMAIL_USER || 'admin@kaarbi.com';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const sendEmail = async ({ to, subject, text, html }: EmailParams): Promise<EmailResponse> => {
  // Validate email address
  const sanitizedEmail = to.toLowerCase().trim();
  if (!EMAIL_REGEX.test(sanitizedEmail)) {
    return {
      success: false,
      message: "Invalid email address format"
    };
  }

  // Validate required fields
  if (!subject.trim() || !text.trim()) {
    return {
      success: false,
      message: "Subject and text are required"
    };
  }

  // Create transporter based on environment
  const transporter = process.env.NODE_ENV === 'production'
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      })
    : nodemailer.createTransport({
        host: 'localhost',
        port: 1025,
        secure: false,
        ignoreTLS: true,
      });

      // Use provided HTML or render appropriate template based on URL pattern
      let emailHtml = html;
      if (html && html.startsWith('http')) {
        if (html.includes('reset-password') || html.includes('password-reset')) {
          emailHtml = await render(PasswordResetEmail({ resetUrl: html }));
        } else {
          emailHtml = await render(VerificationEmail({ verificationUrl: html }));
        }
      }
      
      const fromEmail = process.env.NODE_ENV === 'development' ? DEV_EMAIL : PROD_EMAIL;

  try {
    const info: SentMessageInfo = await transporter.sendMail({
      from: fromEmail,
      to: sanitizedEmail,
      subject: subject.trim(),
      text: text.trim(),
      html: emailHtml
    });

    if (process.env.NODE_ENV === 'development') {
      console.log("Preview URL: http://localhost:1080"); // MailDev web interface
    }

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: process.env.NODE_ENV === 'development'
        ? "Failed to send email. Is your local MailDev running?"
        : "Failed to send email. Please check your Gmail configuration.",
    };
  }
}
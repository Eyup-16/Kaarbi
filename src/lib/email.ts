'use server'
import nodemailer, { SentMessageInfo } from "nodemailer";
import { MailtrapTransport } from "mailtrap"

// Types
interface EmailParams {
  to: string;
  subject: string;
  text: string;
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  message?: string;
}

// Constants
const TOKEN = process.env.MAILTRAP_TOKEN || '';
const DEV_EMAIL = 'dev@localhost.co';
const PROD_EMAIL = 'admin@kaarbi.com';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const sendEmail = async ({ to, subject, text }: EmailParams): Promise<EmailResponse> => {
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
    ? nodemailer.createTransport(
        MailtrapTransport({
          token: TOKEN
        })
      )
    : nodemailer.createTransport({
        host: 'localhost',
        port: 1025,
        secure: false,
        ignoreTLS: true,
      });

  const fromEmail = process.env.NODE_ENV === 'development' ? DEV_EMAIL : PROD_EMAIL;

  try {
    const info: SentMessageInfo = await transporter.sendMail({
      from: fromEmail,
      to: sanitizedEmail,
      subject: subject.trim(),
      text: text.trim(),
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
        ? "Failed to send email. Is your local MailDev/MailHog running?"
        : "Failed to send email. Please try again later.",
    };
  }
}
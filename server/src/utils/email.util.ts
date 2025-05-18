import nodemailer from 'nodemailer';
import { logger } from './logger.util';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Verify Your Email',
      html: `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });
  } catch (error) {
    logger.error('Error sending verification email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset</h1>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 10 minutes.</p>
      `,
    });
  } catch (error) {
    logger.error('Error sending password reset email:', error);
    throw error;
  }
}; 
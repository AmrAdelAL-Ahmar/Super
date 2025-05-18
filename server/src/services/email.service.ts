import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.util';
import { IUser } from '../interfaces/models/user.interface';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendVerificationEmail(user: IUser, token: string): Promise<void> {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
      
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: 'Verify Your Email',
        html: `
          <h1>Welcome to Our Platform!</h1>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${verificationUrl}">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        `
      });
    } catch (error) {
      logger.error('Send verification email error:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(user: IUser, token: string): Promise<void> {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: 'Reset Your Password',
        html: `
          <h1>Password Reset Request</h1>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `
      });
    } catch (error) {
      logger.error('Send password reset email error:', error);
      throw error;
    }
  }

  async sendOrderConfirmationEmail(user: IUser, orderNumber: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: 'Order Confirmation',
        html: `
          <h1>Order Confirmed!</h1>
          <p>Your order #${orderNumber} has been confirmed.</p>
          <p>We'll notify you when your order ships.</p>
          <p>Thank you for shopping with us!</p>
        `
      });
    } catch (error) {
      logger.error('Send order confirmation email error:', error);
      throw error;
    }
  }

  async sendOrderStatusUpdateEmail(user: IUser, orderNumber: string, status: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: 'Order Status Update',
        html: `
          <h1>Order Status Update</h1>
          <p>Your order #${orderNumber} status has been updated to: ${status}</p>
          <p>Track your order here: ${process.env.FRONTEND_URL}/orders/${orderNumber}</p>
        `
      });
    } catch (error) {
      logger.error('Send order status update email error:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(user: IUser): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: 'Welcome to Our Platform!',
        html: `
          <h1>Welcome ${user.firstName}!</h1>
          <p>Thank you for joining our platform.</p>
          <p>We're excited to have you on board!</p>
          <p>Get started by exploring our products: ${process.env.FRONTEND_URL}/products</p>
        `
      });
    } catch (error) {
      logger.error('Send welcome email error:', error);
      throw error;
    }
  }

  async sendBulkEmail(
    subject: string, 
    message: string, 
    recipients: string[], 
    attachments?: Array<{ filename: string; path: string }>
  ): Promise<void> {
    try {
      // Check if we have valid recipients
      if (!recipients || recipients.length === 0) {
        throw new Error('No recipients provided for bulk email');
      }

      // Split recipients into chunks to avoid email server limits
      const chunkSize = 50;
      const recipientChunks = [];
      for (let i = 0; i < recipients.length; i += chunkSize) {
        recipientChunks.push(recipients.slice(i, i + chunkSize));
      }

      // Send emails to each chunk of recipients
      for (const chunk of recipientChunks) {
        await this.transporter.sendMail({
          from: process.env.SMTP_FROM,
          bcc: chunk, // Use BCC for privacy
          subject: subject,
          html: message,
          attachments: attachments || []
        });
        
        // Add a small delay between chunks to prevent rate limiting
        if (recipientChunks.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      logger.info(`Bulk email sent to ${recipients.length} recipients`);
    } catch (error) {
      logger.error('Send bulk email error:', error);
      throw error;
    }
  }
} 
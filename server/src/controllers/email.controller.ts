import { Response } from 'express';
import { EmailService } from '../services/email.service';
import { logger } from '../utils/logger.util';
import { AuthRequest } from '../interfaces/auth.interface';
import { emailValidation } from '../validations/email.validation';
import { validateSchema } from '../middleware/validation.middleware';
import { IUser } from '../interfaces/models/user.interface';
import UserModel from '../models/user.model';

export class EmailController {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  sendVerificationEmail = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const validatedData = await validateSchema(emailValidation.sendVerificationEmail, req.body);
      const user = await this.getUserById(req.user._id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      await this.emailService.sendVerificationEmail(user, validatedData.token);
      res.status(200).json({
        success: true,
        message: 'Verification email sent successfully'
      });
    } catch (error) {
      logger.error('Send verification email error:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending verification email'
      });
    }
  };

  sendPasswordResetEmail = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const validatedData = await validateSchema(emailValidation.sendPasswordResetEmail, req.body);
      const user = await this.getUserById(req.user._id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      await this.emailService.sendPasswordResetEmail(user, validatedData.token);
      res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully'
      });
    } catch (error) {
      logger.error('Send password reset email error:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending password reset email'
      });
    }
  };

  sendOrderConfirmationEmail = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const validatedData = await validateSchema(emailValidation.sendOrderConfirmationEmail, req.body);
      const user = await this.getUserById(req.user._id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      await this.emailService.sendOrderConfirmationEmail(user, validatedData.orderNumber);
      res.status(200).json({
        success: true,
        message: 'Order confirmation email sent successfully'
      });
    } catch (error) {
      logger.error('Send order confirmation email error:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending order confirmation email'
      });
    }
  };

  sendOrderStatusUpdateEmail = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const validatedData = await validateSchema(emailValidation.sendOrderStatusUpdateEmail, req.body);
      const user = await this.getUserById(req.user._id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      await this.emailService.sendOrderStatusUpdateEmail(
        user,
        validatedData.orderNumber,
        validatedData.status
      );
      res.status(200).json({
        success: true,
        message: 'Order status update email sent successfully'
      });
    } catch (error) {
      logger.error('Send order status update email error:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending order status update email'
      });
    }
  };

  sendWelcomeEmail = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const user = await this.getUserById(req.user._id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      await this.emailService.sendWelcomeEmail(user);
      res.status(200).json({
        success: true,
        message: 'Welcome email sent successfully'
      });
    } catch (error) {
      logger.error('Send welcome email error:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending welcome email'
      });
    }
  };

  sendBulkEmail = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const validatedData = await validateSchema(emailValidation.sendBulkEmail, req.body);
      
      await this.emailService.sendBulkEmail(
        validatedData.subject,
        validatedData.message,
        validatedData.recipients,
        validatedData.attachments
      );
      
      res.status(200).json({
        success: true,
        message: 'Bulk emails sent successfully'
      });
    } catch (error) {
      logger.error('Send bulk email error:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending bulk emails'
      });
    }
  };

  private async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findById(userId);
      return user ? user.toObject() : null;
    } catch (error) {
      logger.error('Get user by id error:', error);
      return null;
    }
  }
} 
import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { logger } from '../utils/logger.util';
import { sendError, sendSuccess } from '../utils/response.util';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      sendSuccess(res, result, 'Registration successful');
    } catch (error) {
      logger.error('Registration error:', error);
      sendError(res, 'Registration failed');
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      logger.error('Login error:', error);
      sendError(res, 'Invalid credentials');
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.refreshToken(req.body.refreshToken);
      sendSuccess(res, result, 'Token refreshed successfully');
    } catch (error) {
      logger.error('Token refresh error:', error);
      sendError(res, 'Invalid refresh token');
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.authService.forgotPassword(req.body);
      sendSuccess(res, null, 'Password reset email sent');
    } catch (error) {
      logger.error('Forgot password error:', error);
      sendError(res, 'Failed to process forgot password request');
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.authService.resetPassword(req.body);
      sendSuccess(res, null, 'Password reset successful');
    } catch (error) {
      logger.error('Reset password error:', error);
      sendError(res, 'Failed to reset password');
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?._id) {
        sendError(res, 'User not authenticated', 401);
        return;
      }
      await this.authService.logout(req.user._id);
      sendSuccess(res, null, 'Logout successful');
    } catch (error) {
      logger.error('Logout error:', error);
      sendError(res, 'Failed to logout');
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.authService.verifyEmail(req.body.token);
      sendSuccess(res, null, 'Email verified successfully');
    } catch (error) {
      logger.error('Email verification error:', error);
      sendError(res, 'Failed to verify email');
    }
  };

  resendVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.authService.resendVerification(req.body.email);
      sendSuccess(res, null, 'Verification email sent');
    } catch (error) {
      logger.error('Resend verification error:', error);
      sendError(res, 'Failed to resend verification email');
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?._id) {
        sendError(res, 'User not authenticated', 401);
        return;
      }
      await this.authService.changePassword(req.user._id, req.body);
      sendSuccess(res, null, 'Password changed successfully');
    } catch (error) {
      logger.error('Change password error:', error);
      sendError(res, 'Failed to change password');
    }
  };
} 
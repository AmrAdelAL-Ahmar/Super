import { IUser } from '../interfaces/models/user.interface';
import { IAuthResponse, ITokenPair } from '../interfaces/responses/auth.response';
import { 
  IRegisterRequest, 
  ILoginRequest, 
  IRefreshTokenRequest,
  IForgotPasswordRequest,
  IResetPasswordRequest,
  IChangePasswordRequest
} from '../interfaces/requests/auth.request';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt.util';
import { hashPassword, comparePassword } from '../utils/password.util';
import { logger } from '../utils/logger.util';
import UserModel from '../models/user.model';
import { UserRole } from '../interfaces/models/user.interface';
import { generateVerificationToken } from '../utils/token.util';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email.util';

export class AuthService {
  async register(userData: IRegisterRequest): Promise<IAuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await UserModel.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new user
      const hashedPassword = await hashPassword(userData.password);
      const user = await UserModel.create({
        ...userData,
        password: hashedPassword,
        role: UserRole.CUSTOMER, // Default role
      });

      const userObject = user.toObject();

      // Generate verification token
      const verificationToken = generateVerificationToken();
      user.emailVerificationToken = verificationToken;
      user.emailVerificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      await user.save();

      // Send verification email
      await sendVerificationEmail(userObject.email, verificationToken);

      // Generate tokens
      const tokens = generateTokenPair({
        id: userObject._id.toString(),
        role: userObject.role,
      });

      return {
        user: {
          _id: userObject._id.toString(),
          email: userObject.email,
          firstName: userObject.firstName,
          lastName: userObject.lastName,
          role: userObject.role,
        },
        tokens,
      };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  async login(credentials: ILoginRequest): Promise<IAuthResponse> {
    try {
      // Find user
      const user = await UserModel.findOne({ email: credentials.email });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isValid = await comparePassword(credentials.password, user.password);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      const userObject = user.toObject();

      // Generate tokens
      const tokens = generateTokenPair({
        id: userObject._id.toString(),
        role: userObject.role,
        storeId: userObject.storeId?.toString(),
      });

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      return {
        user: {
          _id: userObject._id.toString(),
          email: userObject.email,
          firstName: userObject.firstName,
          lastName: userObject.lastName,
          role: userObject.role,
        },
        tokens,
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<ITokenPair> {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await UserModel.findById(decoded.id);
      
      if (!user) {
        throw new Error('User not found');
      }

      const userObject = user.toObject();
      return generateTokenPair({
        id: userObject._id.toString(),
        role: userObject.role,
        storeId: userObject.storeId?.toString(),
      });
    } catch (error) {
      logger.error('Token refresh error:', error);
      throw error;
    }
  }

  async forgotPassword(data: IForgotPasswordRequest): Promise<void> {
    try {
      const user = await UserModel.findOne({ email: data.email });
      if (!user) {
        throw new Error('User not found');
      }

      // Generate reset token
      const resetToken = generateVerificationToken();
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();

      // Send reset password email
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      logger.error('Forgot password error:', error);
      throw error;
    }
  }

  async resetPassword(data: IResetPasswordRequest): Promise<void> {
    try {
      const user = await UserModel.findOne({
        resetPasswordToken: data.token,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // Update password
      user.password = await hashPassword(data.password);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
    } catch (error) {
      logger.error('Reset password error:', error);
      throw error;
    }
  }

  async logout(userId: string): Promise<void> {
    try {
      // TODO: Implement token blacklisting or invalidation
      // This could involve adding the token to a blacklist in Redis
   
   
      // Update the user's last activity
      await UserModel.findByIdAndUpdate(userId, {
        $set: { lastLogout: new Date() }
      });
      
      // If you're using refresh tokens, you may also want to invalidate those:
      // await RefreshTokenModel.deleteMany({ userId });
      
      logger.info(`User ${userId} successfully logged out`);
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      const user = await UserModel.findOne({
        emailVerificationToken: token,
        emailVerificationExpire: { $gt: Date.now() },
      });

      if (!user) {
        throw new Error('Invalid or expired verification token');
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpire = undefined;
      await user.save();
    } catch (error) {
      logger.error('Email verification error:', error);
      throw error;
    }
  }

  async resendVerification(email: string): Promise<void> {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      if (user.isEmailVerified) {
        throw new Error('Email already verified');
      }

      // Generate new verification token
      const verificationToken = generateVerificationToken();
      user.emailVerificationToken = verificationToken;
      user.emailVerificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      await user.save();

      // Send verification email
      await sendVerificationEmail(user.email, verificationToken);
    } catch (error) {
      logger.error('Resend verification error:', error);
      throw error;
    }
  }

  async changePassword(userId: string, data: IChangePasswordRequest): Promise<void> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isValid = await comparePassword(data.currentPassword, user.password);
      if (!isValid) {
        throw new Error('Invalid current password');
      }

      // Update password
      user.password = await hashPassword(data.newPassword);
      await user.save();
    } catch (error) {
      logger.error('Change password error:', error);
      throw error;
    }
  }

  async validateToken(token: string): Promise<IUser> {
    try {
      // TODO: Implement token validation
      // This could involve checking the token against a blacklist
      throw new Error('Not implemented');
    } catch (error) {
      logger.error('Token validation error:', error);
      throw error;
    }
  }
} 
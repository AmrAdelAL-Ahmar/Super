import { UserRole } from '../models/user.interface';

// واجهة زوج التوكن | Token Pair Interface
export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// واجهة استجابة المصادقة | Auth Response Interface
export interface IAuthResponse {
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  };
  tokens: ITokenPair;
}

// واجهة استجابة تحديث التوكن | Refresh Token Response Interface
export interface IRefreshTokenResponse {
  tokens: ITokenPair;
}

// واجهة استجابة طلب نسيان كلمة المرور | Forgot Password Response Interface
export interface IForgotPasswordResponse {
  message: string;
  emailSent: boolean;
}

// واجهة استجابة إعادة تعيين كلمة المرور | Reset Password Response Interface
export interface IResetPasswordResponse {
  message: string;
}

export interface IVerifyEmailResponse {
  message: string;
}

export interface IResendVerificationResponse {
  message: string;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface IErrorResponse {
  success: boolean;
  message: string;
  errors?: {
    [key: string]: string;
  };
  stack?: string;
}

export interface IPaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
} 
import { UserRole } from '../models/user.interface';

// واجهة طلب التسجيل | Register Request Interface
export interface IRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

// واجهة طلب تسجيل صاحب السوبر ماركت | Owner Register Request Interface
export interface IOwnerRegisterRequest extends IRegisterRequest {
  storeName: string;
  storeAddress: string;
  storePhone: string;
}

// واجهة طلب إضافة موظف توصيل | Delivery Employee Register Request Interface
export interface IDeliveryEmployeeRegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

// واجهة طلب تسجيل الدخول | Login Request Interface
export interface ILoginRequest {
  email: string;
  password: string;
}

// واجهة طلب تحديث التوكن | Refresh Token Request Interface
export interface IRefreshTokenRequest {
  refreshToken: string;
}

// واجهة طلب نسيان كلمة المرور | Forgot Password Request Interface
export interface IForgotPasswordRequest {
  email: string;
}

// واجهة طلب إعادة تعيين كلمة المرور | Reset Password Request Interface
export interface IResetPasswordRequest {
  token: string;
  password: string;
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface IVerifyEmailRequest {
  token: string;
}

export interface IResendVerificationRequest {
  email: string;
} 
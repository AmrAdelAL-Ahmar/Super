import { IUser } from '../models/user.interface';
import { IAuthResponse, ITokenPair } from '../responses/auth.response';
import { 
  IRegisterRequest, 
  ILoginRequest, 
  IRefreshTokenRequest,
  IForgotPasswordRequest,
  IResetPasswordRequest
} from '../requests/auth.request';

export interface IAuthService {
  register(userData: IRegisterRequest): Promise<IAuthResponse>;
  login(credentials: ILoginRequest): Promise<IAuthResponse>;
  refreshToken(refreshToken: string): Promise<ITokenPair>;
  forgotPassword(data: IForgotPasswordRequest): Promise<void>;
  resetPassword(data: IResetPasswordRequest): Promise<void>;
  logout(userId: string): Promise<void>;
  validateToken(token: string): Promise<IUser>;
  generateTokens(user: IUser): ITokenPair;
} 
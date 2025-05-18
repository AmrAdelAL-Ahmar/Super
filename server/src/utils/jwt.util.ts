import jwt, { SignOptions } from 'jsonwebtoken';
import environment from '../config/environment';
import { UserRole } from '../interfaces/models/user.interface';

interface TokenPayload {
  _id: string;
  role: UserRole;
  storeId?: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: parseInt(environment.JWT.ACCESS_EXPIRES_IN),
  };
  return jwt.sign(payload, environment.JWT.ACCESS_SECRET, options);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: parseInt(environment.JWT.REFRESH_EXPIRES_IN),
  };
  return jwt.sign(payload, environment.JWT.REFRESH_SECRET, options);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, environment.JWT.ACCESS_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid access token');
  }
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, environment.JWT.REFRESH_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

export const generateTokenPair = (payload: TokenPayload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    expiresIn: parseInt(environment.JWT.ACCESS_EXPIRES_IN),
  };
};
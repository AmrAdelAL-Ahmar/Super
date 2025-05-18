import { Request } from 'express';
import { UserRole } from './models/user.interface';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: UserRole;
    storeId?: string;
  };
} 
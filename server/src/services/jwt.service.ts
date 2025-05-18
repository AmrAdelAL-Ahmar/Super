import { verifyAccessToken } from '../utils/jwt.util';
import { IUser } from '../interfaces/models/user.interface';

export const jwtService = {
  async verifyToken(token: string): Promise<IUser | null> {
    try {
      const payload = await verifyAccessToken(token);
      return payload as unknown as IUser;
    } catch (error) {
      return null;
    }
  }
}; 
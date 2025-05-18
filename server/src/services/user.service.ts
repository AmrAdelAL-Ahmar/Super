import { IUser } from '../interfaces/models/user.interface';
import { hashPassword } from '../utils/password.util';
import { logger } from '../utils/logger.util';
import UserModel from '../models/user.model';
import { Types } from 'mongoose';

export class UserService {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    try {
      if (userData.password) {
        userData.password = await hashPassword(userData.password);
      }
      const user = await UserModel.create(userData);
      return user.toObject();
    } catch (error) {
      logger.error('Create user error:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findById(id).select('-password');
      return user ? user.toObject() : null;
    } catch (error) {
      logger.error('Get user error:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findOne({ email }).select('-password');
      return user ? user.toObject() : null;
    } catch (error) {
      logger.error('Get user by email error:', error);
      throw error;
    }
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    try {
      if (updateData.password) {
        updateData.password = await hashPassword(updateData.password);
      }
      const user = await UserModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).select('-password');
      return user ? user.toObject() : null;
    } catch (error) {
      logger.error('Update user error:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await UserModel.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Delete user error:', error);
      throw error;
    }
  }

  async getUsers(query: any = {}, options: any = {}): Promise<{ users: IUser[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        UserModel.find(query)
          .select('-password')
          .sort(sort)
          .skip(skip)
          .limit(limit),
        UserModel.countDocuments(query),
      ]);

      return { 
        users: users.map(user => user.toObject()),
        total 
      };
    } catch (error) {
      logger.error('Get users error:', error);
      throw error;
    }
  }

  async updateUserStatus(id: string, isActive: boolean): Promise<IUser | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        id,
        { $set: { isActive } },
        { new: true }
      ).select('-password');
      return user ? user.toObject() : null;
    } catch (error) {
      logger.error('Update user status error:', error);
      throw error;
    }
  }

  async updateUserRole(id: string, role: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        id,
        { $set: { role } },
        { new: true }
      ).select('-password');
      return user ? user.toObject() : null;
    } catch (error) {
      logger.error('Update user role error:', error);
      throw error;
    }
  }

  async assignStoreToUser(userId: string, storeId: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $set: { storeId: new Types.ObjectId(storeId) } },
        { new: true }
      ).select('-password');
      return user ? user.toObject() : null;
    } catch (error) {
      logger.error('Assign store to user error:', error);
      throw error;
    }
  }

  async removeStoreFromUser(userId: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $unset: { storeId: 1 } },
        { new: true }
      ).select('-password');
      return user ? user.toObject() : null;
    } catch (error) {
      logger.error('Remove store from user error:', error);
      throw error;
    }
  }
} 
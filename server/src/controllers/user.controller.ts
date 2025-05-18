import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { sendSuccess, sendError, sendNotFound } from '../utils/response.util';
import { logger } from '../utils/logger.util';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.createUser(req.body);
      sendSuccess(res, user, 'User created successfully');
    } catch (error) {
      logger.error('Create user controller error:', error);
      sendError(res, 'Failed to create user', error);
    }
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) {
        sendNotFound(res, 'User not found');
        return;
      }
      sendSuccess(res, user);
    } catch (error) {
      logger.error('Get user controller error:', error);
      sendError(res, 'Failed to get user', error);
    }
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      if (!user) {
        sendNotFound(res, 'User not found');
        return;
      }
      sendSuccess(res, user, 'User updated successfully');
    } catch (error) {
      logger.error('Update user controller error:', error);
      sendError(res, 'Failed to update user', error);
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.userService.deleteUser(req.params.id);
      sendSuccess(res, null, 'User deleted successfully');
    } catch (error) {
      logger.error('Delete user controller error:', error);
      sendError(res, 'Failed to delete user', error);
    }
  };

  getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, sort, ...query } = req.query;
      const options = { page, limit, sort };
      const result = await this.userService.getUsers(query, options);
      sendSuccess(res, result);
    } catch (error) {
      logger.error('Get users controller error:', error);
      sendError(res, 'Failed to get users', error);
    }
  };

  updateUserStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { isActive } = req.body;
      const user = await this.userService.updateUserStatus(req.params.id, isActive);
      if (!user) {
        sendNotFound(res, 'User not found');
        return;
      }
      sendSuccess(res, user, 'User status updated successfully');
    } catch (error) {
      logger.error('Update user status controller error:', error);
      sendError(res, 'Failed to update user status', error);
    }
  };

  updateUserRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const { role } = req.body;
      const user = await this.userService.updateUserRole(req.params.id, role);
      if (!user) {
        sendNotFound(res, 'User not found');
        return;
      }
      sendSuccess(res, user, 'User role updated successfully');
    } catch (error) {
      logger.error('Update user role controller error:', error);
      sendError(res, 'Failed to update user role', error);
    }
  };

  assignStoreToUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { storeId } = req.body;
      const user = await this.userService.assignStoreToUser(req.params.id, storeId);
      if (!user) {
        sendNotFound(res, 'User not found');
        return;
      }
      sendSuccess(res, user, 'Store assigned to user successfully');
    } catch (error) {
      logger.error('Assign store to user controller error:', error);
      sendError(res, 'Failed to assign store to user', error);
    }
  };

  removeStoreFromUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.removeStoreFromUser(req.params.id);
      if (!user) {
        sendNotFound(res, 'User not found');
        return;
      }
      sendSuccess(res, user, 'Store removed from user successfully');
    } catch (error) {
      logger.error('Remove store from user controller error:', error);
      sendError(res, 'Failed to remove store from user', error);
    }
  };
} 
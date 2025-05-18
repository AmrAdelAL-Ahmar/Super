import { Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { logger } from '../utils/logger.util';
import { AuthRequest } from '../interfaces/auth.interface';
import { notificationValidation } from '../validations/notification.validation';
import { validateSchema } from '../middleware/validation.middleware';
import * as socketUtil from '../utils/socket.util';
import { SocketEvents } from '../interfaces/socket/events.interface';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  createNotification = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const validatedData = await validateSchema(notificationValidation.createNotification, req.body);
      const notification = await this.notificationService.createNotification({
        ...validatedData,
        senderId: req.user._id
      });
      // In the createNotification method
// Emit the notification in real time
socketUtil.emitToUser(notification.userId.toString(), SocketEvents.NEW_NOTIFICATION, {
  id: notification._id,
  title: notification.title,
  message: notification.message,
  type: notification.type,
  createdAt: notification.createdAt
});
      res.status(201).json({
        success: true,
        data: notification
      });
    } catch (error) {
      logger.error('Create notification error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating notification'
      });
    }
  };

  getNotificationById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const notification = await this.notificationService.getNotificationById(req.params.id);
      if (!notification) {
        res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: notification
      });
    } catch (error) {
      logger.error('Get notification error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting notification'
      });
    }
  };

  getNotificationsByUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const validatedData = await validateSchema(notificationValidation.getNotificationsByUser, req.query);
      const result = await this.notificationService.getNotificationsByUser(req.user._id, {
        page: Number(validatedData.page),
        limit: Number(validatedData.limit),
        sort: validatedData.sort
      });
      res.status(200).json({
        success: true,
        data: result.notifications,
        total: result.total
      });
    } catch (error) {
      logger.error('Get notifications by user error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting notifications'
      });
    }
  };

  markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      await this.notificationService.markAsRead(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (error) {
      logger.error('Mark notification as read error:', error);
      res.status(500).json({
        success: false,
        message: 'Error marking notification as read'
      });
    }
  };

  markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      await this.notificationService.markAllAsRead(req.user._id);
      res.status(200).json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error) {
      logger.error('Mark all notifications as read error:', error);
      res.status(500).json({
        success: false,
        message: 'Error marking all notifications as read'
      });
    }
  };

  deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      await this.notificationService.deleteNotification(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Notification deleted successfully'
      });
    } catch (error) {
      logger.error('Delete notification error:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting notification'
      });
    }
  };

  getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const count = await this.notificationService.getUnreadCount(req.user._id);
      res.status(200).json({
        success: true,
        data: { count }
      });
    } catch (error) {
      logger.error('Get unread count error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting unread count'
      });
    }
  };

  getAllNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }
      
      const { page, limit, sort, ...filters } = req.query;
      
      const result = await this.notificationService.getAllNotifications({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        sort: sort as string || '-createdAt',
        ...filters
      });
      
      res.status(200).json({
        success: true,
        data: result.notifications,
        total: result.total
      });
    } catch (error) {
      logger.error('Get all notifications error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting all notifications'
      });
    }
  };
} 
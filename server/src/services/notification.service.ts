import { INotification } from '../interfaces/models/notification.interface';
import { logger } from '../utils/logger.util';
import NotificationModel from '../models/notification.model';
import { NotificationType } from '../interfaces/models/notification.interface';

export class NotificationService {
  async createNotification(notificationData: Partial<INotification>): Promise<INotification> {
    try {
      const notification = await NotificationModel.create(notificationData);
      return notification.toObject() as INotification;
    } catch (error) {
      logger.error('Create notification error:', error);
      throw error;
    }
  }

  async getNotificationById(id: string): Promise<INotification | null> {
    try {
      return await NotificationModel.findById(id)
        .populate('userId', 'firstName lastName email');
    } catch (error) {
      logger.error('Get notification error:', error);
      throw error;
    }
  }

  async getNotificationsByUser(userId: string, options: any = {}): Promise<{ notifications: INotification[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt', read } = options;
      const skip = (page - 1) * limit;

      const query: any = { userId };
      if (read !== undefined) {
        query.read = read;
      }

      const [notifications, total] = await Promise.all([
        NotificationModel.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit),
        NotificationModel.countDocuments(query)
      ]);

      return { notifications: notifications.map(notification => notification.toObject() as INotification), total };
    } catch (error) {
      logger.error('Get notifications by user error:', error);
      throw error;
    }
  }

  async markAsRead(id: string): Promise<INotification | null> {
    try {
      return await NotificationModel.findByIdAndUpdate(
        id,
        { $set: { read: true } },
        { new: true }
      );
    } catch (error) {
      logger.error('Mark notification as read error:', error);
      throw error;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      await NotificationModel.updateMany(
        { userId, read: false },
        { $set: { read: true } }
      );
    } catch (error) {
      logger.error('Mark all notifications as read error:', error);
      throw error;
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      await NotificationModel.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Delete notification error:', error);
      throw error;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      return await NotificationModel.countDocuments({ userId, read: false });
    } catch (error) {
      logger.error('Get unread count error:', error);
      throw error;
    }
  }

  async getAllNotifications(options: any = {}): Promise<{ notifications: INotification[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt', ...filters } = options;
      const skip = (page - 1) * limit;

      const [notifications, total] = await Promise.all([
        NotificationModel.find(filters)
          .populate('userId', 'firstName lastName email')
          .sort(sort)
          .skip(skip)
          .limit(limit),
        NotificationModel.countDocuments(filters)
      ]);

      return { 
        notifications: notifications.map(notification => notification.toObject() as INotification), 
        total 
      };
    } catch (error) {
      logger.error('Get all notifications error:', error);
      throw error;
    }
  }

  async createOrderNotification(userId: string, orderId: string, type: NotificationType): Promise<INotification> {
    try {
      const notification = await NotificationModel.create({
        userId,
        type,
        title: this.getOrderNotificationTitle(type),
        message: this.getOrderNotificationMessage(type),
        data: { orderId }
      });

      return notification.toObject() as INotification   ;
    } catch (error) {
      logger.error('Create order notification error:', error);
      throw error;
    }
  }

  private getOrderNotificationTitle(type: NotificationType): string {
    switch (type) {
            
      case NotificationType.ORDER_PLACED:
        return 'Order Placed';
      case NotificationType.ORDER_CONFIRMED:
        return 'Order Confirmed';
      case NotificationType.ORDER_SHIPPED:
        return 'Order Shipped';
      case NotificationType.ORDER_DELIVERED:
        return 'Order Delivered';
      case NotificationType.ORDER_CANCELLED:
        return 'Order Cancelled';
      default:
        return 'Order Update';
    }
  }

  private getOrderNotificationMessage(type: NotificationType): string {
    switch (type) {
      case NotificationType.ORDER_PLACED:
        return 'Your order has been placed successfully.';
      case NotificationType.ORDER_CONFIRMED:
        return 'Your order has been confirmed by the store.';
      case NotificationType.ORDER_SHIPPED:
        return 'Your order has been shipped and is on its way.';
      case NotificationType.ORDER_DELIVERED:
        return 'Your order has been delivered.';
      case NotificationType.ORDER_CANCELLED:
        return 'Your order has been cancelled.';
      default:
        return 'There is an update regarding your order.';
    }
  }
} 
import { NotificationType } from '../models/notification.interface';

// واجهة طلب إنشاء إشعار | Create Notification Request Interface
export interface ICreateNotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: {
    [key: string]: any;
  };
}

// واجهة طلب تحديث حالة الإشعار | Update Notification Status Request Interface
export interface IUpdateNotificationStatusRequest {
  isRead: boolean;
}

// واجهة طلب تصفية الإشعارات | Filter Notifications Request Interface
export interface IFilterNotificationsRequest {
  type?: NotificationType;
  isRead?: boolean;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// واجهة طلب إرسال إشعارات جماعية | Bulk Notification Request Interface
export interface IBulkNotificationRequest {
  userIds: string[];
  type: NotificationType;
  title: string;
  message: string;
  metadata?: {
    [key: string]: any;
  };
} 
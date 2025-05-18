// أنواع الإشعارات | Notification Types
export enum NotificationType {
  ORDER_PLACED = 'order_placed',
  ORDER_CONFIRMED = 'order_confirmed',
  ORDER_SHIPPED = 'order_shipped',
  ORDER_DELIVERED = 'order_delivered',
  ORDER_CANCELLED = 'order_cancelled',
  ORDER_STATUS = 'order_status',
  PAYMENT_STATUS = 'payment_status',
  DELIVERY_STATUS = 'delivery_status',
  SYSTEM = 'system',
  PROMOTION = 'promotion',
  NEW_MESSAGE = 'new_message',
  NEW_FOLLOW = 'new_follow',
  NEW_COMMENT = 'new_comment',
  NEW_LIKE = 'new_like',
  NEW_SHARE = 'new_share',
  NEW_VIEW = 'new_view'
}

// واجهة الإشعار | Notification Interface
export interface INotification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: {
    [key: string]: any;
  };
  metadata?: {
    [key: string]: any;
  };
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
} 
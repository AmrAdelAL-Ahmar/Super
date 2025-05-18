// واجهة استجابة الإشعار | Notification Response Interface
export interface INotificationResponse {
  id: string;
  userId: string;
  type: 'order' | 'payment' | 'delivery' | 'system' | 'promotion';
  title: string;
  message: string;
  isRead: boolean;
  metadata?: {
    orderId?: string;
    paymentId?: string;
    deliveryId?: string;
    promotionId?: string;
    [key: string]: any;
  };
  createdAt: Date;
}

// واجهة استجابة قائمة الإشعارات | Notification List Response Interface
export interface INotificationListResponse {
  notifications: INotificationResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  summary: {
    total: number;
    unread: number;
    byType: {
      [key: string]: number;
    };
  };
}

// واجهة استجابة إحصائيات الإشعارات | Notification Statistics Response Interface
export interface INotificationStatisticsResponse {
  total: number;
  byType: {
    type: string;
    count: number;
    readCount: number;
    unreadCount: number;
  }[];
  timeline: {
    date: Date;
    count: number;
    readCount: number;
    unreadCount: number;
  }[];
  userEngagement: {
    totalUsers: number;
    activeUsers: number;
    averageNotificationsPerUser: number;
    averageReadTime: number;
  };
} 
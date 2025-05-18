export enum SocketEvents {
    // Connection events
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    AUTHENTICATE = 'authenticate',
    AUTHENTICATED = 'authenticated',
    
    // Room management
    JOIN_ROOM = 'join_room',
    LEAVE_ROOM = 'leave_room',
    
    // Order events
    JOIN_ORDER_ROOM = 'joinOrderRoom',
    LEAVE_ORDER_ROOM = 'leaveOrderRoom',
    ORDER_STATUS_UPDATE = 'orderStatusUpdate',
    ORDER_STATUS_UPDATED = 'orderStatusUpdated',
    NEW_ORDER = 'new_order',
    
    // Delivery events
    LOCATION_UPDATE = 'locationUpdate',
    DELIVERY_LOCATION_UPDATED = 'deliveryLocationUpdated',
    EMPLOYEE_LOCATION_UPDATED = 'employeeLocationUpdated',
    NEW_DELIVERY = 'new_delivery',
    DELIVERY_STATUS_UPDATE = 'delivery_status_update',
    
    // Notification events
    NEW_NOTIFICATION = 'new_notification',
    NOTIFICATION_READ = 'notification_read',
    NOTIFICATION_UPDATED = 'notification_updated',
    NOTIFICATION_DELETED = 'notification_deleted',
    
    // Product events
    LOW_STOCK = 'low_stock',
    
    // Error events
    ERROR = 'error'
  }
  
  export interface OrderStatusUpdateData {
    orderId: string;
    status: string;
    updatedBy?: string;
    updatedAt?: Date;
  }
  
  export interface LocationUpdateData {
    latitude: number;
    longitude: number;
  }
  
  export interface NotificationData {
    userId: string;
    title: string;
    message: string;
    type: string;
    data?: any;
  }
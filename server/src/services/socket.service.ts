import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger.util';
import { IUser, UserRole } from '../interfaces/models/user.interface';
import { verifyAccessToken } from '../utils/jwt.util';
import { jwtService } from './jwt.service';
import EmployeeModel from '../models/employee.model';
import OrderModel from '../models/order.model';
import { OrderStatus } from '../interfaces/models/order.interface';
import { SocketEvents } from '../interfaces/socket/events.interface';

export class SocketService {
  private io: Server;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(io: Server) {
    this.io = io;
  }

  // Authenticate a socket connection
  async authenticateSocket(socket: Socket, token: string): Promise<IUser | null> {
    try {
      const decoded = await jwtService.verifyToken(token);
      if (!decoded) {
        return null;
      }

      const user = decoded as IUser;
      socket.data.user = user;
      this.connectedUsers.set(user._id, socket.id);
      return user;
    } catch (error) {
      logger.error('Socket authentication error:', error);
      return null;
    }
  }

  // Handle order status update
  async handleOrderStatusUpdate(orderId: string, status: OrderStatus, user: IUser): Promise<void> {
    try {
      const order = await OrderModel.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      // Verify user has permission to update order status
      if (user.role !== UserRole.ADMIN && user?.storeId?.toString() !== order?.storeId?.toString()) {
        throw new Error('Unauthorized to update order status');
      }

      order.status = status;
      await order.save();

      // Notify all relevant parties
      this.io.to(`order:${orderId}`).emit(SocketEvents.ORDER_STATUS_UPDATED, {
        orderId,
        status,
        updatedBy: user._id,
        updatedAt: new Date()
      });
      
      // Also notify the customer
      this.io.to(`user:${order.customerId}`).emit(SocketEvents.ORDER_STATUS_UPDATED, {
        orderId,
        status,
        updatedAt: new Date()
      });
      
      // Notify the store
      this.io.to(`store:${order.storeId}`).emit(SocketEvents.ORDER_STATUS_UPDATED, {
        orderId,
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      logger.error('Order status update error:', error);
      throw error;
    }
  }

  // Handle location update
  async handleLocationUpdate(userId: string, latitude: number, longitude: number): Promise<void> {
    try {
      const employee = await EmployeeModel.findOne({ userId });
      if (!employee) {
        throw new Error('Employee not found');
      }

      employee.currentLocation = {
        lat: latitude,
        lng: longitude
      };
      await employee.save();

      // If employee is assigned to any orders, update the delivery location for those orders
      const activeOrders = await OrderModel.find({ 
        deliveryEmployeeId: userId,
        status: { $in: ['ASSIGNED_TO_DELIVERY', 'OUT_FOR_DELIVERY'] }
      });

      for (const order of activeOrders) {
        this.io.to(`order:${order._id}`).emit(SocketEvents.DELIVERY_LOCATION_UPDATED, {
          orderId: order._id,
          location: {
            latitude,
            longitude
          },
          updatedAt: new Date()
        });
        
        // Also notify the customer
        this.io.to(`user:${order.customerId}`).emit(SocketEvents.DELIVERY_LOCATION_UPDATED, {
          orderId: order._id,
          location: {
            latitude,
            longitude
          },
          updatedAt: new Date()
        });
      }
    } catch (error) {
      logger.error('Location update error:', error);
      throw error;
    }
  }

  // Handle user disconnect
  handleDisconnect(userId: string): void {
    try {
      this.connectedUsers.delete(userId);
      logger.info(`User ${userId} disconnected`);
    } catch (error) {
      logger.error('Disconnect handling error:', error);
    }
  }

 

  // Send notification to user
  sendNotification(userId: string, title: string, message: string, type: string, data?: any): void {
    this.io.to(`user:${userId}`).emit(SocketEvents.NEW_NOTIFICATION, {
      title,
      message,
      type,
      data,
      timestamp: new Date()
    });
  }
 // Notify store about new order
 notifyNewOrder(storeId: string, orderData: any): void {
  this.io.to(`store:${storeId}`).emit('new_order', orderData);
}

// Notify user about order status update
notifyOrderStatusUpdate(userId: string, orderData: any): void {
  this.io.to(`user:${userId}`).emit('order_status_update', orderData);
}

// Notify user about new notification
notifyNewNotification(userId: string, notificationData: any): void {
  this.io.to(`user:${userId}`).emit('new_notification', notificationData);
}

// Notify store about low stock
notifyLowStock(storeId: string, productData: any): void {
  this.io.to(`store:${storeId}`).emit('low_stock', productData);
}

// Notify delivery employee about new delivery
notifyNewDelivery(employeeId: string, deliveryData: any): void {
  this.io.to(`user:${employeeId}`).emit('new_delivery', deliveryData);
}

// Notify user about delivery status update
notifyDeliveryStatusUpdate(userId: string, deliveryData: any): void {
  this.io.to(`user:${userId}`).emit('delivery_status_update', deliveryData);
}



// Get socket ID for user
getUserSocketId(userId: string): string | undefined {
  return this.connectedUsers.get(userId);
}

// Broadcast message to all connected clients
broadcastMessage(event: string, data: any): void {
  this.io.emit(event, data);
}

// Send message to specific user
sendToUser(userId: string, event: string, data: any): void {
  const socketId = this.connectedUsers.get(userId);
  if (socketId) {
    this.io.to(socketId).emit(event, data);
  }
}

// Send message to all users in a store
sendToStore(storeId: string, event: string, data: any): void {
  this.io.to(`store:${storeId}`).emit(event, data);
}
  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }
}
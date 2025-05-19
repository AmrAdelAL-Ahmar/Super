import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger.util';
import { SocketService } from '../services/socket.service';
import { IUser } from '../interfaces/models/user.interface';
import { OrderStatus } from '../interfaces/models/order.interface';
import { SocketEvents, OrderStatusUpdateData, LocationUpdateData } from '../interfaces/socket/events.interface';

export class SocketController {
  private socketService: SocketService;
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.socketService = new SocketService(io);
    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    this.io.on(SocketEvents.CONNECT, (socket: Socket) => {
      logger.info(`Socket connected: ${socket.id}`);

      socket.on(SocketEvents.AUTHENTICATE, async (token: string) => {
        try {
          const user = await this.socketService.authenticateSocket(socket, token);
          if (user) {
            socket.join(`user:${user._id}`);
            if (user.storeId) {
              socket.join(`store:${user.storeId}`);
            }
            socket.emit(SocketEvents.AUTHENTICATED, { success: true });
          } else {
            socket.emit(SocketEvents.AUTHENTICATED, { success: false, message: 'Invalid token' });
          }
        } catch (error) {
          logger.error('Socket authentication error:', error);
          socket.emit(SocketEvents.AUTHENTICATED, { success: false, message: 'Authentication failed' });
        }
      });

      socket.on(SocketEvents.JOIN_ORDER_ROOM, (orderId: string) => {
        const user = socket.data.user as IUser;
        if (user) {
          socket.join(`order:${orderId}`);
          socket.emit('joinedOrderRoom', { orderId, success: true });
        }
      });

      socket.on(SocketEvents.LEAVE_ORDER_ROOM, (orderId: string) => {
        socket.leave(`order:${orderId}`);
        socket.emit('leftOrderRoom', { orderId, success: true });
      });

      socket.on(SocketEvents.ORDER_STATUS_UPDATE, async (data: OrderStatusUpdateData) => {
        try {
          const user = socket.data.user as IUser;
          if (!user) {
            socket.emit(SocketEvents.ERROR, { message: 'Unauthorized' });
            return;
          }

          await this.socketService.handleOrderStatusUpdate(data.orderId, data.status as unknown as OrderStatus, user);
          this.io.to(`order:${data.orderId}`).emit(SocketEvents.ORDER_STATUS_UPDATED, {
            orderId: data.orderId,
            status: data.status,
            updatedBy: user._id,
            updatedAt: new Date()
          });
        } catch (error) {
          logger.error('Order status update error:', error);
          socket.emit(SocketEvents.ERROR, { message: 'Failed to update order status' });
        }
      });

      socket.on(SocketEvents.LOCATION_UPDATE, async (data: LocationUpdateData) => {
        try {
          const user = socket.data.user as IUser;
          if (!user) {
            socket.emit(SocketEvents.ERROR, { message: 'Unauthorized' });
            return;
          }

          await this.socketService.handleLocationUpdate(user._id, data.latitude, data.longitude);
          if (user.storeId) {
            this.io.to(`store:${user.storeId}`).emit(SocketEvents.EMPLOYEE_LOCATION_UPDATED, {
              employeeId: user._id,
              location: data
            });
          }
        } catch (error) {
          logger.error('Location update error:', error);
          socket.emit(SocketEvents.ERROR, { message: 'Failed to update location' });
        }
      });

      socket.on(SocketEvents.DISCONNECT, () => {
        logger.error(`Socket disconnected: ${socket.id}`);
        const user = socket.data.user as IUser;
        if (user) {
          this.socketService.handleDisconnect(user._id);
        }
      });
    });
  }

  public broadcastToStore(storeId: string, event: string, data: any): void {
    this.io.to(`store:${storeId}`).emit(event, data);
  }

  public broadcastToUser(userId: string, event: string, data: any): void {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  public broadcastToOrder(orderId: string, event: string, data: any): void {
    this.io.to(`order:${orderId}`).emit(event, data);
  }
}
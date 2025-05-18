import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { logger } from '../utils/logger.util';
import environment from './environment';
import { socketAuthMiddleware } from '../middleware/socket.middleware';
import { SocketEvents } from '../interfaces/socket/events.interface';

// Socket.io configuration
export const configureSocket = (httpServer: HttpServer): SocketServer => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: environment.CORS.ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Apply authentication middleware
  io.use(socketAuthMiddleware);

  // Connection handler -معالجة الاتصال   
  io.on(SocketEvents.CONNECT, (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Handle room join-
    socket.on(SocketEvents.JOIN_ROOM, (roomId: string) => {
      socket.join(roomId);
      logger.info(`Client joined room: ${roomId}`);
    });

    // Handle room leave
    socket.on(SocketEvents.LEAVE_ROOM, (roomId: string) => {
      socket.leave(roomId);
      logger.info(`Client left room: ${roomId}`);
    });

    // Handle order status update
    socket.on(SocketEvents.ORDER_STATUS_UPDATE, (data: { orderId: string; status: string }) => {
      io.to(`order_${data.orderId}`).emit(SocketEvents.ORDER_STATUS_UPDATED, data);
      logger.info(`Order status updated: ${data.orderId}`);
    });

    // Handle delivery location update
    socket.on(SocketEvents.LOCATION_UPDATE, (data: { orderId: string; location: { lat: number; lng: number } }) => {
      io.to(`order_${data.orderId}`).emit(SocketEvents.DELIVERY_LOCATION_UPDATED, data);
      logger.info(`Delivery location updated: ${data.orderId}`);
    });

    // Handle notifications
    socket.on(SocketEvents.NEW_NOTIFICATION, (data: { userId: string; message: string }) => {
      io.to(`user_${data.userId}`).emit(SocketEvents.NEW_NOTIFICATION, data);
      logger.info(`Notification sent: ${data.userId}`);
    });

    // Handle disconnection
    socket.on(SocketEvents.DISCONNECT, () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });

    // Handle errors
    socket.on(SocketEvents.ERROR, (error: Error) => {
      logger.error('Socket.io error:', error);
    });
  });

  return io;
};

// Send event to room
export const emitToRoom = (io: SocketServer, room: string, event: SocketEvents, data: any): void => {
  io.to(room).emit(event, data);
  logger.info(`Event sent to room: ${room}`);
};

// Send event to user
export const emitToUser = (io: SocketServer, userId: string, event: SocketEvents, data: any): void => {
  io.to(`user_${userId}`).emit(event, data);
  logger.info(`Event sent to user: ${userId}`);
};

// Broadcast event to all
export const broadcastEvent = (io: SocketServer, event: SocketEvents, data: any): void => {
  io.emit(event, data);
  logger.info(`Event broadcasted to all`);
};
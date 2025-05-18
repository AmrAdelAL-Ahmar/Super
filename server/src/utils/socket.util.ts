import { Server as SocketServer } from 'socket.io';
import { SocketEvents } from '../interfaces/socket/events.interface';
import { logger } from './logger.util';

// Will be set during initialization
let io: SocketServer;

export const setSocketIO = (socketIO: SocketServer) => {
  io = socketIO;
};

export const getSocketIO = (): SocketServer => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};

export const emitToUser = (userId: string, event: SocketEvents, data: any): void => {
  if (!io) {
    logger.error('Socket.io not initialized, could not emit event');
    return;
  }
  io.to(`user:${userId}`).emit(event, data);
};

export const emitToStore = (storeId: string, event: SocketEvents, data: any): void => {
  if (!io) {
    logger.error('Socket.io not initialized, could not emit event');
    return;
  }
  io.to(`store:${storeId}`).emit(event, data);
};

export const emitToOrder = (orderId: string, event: SocketEvents, data: any): void => {
  if (!io) {
    logger.error('Socket.io not initialized, could not emit event');
    return;
  }
  io.to(`order:${orderId}`).emit(event, data);
};

export const broadcast = (event: SocketEvents, data: any): void => {
  if (!io) {
    logger.error('Socket.io not initialized, could not broadcast event');
    return;
  }
  io.emit(event, data);
};
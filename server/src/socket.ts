import { createServer } from 'http';
import { Express } from 'express';
import { Server as SocketServer } from 'socket.io';
import { SocketController } from './controllers/socket.controller';
import { configureSocket } from './config/socket';

export function setupSocketIO(app: Express): { httpServer: any, io: SocketServer } {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Initialize Socket.io
  const io = configureSocket(httpServer);
  
  // Initialize the Socket Controller
  new SocketController(io);
  
  return { httpServer, io };
}
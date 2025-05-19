import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import mongoose from 'mongoose';
import errorHandler from './middleware/error';

// Load env vars
dotenv.config();

// Route files
import authRoutes from './routes/auth';
import userRoutes from './routes/users';

// Initialize express
const app: Express = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/supermarket');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error handler
app.use(errorHandler);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');

  // Join a room based on user role
  socket.on('join', ({ userId, role }) => {
    socket.join(userId);
    socket.join(role);
    console.log(`User ${userId} joined room ${role}`);
  });

  // Handle order status updates
  socket.on('orderStatusUpdate', ({ orderId, status, userId }) => {
    // Emit to specific user and to all admins
    io.to(userId).to('owner').emit('orderStatusUpdated', { orderId, status });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Set port
const PORT = process.env.PORT || 5000;

// Start server
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 
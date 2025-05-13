const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');

// Load env vars
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/supermarket-app')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.IO
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join a room based on user role
  socket.on('join', ({ userId, role }) => {
    socket.join(userId);
    socket.join(role);
    console.log(`User ${userId} joined room ${role}`);
  });

  // Handle order notifications
  socket.on('newOrder', (order) => {
    io.to('owner').emit('orderNotification', order);
    console.log('New order notification sent to owner');
  });

  socket.on('orderConfirmed', (data) => {
    io.to(data.customerId).emit('orderStatusUpdate', {
      orderId: data.orderId,
      status: 'confirmed',
      message: 'Your order has been confirmed',
    });
    io.to(data.deliveryPersonId).emit('newDelivery', data);
    console.log(`Order ${data.orderId} confirmed and assigned to ${data.deliveryPersonId}`);
  });

  socket.on('deliveryArrived', (data) => {
    io.to(data.customerId).emit('orderStatusUpdate', {
      orderId: data.orderId,
      status: 'arrived',
      message: 'Your delivery person has arrived',
    });
    console.log(`Delivery person arrived for order ${data.orderId}`);
  });

  socket.on('orderDelivered', (data) => {
    io.to('owner').emit('orderStatusUpdate', {
      orderId: data.orderId,
      status: 'delivered',
      message: 'Order has been delivered',
    });
    console.log(`Order ${data.orderId} delivered successfully`);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
}); 
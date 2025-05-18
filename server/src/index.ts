import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { logger, stream } from './utils/logger';
import connectDB from './config/database';
import router from './routes';
import { setupSocketIO } from './socket';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('combined', { stream })); // HTTP request logging

// API Routes
const apiPrefix = process.env.API_PREFIX || '/api/v1';

// Health check endpoint
app.get(`${apiPrefix}/health`, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use(router);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Setup Socket.io
const { httpServer, io } = setupSocketIO(app);

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
  logger.info(`Socket.io server initialized`);
});

// Export io instance for global access
export { io };
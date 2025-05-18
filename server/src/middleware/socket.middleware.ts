import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { verifyAccessToken } from '../utils/jwt.util';
import { logger } from '../utils/logger.util';
import { UserRole } from '../interfaces/models/user.interface';

/**
 * Socket authentication middleware
 * Verifies the JWT token provided in the socket handshake
 * and attaches user data to the socket
 */
export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  try {
    // Get token from handshake auth or query
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      logger.warn(`Socket connection attempt without token: ${socket.id}`);
      return next(new Error('Authentication error: No token provided'));
    }

    // Verify token
    try {
      const decoded = await verifyAccessToken(token as string);
      
      // Ensure we have all required user data
      if (!decoded || !decoded._id) {
        logger.warn(`Invalid token payload for socket: ${socket.id}`);
        return next(new Error('Authentication error: Invalid token payload'));
      }
      
      // Set user data on socket
      socket.data.user = decoded;
      
      // Join user-specific room for targeted messages
      socket.join(`user:${decoded._id}`);
      
      // If user has a store, join store room
      if (decoded.storeId) {
        socket.join(`store:${decoded.storeId}`);
      }
      
      // If user is delivery employee, join delivery room
      if (decoded.role === UserRole.DELIVERY) {
        socket.join('delivery:all');
      }
      
      logger.info(`Socket authenticated: ${socket.id} (User: ${decoded._id}, Role: ${decoded.role})`);
      next();
    } catch (tokenError) {
      logger.error('Token verification failed:', tokenError);
      return next(new Error('Authentication error: Invalid or expired token'));
    }
  } catch (error) {
    logger.error('Socket authentication error:', error);
    next(new Error('Authentication error: Server error'));
  }
};
import { Types } from 'mongoose';
import OrderTrackingModel from '../models/order-tracking.model';
import OrderModel from '../models/order.model';
import { TrackingStatus } from '../interfaces/models/order-tracking.interface';
import { OrderStatus } from '../interfaces/models/order.interface';
import { logger } from '../utils/logger.util';

export class OrderTrackingService {
  /**
   * Create a new tracking record for an order
   */
  async createOrderTracking(
    orderId: string,
    deliveryEmployeeId: string,
    location: { lat: number; lng: number },
    estimatedDeliveryTime: Date
  ) {
    try {
      // Check if order exists
      const order = await OrderModel.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      // Check if tracking already exists
      const existingTracking = await OrderTrackingModel.findOne({ orderId });
      if (existingTracking) {
        throw new Error('Tracking for this order already exists');
      }

      // Create new tracking
      const tracking = new OrderTrackingModel({
        orderId: new Types.ObjectId(orderId),
        deliveryEmployeeId: new Types.ObjectId(deliveryEmployeeId),
        status: TrackingStatus.PICKED_UP,
        location,
        timestamp: new Date(),
        estimatedDeliveryTime,
        checkpoints: [
          {
            status: TrackingStatus.PICKED_UP,
            location,
            timestamp: new Date(),
            notes: 'Order picked up for delivery'
          }
        ]
      });

      // Update order status
      order.status = OrderStatus.OUT_FOR_DELIVERY;
      await order.save();

      return await tracking.save();
    } catch (error) {
      logger.error('Error creating order tracking:', error);
      throw error;
    }
  }

  /**
   * Get tracking for a specific order
   */
  async getOrderTracking(orderId: string) {
    try {
      const tracking = await OrderTrackingModel.findOne({ orderId })
        .populate('deliveryEmployeeId', 'firstName lastName phone')
        .sort({ createdAt: -1 });

      if (!tracking) {
        throw new Error('Tracking not found for this order');
      }

      return tracking;
    } catch (error) {
      logger.error('Error getting order tracking:', error);
      throw error;
    }
  }

  /**
   * Update tracking information
   */
  async updateOrderTracking(
    orderId: string,
    location: { lat: number; lng: number },
    status: TrackingStatus,
    estimatedDeliveryTime?: Date,
    notes?: string
  ) {
    try {
      // Find tracking
      const tracking = await OrderTrackingModel.findOne({ orderId });
      if (!tracking) {
        throw new Error('Tracking not found for this order');
      }

      // Update tracking
      tracking.status = status;
      tracking.location = location;
      tracking.timestamp = new Date();
      if (estimatedDeliveryTime) {
        tracking.estimatedDeliveryTime = estimatedDeliveryTime;
      }

      // Add checkpoint
      tracking.checkpoints.push({
        status,
        location,
        timestamp: new Date(),
        notes
      });

      // If status is DELIVERED, update the order status
      if (status === TrackingStatus.DELIVERED) {
        const order = await OrderModel.findById(orderId);
        if (order) {
          order.status = OrderStatus.DELIVERED;
          order.actualDeliveryTime = new Date();
          await order.save();
        }
      }

      return await tracking.save();
    } catch (error) {
      logger.error('Error updating order tracking:', error);
      throw error;
    }
  }

  /**
   * Get all order checkpoints
   */
  async getOrderCheckpoints(orderId: string) {
    try {
      const tracking = await OrderTrackingModel.findOne({ orderId });
      if (!tracking) {
        throw new Error('Tracking not found for this order');
      }

      return tracking.checkpoints;
    } catch (error) {
      logger.error('Error getting order checkpoints:', error);
      throw error;
    }
  }

  /**
   * Delete tracking for an order
   */
  async deleteOrderTracking(orderId: string) {
    try {
      return await OrderTrackingModel.deleteOne({ orderId });
    } catch (error) {
      logger.error('Error deleting order tracking:', error);
      throw error;
    }
  }
} 
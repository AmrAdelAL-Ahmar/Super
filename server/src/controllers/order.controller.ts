import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { sendSuccess, sendError, sendNotFound } from '../utils/response.util';
import { logger } from '../utils/logger.util';
import { UserRole } from '../interfaces/models/user.interface';
import { OrderTrackingService } from '../services/order-tracking.service';
import { TrackingStatus } from '../interfaces/models/order-tracking.interface';
import * as socketUtil from '../utils/socket.util';
import { SocketEvents } from '../interfaces/socket/events.interface';
export class OrderController {
  private orderService: OrderService;
  private orderTrackingService: OrderTrackingService;

  constructor() {
    this.orderService = new OrderService();
    this.orderTrackingService = new OrderTrackingService();
  }

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?._id) {
        sendError(res, 'User not authenticated', 401);
        return;
      }

      const orderData = {
        ...req.body,
        userId: req.user._id
      };
      const order = await this.orderService.createOrder(orderData);
      sendSuccess(res, order, 'Order created successfully');
    // Notify store about new order
socketUtil.emitToStore(order.storeId.toString(), SocketEvents.NEW_ORDER, {
  orderId: order._id,
  orderNumber: order.orderNumber,
  items: order.items.length,
  total: order.total,
  createdAt: order.createdAt
});
// End of update
    } catch (error) {
      logger.error('Create order error:', error);
      sendError(res, 'Failed to create order');
    }
  }

  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      if (!order) {
        sendNotFound(res, 'Order not found');
        return;
      }

      // Check if user has permission to view this order
      if (req.user?.role !== UserRole.ADMIN && 
          order.customerId.toString() !== req.user?._id && 
          order.storeId.toString() !== req.user?.storeId) {
        sendError(res, 'Unauthorized to view this order', 403);
        return;
      }

      sendSuccess(res, order);
    } catch (error) {
      logger.error('Get order error:', error);
      sendError(res, 'Failed to get order');
    }
  }

  async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      if (!order) {
        sendNotFound(res, 'Order not found');
        return;
      }

      // Check if user has permission to update this order
      if (req.user?.role !== UserRole.ADMIN && 
          order.storeId.toString() !== req.user?.storeId) {
        sendError(res, 'Unauthorized to update this order', 403);
        return;
      }

      const updatedOrder = await this.orderService.updateOrder(req.params.id, req.body);
  
      sendSuccess(res, updatedOrder, 'Order updated successfully');
    } catch (error) {
      logger.error('Update order error:', error);
      sendError(res, 'Failed to update order');
    }
  }

  async deleteOrder(req: Request, res: Response): Promise<void> {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      if (!order) {
        sendNotFound(res, 'Order not found');
        return;
      }

      // Only admin can delete orders
      if (req.user?.role !== UserRole.ADMIN) {
        sendError(res, 'Unauthorized to delete orders', 403);
        return;
      }

      await this.orderService.deleteOrder(req.params.id);
      sendSuccess(res, null, 'Order deleted successfully');
    } catch (error) {
      logger.error('Delete order error:', error);
      sendError(res, 'Failed to delete order');
    }
  }

  async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, sort, ...query } = req.query;
      const options = { page, limit, sort };
      const result = await this.orderService.getOrders(query, options);
      sendSuccess(res, result);
    } catch (error) {
      logger.error('Get orders error:', error);
      sendError(res, 'Failed to get orders');
    }
  }

  async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      if (!order) {
        sendNotFound(res, 'Order not found');
        return;
      }

      // Check if user has permission to update order status
      if (req.user?.role !== UserRole.ADMIN && 
          order.storeId.toString() !== req.user?.storeId) {
        sendError(res, 'Unauthorized to update order status', 403);
        return;
      }

      const { status } = req.body;
      const updatedOrder = await this.orderService.updateOrderStatus(req.params.id, status);
                          // Notify about order status update
socketUtil.emitToOrder(updatedOrder?._id.toString()||"", SocketEvents.ORDER_STATUS_UPDATED, {
  orderId: updatedOrder?._id,
  status: updatedOrder?.status,
  updatedAt: new Date()
});
// Also notify the customer
socketUtil.emitToUser(updatedOrder?.customerId.toString() ||"", SocketEvents.ORDER_STATUS_UPDATED, {
  orderId: updatedOrder?._id,
  status: updatedOrder?.status,
  updatedAt: new Date()
});
      sendSuccess(res, updatedOrder, 'Order status updated successfully');
    } catch (error) {
      logger.error('Update order status error:', error);
      sendError(res, 'Failed to update order status');
    }
  }

  async getOrdersByUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?._id) {
        sendError(res, 'User not authenticated', 401);
        return;
      }

      const { page, limit, sort } = req.query;
      const options = { page, limit, sort };
      const result = await this.orderService.getOrdersByUser(req.user._id, options);
      sendSuccess(res, result);
    } catch (error) {
      logger.error('Get orders by user error:', error);
      sendError(res, 'Failed to get orders by user');
    }
  }

  async getOrdersByStore(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, sort } = req.query;
      const options = { page, limit, sort };
      const result = await this.orderService.getOrdersByStore(req.params.storeId, options);
      sendSuccess(res, result);
    } catch (error) {
      logger.error('Get orders by store error:', error);
      sendError(res, 'Failed to get orders by store');
    }
  }

  async getOrdersByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, sort } = req.query;
      const options = { page, limit, sort };
      const result = await this.orderService.getOrdersByStatus(req.params.status, options);
      sendSuccess(res, result);
    } catch (error) {
      logger.error('Get orders by status error:', error);
      sendError(res, 'Failed to get orders by status');
    }
  }
  
  
  // New methods for order tracking
  
  async  getOrderTracking(req: Request, res: Response): Promise<void> {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      if (!order) {
        sendNotFound(res, 'Order not found');
        return;
      }

      // Check if user has permission to view this order tracking
      if (req.user?.role !== UserRole.ADMIN && 
          req.user?.role !== UserRole.DELIVERY &&
          order.customerId.toString() !== req.user?._id && 
          order.storeId.toString() !== req.user?.storeId) {
        sendError(res, 'Unauthorized to view this order tracking', 403);
        return;
      }

      const tracking = await this.orderTrackingService.getOrderTracking(req.params.id);
      sendSuccess(res, tracking);
    } catch (error) {
      logger.error('Get order tracking error:', error);
      if ((error as Error).message === 'Tracking not found for this order') {
        sendNotFound(res, 'Tracking not found for this order');
      } else {
        sendError(res, 'Failed to get order tracking');
      }
    }
  }

  async updateOrderTracking(req: Request, res: Response): Promise<void> {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      if (!order) {
        sendNotFound(res, 'Order not found');
        return;
      }

      // Check if user has permission to update order tracking
      if (req.user?.role !== UserRole.ADMIN && 
          req.user?.role !== UserRole.DELIVERY &&
          order.storeId.toString() !== req.user?.storeId) {
        sendError(res, 'Unauthorized to update order tracking', 403);
        return;
      }

      const { location, status, estimatedDeliveryTime, notes } = req.body;
      
      // Handle first tracking creation if it doesn't exist yet
      try {
        await this.orderTrackingService.getOrderTracking(req.params.id);
      } catch (error) {
        // If tracking doesn't exist, create it
        if ((error as Error).message === 'Tracking not found for this order') {
          if (!order.deliveryEmployeeId) {
            sendError(res, 'Order must have a delivery employee assigned before tracking');
            return;
          }
          
          const newTracking = await this.orderTrackingService.createOrderTracking(
            req.params.id,
            order.deliveryEmployeeId.toString(),
            location,
            estimatedDeliveryTime || new Date(Date.now() + 30 * 60000) // 30 minutes from now
          );
          
          sendSuccess(res, newTracking, 'Order tracking created successfully');
          return;
        }
      }
      
      // Update existing tracking
      const updatedTracking = await this.orderTrackingService.updateOrderTracking(
        req.params.id,
        location,
        status as TrackingStatus,
        estimatedDeliveryTime,
        notes
      );
      
      sendSuccess(res, updatedTracking, 'Order tracking updated successfully');
    } catch (error) {
      logger.error('Update order tracking error:', error);
      sendError(res, 'Failed to update order tracking');
    }
  }

  /**
   * Assign a delivery employee to an order
   * Only store owners and admins can assign employees to orders
   */
  async assignDeliveryEmployee(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { employeeId } = req.body;
      
      // First check if the order exists
      const order = await this.orderService.getOrderById(id);
      if (!order) {
        sendNotFound(res, 'Order not found');
        return;
      }

      // Check if user has permission to assign delivery employees
      // Only admin or the owner of the store that received the order can assign
      if (req.user?.role !== UserRole.ADMIN && 
          order.storeId.toString() !== req.user?.storeId) {
        sendError(res, 'Unauthorized to assign delivery employees for this order', 403);
        return;
      }

      // Assign the delivery employee
      const updatedOrder = await this.orderService.assignDeliveryEmployee(id, employeeId);
      const customer = updatedOrder?.customerId as any;
      const customerName = customer ? `${customer?.firstName} ${customer?.lastName}` : 'Customer';
      const phone = customer?.["phone"] || 'N/A';
      // Get address details
      const address = updatedOrder?.deliveryAddressId ;
      if (!updatedOrder) {
        sendError(res, 'Failed to assign delivery employee');
        return;
      }
      
      sendSuccess(res, updatedOrder, 'Delivery employee assigned successfully');
    
        // In a real application with proper socket setup:
        socketUtil.emitToUser(employeeId, SocketEvents.NEW_DELIVERY, {
          orderId: updatedOrder._id,
          orderNumber: updatedOrder.orderNumber,
          deliveryAddress: address,
          customer: {
            name: customerName,
            phone: customer?.phone || 'N/A'
          },
          assignedAt: new Date()
        });
      
    } catch (error) {
      logger.error('Assign delivery employee error:', error);
      sendError(res, error instanceof Error ? error.message : 'Failed to assign delivery employee');
    }
  }
} 
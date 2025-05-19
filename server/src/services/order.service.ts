import { IOrder, OrderStatus } from '../interfaces/models/order.interface';
import { logger } from '../utils/logger.util';
import OrderModel from '../models/order.model';
import { EmployeeService } from './employee.service';
import { SocketService } from './socket.service';
import AddressModel from '../models/address.model';
import { SocketEvents } from '../interfaces/socket/events.interface';
import mongoose from 'mongoose';

export class OrderService {
  private employeeService: EmployeeService;
  private socketService: SocketService;

  constructor() {
    this.employeeService = new EmployeeService();
    this.socketService = new SocketService(null as any); // Initialize with proper io in real app
  }

  async createOrder(orderData: Partial<IOrder>): Promise<IOrder> {
    try {
      const order = new OrderModel(orderData);
      return (await order.save()).toObject() as unknown as IOrder;
    } catch (error) {
      logger.error('Create order error:', error);
      throw error;
    }
  }

  async assignDeliveryEmployee(orderId: string, employeeId?: string): Promise<IOrder | null> {
    try {
      // Find the order
      const order = await OrderModel.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      // If employee ID is provided, use that employee
      if (employeeId) {
        // Update order status and assign employee
        order.status = OrderStatus.OUT_FOR_DELIVERY;
        order.deliveryEmployeeId = new mongoose.Types.ObjectId(employeeId);
        await order.save();
      } else {
        // Auto-assign the best available employee
        // First, get the delivery address
        const address = await AddressModel.findById(order.deliveryAddressId);
        if (!address) {
          throw new Error('Delivery address not found');
        }
        
        // Find the best employee based on schedule and location
        const bestEmployee = await this.employeeService.getBestDeliveryEmployee(
          order.storeId.toString(),
          { 
            lat: address.coordinates.latitude, 
            lng: address.coordinates.longitude 
          }
        );

        if (!bestEmployee) {
          throw new Error('No available delivery employees found');
        }

        // Assign the employee to the order
        order.status = OrderStatus.OUT_FOR_DELIVERY;
        order.deliveryEmployeeId = new mongoose.Types.ObjectId(bestEmployee._id);
        await order.save();
        
        employeeId = bestEmployee._id;
      }

      // Refresh order to get updated data
      const updatedOrder = await OrderModel.findById(orderId)
        .populate('customerId', 'firstName lastName phone')
        .populate('storeId', 'name')
        .populate('deliveryAddressId')
        .lean();
      
      if (!updatedOrder) {
        throw new Error('Failed to retrieve updated order');
      }

      // Notify the delivery employee via socket
      try {
        // Format customer name
        const customer = updatedOrder.customerId as any;
        const customerName = customer ? `${customer.firstName} ${customer.lastName}` : 'Customer';
        
        // Get address details
        const address = updatedOrder.deliveryAddressId as any;
        
        // Use SocketEvents enum for the event name
        // In a real application, you would emit to a room or specific client
        // This is just a placeholder since we don't have proper socket integration
        logger.info(`Would emit ${SocketEvents.NEW_DELIVERY} event to employee ${employeeId}`);
        
        /* 
        // In a real application with proper socket setup:
        this.socketService.emitToUser(employeeId, SocketEvents.NEW_DELIVERY, {
          orderId: updatedOrder._id,
          orderNumber: updatedOrder.orderNumber,
          deliveryAddress: address,
          customer: {
            name: customerName,
            phone: customer?.phone || 'N/A'
          },
          assignedAt: new Date()
        });
        */
      } catch (socketError) {
        // Log but don't fail the operation if socket notification fails
        logger.error('Failed to send socket notification:', socketError);
      }

      return updatedOrder as unknown as IOrder;
    } catch (error) {
      logger.error('Assign delivery employee error:', error);
      throw error;
    }
  }

  async getOrderById(id: string): Promise<IOrder | null> {
    try {
      const order = await OrderModel.findById(id)
        .populate('userId', 'name email')
        .populate('storeId', 'name')
        .populate('items.productId', 'name price')
        .lean();
      return order as unknown as IOrder | null;
    } catch (error) {
      logger.error('Get order error:', error);
      throw error;
    }
  }

  async updateOrder(id: string, updateData: Partial<IOrder>): Promise<IOrder | null> {
    try {
      const order = await OrderModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      )
        .populate('userId', 'name email')
        .populate('storeId', 'name')
        .populate('items.productId', 'name price')
        .lean();
      return order as unknown as IOrder | null;
    } catch (error) {
      logger.error('Update order error:', error);
      throw error;
    }
  }

  async deleteOrder(id: string): Promise<void> {
    try {
      await OrderModel.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Delete order error:', error);
      throw error;
    }
  }

  async getOrders(query: any = {}, options: any = {}): Promise<{ orders: IOrder[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        OrderModel.find(query)
          .populate('userId', 'name email')
          .populate('storeId', 'name')
          .populate('items.productId', 'name price')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        OrderModel.countDocuments(query),
      ]);

      return { orders: orders as unknown as IOrder[], total };
    } catch (error) {
      logger.error('Get orders error:', error);
      throw error;
    }
  }

  async updateOrderStatus(id: string, status: string): Promise<IOrder | null> {
    try {
      const order = await OrderModel.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true }
      )
        .populate('userId', 'name email')
        .populate('storeId', 'name')
        .populate('items.productId', 'name price')
        .lean();
      return order as unknown as IOrder | null;
    } catch (error) {
      logger.error('Update order status error:', error);
      throw error;
    }
  }

  async getOrdersByUser(userId: string, options: any = {}): Promise<{ orders: IOrder[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        OrderModel.find({ userId })
          .populate('userId', 'name email')
          .populate('storeId', 'name')
          .populate('items.productId', 'name price')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        OrderModel.countDocuments({ userId }),
      ]);

      return { orders: orders as unknown as IOrder[], total };
    } catch (error) {
      logger.error('Get orders by user error:', error);
      throw error;
    }
  }

  async getOrdersByStore(storeId: string, options: any = {}): Promise<{ orders: IOrder[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        OrderModel.find({ storeId })
          .populate('userId', 'name email')
          .populate('storeId', 'name')
          .populate('items.productId', 'name price')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        OrderModel.countDocuments({ storeId }),
      ]);

      return { orders: orders as unknown as IOrder[], total };
    } catch (error) {
      logger.error('Get orders by store error:', error);
      throw error;
    }
  }

  async getOrdersByStatus(status: string, options: any = {}): Promise<{ orders: IOrder[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        OrderModel.find({ status })
          .populate('userId', 'name email')
          .populate('storeId', 'name')
          .populate('items.productId', 'name price')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        OrderModel.countDocuments({ status }),
      ]);

      return { orders: orders as unknown as IOrder[], total };
    } catch (error) {
      logger.error('Get orders by status error:', error);
      throw error;
    }
  }

  async calculateOrderTotal(items: Array<{ productId: string; quantity: number }>): Promise<number> {
    try {
      let total = 0;
      for (const item of items) {
        const product = await OrderModel.findById(item.productId).select('price').lean();
        if (product) {
          total += (product as any).price * item.quantity;
        }
      }
      return total;
    } catch (error) {
      logger.error('Calculate order total error:', error);
      throw error;
    }
  }
} 
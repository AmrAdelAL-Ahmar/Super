import { IPayment } from '../interfaces/models/payment.interface';
import { logger } from '../utils/logger.util';
import PaymentModel from '../models/payment.model';
import OrderModel from '../models/order.model';
import { PaymentStatus, PaymentMethod } from '../interfaces/models/payment.interface';

export class PaymentService {
  async createPayment(paymentData: Partial<IPayment>): Promise<IPayment> {
    try {
      const payment = await PaymentModel.create(paymentData);
      return payment.toObject() as IPayment;
    } catch (error) {
      logger.error('Create payment error:', error);
      throw error;
    }
  }

  async getPaymentById(id: string): Promise<IPayment | null> {
    try {
      return await PaymentModel.findById(id)
        .populate('orderId', 'orderNumber total')
        .populate('userId', 'firstName lastName email');
    } catch (error) {
      logger.error('Get payment error:', error);
      throw error;
    }
  }

  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<IPayment | null> {
    try {
      const payment = await PaymentModel.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true }
      );

      if (payment && status === PaymentStatus.PAID) {
        await OrderModel.findByIdAndUpdate(payment.orderId, {
          $set: { paymentStatus: 'paid' }
        });
      }

      return payment?.toObject() as IPayment;
    } catch (error) {
      logger.error('Update payment status error:', error);
      throw error;
    }
  }

  async getPaymentsByOrder(orderId: string): Promise<IPayment[]> {
    try {
      return await PaymentModel.find({ orderId })
        .populate('userId', 'firstName lastName email');
    } catch (error) {
      logger.error('Get payments by order error:', error);
      throw error;
    }
  }

  async getPaymentsByUser(userId: string, options: any = {}): Promise<{ payments: IPayment[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      const [payments, total] = await Promise.all([
        PaymentModel.find({ userId })
          .populate('orderId', 'orderNumber total')
          .sort(sort)
          .skip(skip)
          .limit(limit),
        PaymentModel.countDocuments({ userId })
      ]);

      return { payments: payments.map(payment => payment.toObject() as IPayment), total };
    } catch (error) {
      logger.error('Get payments by user error:', error);
      throw error;
    }
  }

  async processPayment(paymentData: {
    orderId: string;
    userId: string;
    amount: number;
    method: PaymentMethod;
    paymentDetails: any;
  }): Promise<IPayment> {
    try {
      // TODO: Implement actual payment processing logic here
      // This would integrate with payment gateways like Stripe, PayPal, etc.

      const payment = await PaymentModel.create({
        orderId: paymentData.orderId,
        userId: paymentData.userId,
        amount: paymentData.amount,
        method: paymentData.method,
        status: PaymentStatus.PENDING,
        paymentDetails: paymentData.paymentDetails
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      payment.status = PaymentStatus.PAID;
      await payment.save();

      // Update order payment status
      await OrderModel.findByIdAndUpdate(paymentData.orderId, {
        $set: { paymentStatus: 'paid' }
      });

      return payment.toObject() as IPayment;
    } catch (error) {
      logger.error('Process payment error:', error);
      throw error;
    }
  }

  async refundPayment(paymentId: string, reason: string): Promise<IPayment | null> {
    try {
      const payment = await PaymentModel.findById(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== PaymentStatus.PAID) {
        throw new Error('Payment must be completed to be refunded');
      }

      // TODO: Implement actual refund processing logic here
      // This would integrate with payment gateways

      payment.status = PaymentStatus.REFUNDED;
      payment.refundDetails = { reason, refundedAt: new Date() };
      await payment.save();

      // Update order payment status
      await OrderModel.findByIdAndUpdate(payment.orderId, {
        $set: { paymentStatus: 'refunded' }
      });

      return payment.toObject() as IPayment;
    } catch (error) {
      logger.error('Refund payment error:', error);
      throw error;
    }
  }

  async confirmPayment(
    paymentIntentId: string, 
    orderId: string, 
    userId: string
  ): Promise<IPayment> {
    try {
      // Find the payment by transaction ID
      const payment = await PaymentModel.findOne({ transactionId: paymentIntentId });
      
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      // Update payment status
      payment.status = PaymentStatus.PAID;
      await payment.save();
      
      // Update order status
      await OrderModel.findByIdAndUpdate(orderId, { 
        paymentStatus: 'paid' 
      });
      
      return payment.toObject() as IPayment;
    } catch (error) {
      logger.error('Confirm payment error:', error);
      throw error;
    }
  }

  async addPaymentMethod(userId: string, paymentMethodData: any): Promise<any> {
    try {
      // Here you would typically implement integration with a payment provider
      // This is just a placeholder implementation
      return {
        id: `pm_${Date.now()}`,
        type: paymentMethodData.type,
        userId,
        isDefault: paymentMethodData.isDefault,
        createdAt: new Date()
      };
    } catch (error) {
      logger.error('Add payment method error:', error);
      throw error;
    }
  }

  async removePaymentMethod(userId: string, methodId: string): Promise<void> {
    try {
      // Implement payment method removal logic
      // This would typically call your payment provider's API
      logger.info(`Removed payment method ${methodId} for user ${userId}`);
    } catch (error) {
      logger.error('Remove payment method error:', error);
      throw error;
    }
  }

  async getAllTransactions(options: any = {}): Promise<{ payments: IPayment[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt', startDate, endDate, status } = options;
      const skip = (page - 1) * limit;
      
      const query: any = {};
      
      if (startDate && endDate) {
        query.createdAt = { 
          $gte: new Date(startDate), 
          $lte: new Date(endDate)
        };
      }
      
      if (status) {
        query.status = status;
      }
      
      const [payments, total] = await Promise.all([
        PaymentModel.find(query)
          .populate('orderId', 'orderNumber total')
          .populate('customerId', 'firstName lastName email')
          .sort(sort)
          .skip(skip)
          .limit(limit),
        PaymentModel.countDocuments(query)
      ]);
      
      return { 
        payments: payments.map(payment => payment.toObject() as IPayment), 
        total 
      };
    } catch (error) {
      logger.error('Get all transactions error:', error);
      throw error;
    }
  }
} 
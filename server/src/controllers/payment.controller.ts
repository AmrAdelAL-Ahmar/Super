import { Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { logger } from '../utils/logger.util';
import { AuthRequest } from '../interfaces/auth.interface';
import { paymentValidation } from '../validations/payment.validation';
import { validateSchema } from '../middleware/validation.middleware';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  createPayment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const validatedData = await validateSchema(paymentValidation.createPayment, req.body);
      const payment = await this.paymentService.createPayment({
        ...validatedData,
        customerId: req.user._id
      });
      res.status(201).json({
        success: true,
        data: payment
      });
    } catch (error) {
      logger.error('Create payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating payment'
      });
    }
  };

  getPaymentById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const payment = await this.paymentService.getPaymentById(req.params.id);
      if (!payment) {
        res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: payment
      });
    } catch (error) {
      logger.error('Get payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting payment'
      });
    }
  };

  updatePaymentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?.storeId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized - Store owner only'
        });
        return;
      }

      const validatedData = await validateSchema(paymentValidation.updatePaymentStatus, req.body);
      const payment = await this.paymentService.updatePaymentStatus(req.params.id, validatedData.status);
      if (!payment) {
        res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: payment
      });
    } catch (error) {
      logger.error('Update payment status error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating payment status'
      });
    }
  };

  getPaymentsByOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const payments = await this.paymentService.getPaymentsByOrder(req.params.orderId);
      res.status(200).json({
        success: true,
        data: payments
      });
    } catch (error) {
      logger.error('Get payments by order error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting payments'
      });
    }
  };

  getPaymentsByUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const validatedData = await validateSchema(paymentValidation.getPaymentsByUser, req.query);
      const { page, limit, sort } = req.query;
      const result = await this.paymentService.getPaymentsByUser(req.user._id, {
        page: Number(page),
        limit: Number(limit),
        sort: sort as string
      });
      res.status(200).json({
        success: true,
        data: result.payments,
        total: result.total
      });
    } catch (error) {
      logger.error('Get payments by user error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting payments'
      });
    }
  };

  processPayment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const { orderId, amount, method, paymentDetails } = req.body;
      const payment = await this.paymentService.processPayment({
        orderId,
        userId: req.user._id,
        amount,
        method,
        paymentDetails
      });
      res.status(200).json({
        success: true,
        data: payment
      });
    } catch (error) {
      logger.error('Process payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing payment'
      });
    }
  };

  refundPayment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?.storeId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized - Store owner only'
        });
        return;
      }

      const { reason } = req.body;
      const payment = await this.paymentService.refundPayment(req.params.id, reason);
      if (!payment) {
        res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: payment
      });
    } catch (error) {
      logger.error('Refund payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing refund'
      });
    }
  };

  confirmPayment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const validatedData = await validateSchema(paymentValidation.confirmPayment, req.body);
      const result = await this.paymentService.confirmPayment(
        validatedData.paymentIntentId, 
        validatedData.orderId, 
        req.user._id
      );
      
      res.status(200).json({
        success: true,
        data: result,
        message: 'Payment confirmed successfully'
      });
    } catch (error) {
      logger.error('Confirm payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Error confirming payment'
      });
    }
  };

  addPaymentMethod = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const validatedData = await validateSchema(paymentValidation.addPaymentMethod, req.body);
      const paymentMethod = await this.paymentService.addPaymentMethod(req.user._id, validatedData);
      
      res.status(201).json({
        success: true,
        data: paymentMethod,
        message: 'Payment method added successfully'
      });
    } catch (error) {
      logger.error('Add payment method error:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding payment method'
      });
    }
  };

  removePaymentMethod = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      await this.paymentService.removePaymentMethod(req.user._id, req.params.methodId);
      
      res.status(200).json({
        success: true,
        message: 'Payment method removed successfully'
      });
    } catch (error) {
      logger.error('Remove payment method error:', error);
      res.status(500).json({
        success: false,
        message: 'Error removing payment method'
      });
    }
  };

  getAllTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const { page, limit, sort, startDate, endDate, status } = req.query;
      
      const result = await this.paymentService.getAllTransactions({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        sort: sort as string || '-createdAt',
        startDate,
        endDate,
        status
      });
      
      res.status(200).json({
        success: true,
        data: result.payments,
        total: result.total
      });
    } catch (error) {
      logger.error('Get all transactions error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting transactions'
      });
    }
  };
} 
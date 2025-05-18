import Joi from 'joi';

export const paymentValidation = {
  createPayment: Joi.object({
    orderId: Joi.string().required(),
    amount: Joi.number().min(0).required(),
    currency: Joi.string().required(),
    paymentMethodId: Joi.string().required(),
  }),

  updatePaymentStatus: Joi.object({
    status: Joi.string().valid('pending', 'completed', 'failed', 'refunded').required(),
    transactionId: Joi.string(),
  }),

  processPayment: Joi.object({
    paymentMethodId: Joi.string().required(),
    amount: Joi.number().min(0).required(),
    currency: Joi.string().required(),
    description: Joi.string(),
  }),

  refundPayment: Joi.object({
    paymentId: Joi.string().required(),
    amount: Joi.number().min(0).required(),
    reason: Joi.string().required(),
  }),

  getPaymentsByUser: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string().valid('pending', 'completed', 'failed', 'refunded'),
  }),

  confirmPayment: Joi.object({
    paymentIntentId: Joi.string().required(),
    orderId: Joi.string().required(),
  }),

  addPaymentMethod: Joi.object({
    type: Joi.string().valid('card', 'bank_account').required(),
    isDefault: Joi.boolean().default(false),
    cardDetails: Joi.object({
      token: Joi.string(),
      last4: Joi.string().length(4),
      brand: Joi.string(),
      expMonth: Joi.number().integer().min(1).max(12),
      expYear: Joi.number().integer().min(new Date().getFullYear()),
      holderName: Joi.string()
    }).when('type', { is: 'card', then: Joi.required() }),
    bankDetails: Joi.object({
      accountNumber: Joi.string(),
      routingNumber: Joi.string(),
      accountHolderName: Joi.string(),
      accountType: Joi.string().valid('checking', 'savings')
    }).when('type', { is: 'bank_account', then: Joi.required() })
  })
}; 
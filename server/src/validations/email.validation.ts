import Joi from 'joi';

export const emailValidation = {
  sendVerificationEmail: Joi.object({
    email: Joi.string().email().required(),
  }),

  sendPasswordResetEmail: Joi.object({
    email: Joi.string().email().required(),
  }),

  sendOrderConfirmationEmail: Joi.object({
    orderId: Joi.string().required(),
  }),

  sendOrderStatusUpdateEmail: Joi.object({
    orderId: Joi.string().required(),
    status: Joi.string().required(),
  }),
  
  sendWelcomeEmail: Joi.object({
    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  }),
  
  sendBulkEmail: Joi.object({
    subject: Joi.string().required(),
    message: Joi.string().required(),
    recipients: Joi.array().items(Joi.string().email()).min(1).required(),
    attachments: Joi.array().items(
      Joi.object({
        filename: Joi.string().required(),
        path: Joi.string().required(),
      })
    ).optional(),
  }),
}; 
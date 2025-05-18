import Joi from 'joi';

// Add item validation schema
export const addItemSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});

// Update item validation schema
export const updateItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});

// Apply coupon validation schema
export const applyCouponSchema = Joi.object({
  code: Joi.string().required(),
});

// Checkout validation schema
export const checkoutSchema = Joi.object({
  paymentMethod: Joi.string().valid('cash', 'card', 'wallet').required(),
  deliveryAddressId: Joi.string().required(),
  notes: Joi.string().allow('', null),
});

export const cartValidation = {
  addItem: addItemSchema,
  updateItem: updateItemSchema,
  applyCoupon: applyCouponSchema,
  checkout: checkoutSchema,
}; 
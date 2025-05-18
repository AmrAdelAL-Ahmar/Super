import Joi from 'joi';

export const createOrderSchema = Joi.object({
  userId: Joi.string().required(),
  storeId: Joi.string().required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
      price: Joi.number().min(0).required()
    })
  ).min(1).required(),
  deliveryAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    postalCode: Joi.string().required()
  }).required(),
  paymentMethod: Joi.string().valid('cash', 'card', 'wallet').required(),
  notes: Joi.string().optional()
});

export const updateOrderSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled').optional(),
  paymentStatus: Joi.string().valid('pending', 'paid', 'failed').optional(),
  deliveryAddress: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    postalCode: Joi.string()
  }).optional(),
  notes: Joi.string().optional()
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled').required()
});

export const updateTrackingSchema = Joi.object({
  location: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required()
  }).required(),
  status: Joi.string().valid('picked_up', 'in_transit', 'delivered').required(),
  estimatedDeliveryTime: Joi.date().optional()
});

export const assignDeliveryEmployeeSchema = Joi.object({
  employeeId: Joi.string().required()
});

export const orderValidation = {
  createOrder: createOrderSchema,
  updateOrder: updateOrderSchema,
  updateOrderStatus: updateOrderStatusSchema,
  updateTracking: updateTrackingSchema,
  assignDeliveryEmployee: assignDeliveryEmployeeSchema
}; 
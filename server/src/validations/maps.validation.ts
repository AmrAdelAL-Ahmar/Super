import Joi from 'joi';

export const mapsValidation = {
  getNearbyStores: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    radius: Joi.number().min(1).max(50).default(10),
    limit: Joi.number().min(1).max(100).default(20)
  }),

  getDeliveryEstimate: Joi.object({
    storeId: Joi.string().required(),
    deliveryAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required()
    }).required()
  }),

  getRouteOptimization: Joi.object({
    orders: Joi.array().items(
      Joi.object({
        orderId: Joi.string().required(),
        deliveryAddress: Joi.object({
          street: Joi.string().required(),
          city: Joi.string().required(),
          state: Joi.string().required(),
          zipCode: Joi.string().required(),
          country: Joi.string().required()
        }).required()
      })
    ).min(1).required()
  }),

  updateStoreLocation: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required()
    }).required()
  })
}; 
import Joi from 'joi';

export const addressValidation = {
  createAddress: Joi.object({
    label: Joi.string().required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    zipCode: Joi.string().required(),
    coordinates: Joi.object({
      lat: Joi.number().required(),
      lng: Joi.number().required(),
    }).required(),
    isDefault: Joi.boolean(),
  }),

  updateAddress: Joi.object({
    label: Joi.string(),
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    zipCode: Joi.string(),
    coordinates: Joi.object({
      lat: Joi.number(),
      lng: Joi.number(),
    }),
    isDefault: Joi.boolean(),
  }),

  findNearby: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    radius: Joi.number().min(0).max(50).default(10), // radius in kilometers
  }),
}; 
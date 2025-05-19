import Joi from 'joi';

export const productValidation = {
  createProduct: Joi.object({
    storeId: Joi.string().required(),
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().max(1000),
    price: Joi.number().required().min(0),
    salePrice: Joi.number().min(0),
    costPrice: Joi.number().min(0),
    categories: Joi.array().items(Joi.string()).required(),
    images: Joi.array().items(Joi.string().uri()),
    mainImage: Joi.string().uri().required(),
    sku: Joi.string(),
    barcode: Joi.string(),
    weight: Joi.number().min(0),
    weightUnit: Joi.string().valid('kg', 'g', 'lb', 'oz'),
    stockQuantity: Joi.number().integer().min(0).required(),
    isAvailable: Joi.boolean(),
    isDiscounted: Joi.boolean(),
    discountPercentage: Joi.number().min(0).max(100),
    attributes: Joi.object(),
  }),

  updateProduct: Joi.object({
    name: Joi.string().min(3).max(100),
    description: Joi.string().max(1000),
    price: Joi.number().min(0),
    salePrice: Joi.number().min(0),
    costPrice: Joi.number().min(0),
    categories: Joi.array().items(Joi.string()),
    images: Joi.array().items(Joi.string().uri()),
    mainImage: Joi.string().uri(),
    sku: Joi.string(),
    barcode: Joi.string(),
    weight: Joi.number().min(0),
    weightUnit: Joi.string().valid('kg', 'g', 'lb', 'oz'),
    stockQuantity: Joi.number().integer().min(0),
    isAvailable: Joi.boolean(),
    isDiscounted: Joi.boolean(),
    discountPercentage: Joi.number().min(0).max(100),
    attributes: Joi.object(),
  }),

  updateStock: Joi.object({
    stockQuantity: Joi.number().integer().min(0).required(),
  }),

  updatePrice: Joi.object({
    price: Joi.number().min(0).required(),
    salePrice: Joi.number().min(0),
    costPrice: Joi.number().min(0),
  }),

  updateDiscount: Joi.object({
    isDiscounted: Joi.boolean().required(),
    discountPercentage: Joi.number().min(0).max(100).when('isDiscounted', {
      is: true,
      then: Joi.required(),
    }),
  }),
}; 
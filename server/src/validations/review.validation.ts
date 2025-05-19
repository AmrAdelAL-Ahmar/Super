import Joi from 'joi';

export const reviewValidation = {
  createReview: Joi.object({
    productId: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    title: Joi.string().max(100),
    comment: Joi.string().max(1000),
    images: Joi.array().items(Joi.string().uri()),
  }),

  updateReview: Joi.object({
    rating: Joi.number().min(1).max(5),
    title: Joi.string().max(100),
    comment: Joi.string().max(1000),
    images: Joi.array().items(Joi.string().uri()),
  }),

  getReviewsByProduct: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    sort: Joi.string().valid('createdAt', 'rating').default('createdAt')
  }),

  getReviewsByUser: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    sort: Joi.string().valid('createdAt', 'rating').default('createdAt')
  })
}; 
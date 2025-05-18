import Joi from 'joi';

export const categoryValidation = {
  createCategory: Joi.object({
    name: Joi.string().required().trim(),
    description: Joi.string().optional(),
    imageUrl: Joi.string().uri().optional(),
    parentId: Joi.string().optional().regex(/^[0-9a-fA-F]{24}$/),
    displayOrder: Joi.number().integer().min(0).optional(),
    isActive: Joi.boolean().optional(),
  }),
  
  updateCategory: Joi.object({
    name: Joi.string().trim().optional(),
    description: Joi.string().optional(),
    imageUrl: Joi.string().uri().optional(),
    parentId: Joi.string().optional().regex(/^[0-9a-fA-F]{24}$/),
    displayOrder: Joi.number().integer().min(0).optional(),
    isActive: Joi.boolean().optional(),
  }),
  
  updateVisibility: Joi.object({
    isActive: Joi.boolean().required()
  }),
  
  reorderCategories: Joi.object({
    newOrder: Joi.array().items(
      Joi.object({
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        displayOrder: Joi.number().integer().min(0).required()
      })
    ).required()
  })
}; 
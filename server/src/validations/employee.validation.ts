import Joi from 'joi';

export const employeeValidation = {
  createEmployee: Joi.object({
    userId: Joi.string().required(),
    storeId: Joi.string().required(),
    role: Joi.string().valid('manager', 'cashier', 'delivery', 'kitchen').required(),
    salary: Joi.number().min(0),
    schedule: Joi.object({
      monday: Joi.object({
        isWorking: Joi.boolean().required(),
        startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      }).required(),
      // Repeat for other days
    }).required(),
  }),

  updateEmployee: Joi.object({
    role: Joi.string().valid('manager', 'cashier', 'delivery', 'kitchen'),
    salary: Joi.number().min(0),
    isActive: Joi.boolean(),
  }),

  updateAvailability: Joi.object({
    isAvailable: Joi.boolean().required(),
    reason: Joi.string().max(500),
  }),

  updateLocation: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }),

  updateSchedule: Joi.object({
    schedule: Joi.object({
      monday: Joi.object({
        isWorking: Joi.boolean().required(),
        startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      }).required(),
      // Repeat for other days
    }).required(),
  }),
}; 
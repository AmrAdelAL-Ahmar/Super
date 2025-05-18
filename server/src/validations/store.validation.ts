import Joi from 'joi';
import { UserRole } from '../interfaces/models/user.interface';

export const storeValidation = {
  createStore: Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().max(1000),
    logo: Joi.string().uri(),
    coverImage: Joi.string().uri(),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      zipCode: Joi.string().required(),
      coordinates: Joi.object({
        lat: Joi.number().required(),
        lng: Joi.number().required(),
      }),
    }).required(),
    contactInfo: Joi.object({
      phone: Joi.string().required(),
      email: Joi.string().email().required(),
      website: Joi.string().uri(),
    }).required(),
    businessHours: Joi.object({
      monday: Joi.object({
        isOpen: Joi.boolean().required(),
        openTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        closeTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      }).required(),
      // Repeat for other days
    }).required(),
    deliverySettings: Joi.object({
      isDeliveryAvailable: Joi.boolean().required(),
      deliveryRadius: Joi.number().min(0),
      deliveryFee: Joi.number().min(0),
      minimumOrderAmount: Joi.number().min(0),
    }).required(),
    paymentMethods: Joi.array().items(Joi.string()).required(),
  }),

  updateStore: Joi.object({
    name: Joi.string().min(3).max(100),
    description: Joi.string().max(1000),
    logo: Joi.string().uri(),
    coverImage: Joi.string().uri(),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      country: Joi.string(),
      zipCode: Joi.string(),
      coordinates: Joi.object({
        lat: Joi.number(),
        lng: Joi.number(),
      }),
    }),
    contactInfo: Joi.object({
      phone: Joi.string(),
      email: Joi.string().email(),
      website: Joi.string().uri(),
    }),
    isActive: Joi.boolean(),
  }),

  updateBusinessHours: Joi.object({
    businessHours: Joi.object({
      monday: Joi.object({
        isOpen: Joi.boolean().required(),
        openTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        closeTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      }).required(),
      // Repeat for other days
    }).required(),
  }),

  updateDeliverySettings: Joi.object({
    deliverySettings: Joi.object({
      isDeliveryAvailable: Joi.boolean().required(),
      deliveryRadius: Joi.number().min(0),
      deliveryFee: Joi.number().min(0),
      minimumOrderAmount: Joi.number().min(0),
    }).required(),
  }),

  updatePaymentMethods: Joi.object({
    paymentMethods: Joi.array().items(Joi.string()).required(),
  }),

  // Add missing validation schemas
  updateStoreStatus: Joi.object({
    isActive: Joi.boolean().required()
  }),

  updateStoreHours: Joi.object({
    monday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      isClosed: Joi.boolean()
    }),
    tuesday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      isClosed: Joi.boolean()
    }),
    wednesday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      isClosed: Joi.boolean()
    }),
    thursday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      isClosed: Joi.boolean()
    }),
    friday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      isClosed: Joi.boolean()
    }),
    saturday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      isClosed: Joi.boolean()
    }),
    sunday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      isClosed: Joi.boolean()
    })
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
  }),

  verifyStore: Joi.object({
    verified: Joi.boolean().required()
  })
}; 
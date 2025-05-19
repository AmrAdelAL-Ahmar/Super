import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from './error.middleware';
import { Schema } from 'joi';
import { logger } from '../utils/logger.util';

// التحقق من صحة الطلب | Request validation
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail: Joi.ValidationErrorItem) => detail.message)
        .join(', ');
      
      next(new AppError(errorMessage, 400));
      return;
    }

    next();
  };
};

// التحقق من صحة المعلمات | Parameters validation
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail: Joi.ValidationErrorItem) => detail.message)
        .join(', ');
      
      next(new AppError(errorMessage, 400));
      return;
    }

    next();
  };
};

// التحقق من صحة الاستعلام | Query validation
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail: Joi.ValidationErrorItem) => detail.message)
        .join(', ');
      
      next(new AppError(errorMessage, 400));
      return;
    }

    next();
  };
};

// التحقق من صحة الملفات | File validation
export const validateFile = (options: {
  fieldName: string;
  maxSize?: number;
  allowedTypes?: string[];
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const file = req.file;

    if (!file) {
      next(new AppError('الملف مطلوب | File is required', 400));
      return;
    }

    if (options.maxSize && file.size > options.maxSize) {
      next(new AppError('حجم الملف كبير جدًا | File size is too large', 400));
      return;
    }

    if (options.allowedTypes && !options.allowedTypes.includes(file.mimetype)) {
      next(new AppError('نوع الملف غير مسموح به | File type not allowed', 400));
      return;
    }

    next();
  };
};

export const validateSchema = async (schema: Schema, data: any): Promise<any> => {
  try {
    return await schema.validateAsync(data, { abortEarly: false });
  } catch (error) {
    logger.error('Validation error:', error);
    throw error;
  }
};

export const validateRequest = (schema: Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      logger.error('Request validation error:', error);
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map((detail: any) => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
  };
}; 
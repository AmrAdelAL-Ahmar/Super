import Joi from 'joi';
import { NotificationType } from '../interfaces/models/notification.interface';

export const notificationValidation = {
  createNotification: Joi.object({
    recipientId: Joi.string().required(),
    type: Joi.string().valid(...Object.values(NotificationType)).required(),
    title: Joi.string().required().min(3).max(100),
    message: Joi.string().required().min(3).max(500),
    data: Joi.object()
  }),

  getNotificationsByUser: Joi.object({
    page: Joi.number().min(1),
    limit: Joi.number().min(1).max(100),
    sort: Joi.string(),
    type: Joi.string().valid(...Object.values(NotificationType)),
    isRead: Joi.boolean()
  })
}; 
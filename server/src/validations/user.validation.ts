import Joi from 'joi';
import { UserRole } from '../interfaces/models/user.interface';

export const userValidation = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().required(),
    role: Joi.string().valid(...Object.values(UserRole)).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(8).required(),
  }),

  updateProfile: Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    phone: Joi.string(),
    avatar: Joi.string().uri(),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
  }),

  updateUser: Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    role: Joi.string().valid(...Object.values(UserRole)),
    isActive: Joi.boolean(),
  }),
}; 
import { Response } from 'express';

interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: any[];
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): void => {
  const response: SuccessResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  };

  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400,
  errors?: any[]
): void => {
  const response: ErrorResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };

  res.status(statusCode).json(response);
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message?: string
): void => {
  sendSuccess(res, data, message, 201);
};

export const sendNoContent = (res: Response): void => {
  res.status(204).send();
};

export const sendUnauthorized = (
  res: Response,
  message: string = 'Unauthorized'
): void => {
  sendError(res, message, 401);
};

export const sendForbidden = (
  res: Response,
  message: string = 'Forbidden'
): void => {
  sendError(res, message, 403);
};

export const sendNotFound = (
  res: Response,
  message: string = 'Not found'
): void => {
  sendError(res, message, 404);
};

export const sendValidationError = (
  res: Response,
  message: string,
  errors: any[]
): void => {
  sendError(res, message, 422, errors);
};

export const sendServerError = (
  res: Response,
  message: string = 'Internal server error'
): void => {
  sendError(res, message, 500);
}; 
import winston from 'winston';
import environment from '../config/environment';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Add colors to winston
winston.addColors(colors);

// Define the format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define which transports to use based on environment
const transports = [
  // Console transport for all environments
  new winston.transports.Console(),
  
  // File transport for production
  ...(environment.NODE_ENV === 'production'
    ? [
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({ filename: 'logs/all.log' }),
      ]
    : []),
];

// Create the logger instance
export const logger = winston.createLogger({
  level: environment.NODE_ENV === 'development' ? 'debug' : 'info',
  levels,
  format,
  transports,
});

// Export a stream object for Morgan
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Helper functions for common logging scenarios
export const logError = (error: Error, context?: string): void => {
  logger.error(`${context ? `[${context}] ` : ''}${error.message}`, {
    stack: error.stack,
  });
};

export const logInfo = (message: string, data?: any): void => {
  logger.info(message, data);
};

export const logWarning = (message: string, data?: any): void => {
  logger.warn(message, data);
};

export const logDebug = (message: string, data?: any): void => {
  logger.debug(message, data);
};

export const logHttp = (message: string, data?: any): void => {
  logger.http(message, data);
}; 
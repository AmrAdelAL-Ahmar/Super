import mongoose from 'mongoose';
import { logger } from '../utils/logger.util';

// تكوين الاتصال بقاعدة البيانات | Database connection configuration
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermarket';
    
    await mongoose.connect(mongoURI);
    
    logger.info('تم الاتصال بقاعدة البيانات بنجاح | Database connected successfully');
  } catch (error) {
    logger.error('خطأ في الاتصال بقاعدة البيانات | Database connection error:', error);
    process.exit(1);
  }
};

// مراقبة أحداث الاتصال | Connection event listeners
mongoose.connection.on('error', (err) => {
  logger.error('خطأ في اتصال قاعدة البيانات | Database connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('تم قطع الاتصال بقاعدة البيانات | Database disconnected');
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('تم إغلاق اتصال قاعدة البيانات | Database connection closed');
    process.exit(0);
  } catch (error) {
    logger.error('خطأ في إغلاق اتصال قاعدة البيانات | Error closing database connection:', error);
    process.exit(1);
  }
});

export default connectDB; 
import multer from 'multer';
import path from 'path';
import { NextFunction, Request } from 'express';
import { AppError } from './error.middleware';
import environment from '../config/environment';

// تكوين التخزين | Storage configuration
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, environment.UPLOAD_DIR);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// تصفية الملفات | File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('نوع الملف غير مسموح به | File type not allowed', 400));
  }
};

// تكوين التحميل | Upload configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// تحميل صورة واحدة | Single image upload
export const uploadSingleImage = upload.single('image');

// تحميل صور متعددة | Multiple images upload
export const uploadMultipleImages = upload.array('images', 5);

// تحميل ملفات متعددة | Multiple files upload
export const uploadMultipleFiles = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'documents', maxCount: 3 },
]);

// معالجة أخطاء التحميل | Upload error handler
export const handleUploadError = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      next(new AppError('حجم الملف كبير جدًا | File size is too large', 400));
      return;
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      next(new AppError('تم تجاوز الحد الأقصى لعدد الملفات | Too many files', 400));
      return;
    }
  }
  next(err);
}; 
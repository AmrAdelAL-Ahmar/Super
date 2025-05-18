import { Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 
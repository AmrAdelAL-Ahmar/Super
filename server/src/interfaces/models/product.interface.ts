import { Document, Schema } from 'mongoose';

export interface ICategory {
  _id: string;
  name: string;
  description: string;
  imageUrl?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct {
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  costPrice: number;
  categories: string[];
  images: string[];
  mainImage: string;
  sku: string;
  barcode?: string;
  weight?: number;
  weightUnit?: string;
  stockQuantity: number;
  isAvailable: boolean;
  isDiscounted: boolean;
  discountPercentage?: number;
  attributes?: Map<string, string>;
  averageRating: number;
  totalReviews: number;
  storeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  costPrice: number;
  categories: string[];
  images: string[];
  mainImage: string;
  sku: string;
  barcode?: string;
  weight?: number;
  weightUnit?: string;
  stockQuantity: number;
  isAvailable: boolean;
  isDiscounted: boolean;
  discountPercentage?: number;
  attributes?: Map<string, string>;
  averageRating: number;
  totalReviews: number;
  storeId: Schema.Types.ObjectId;
  reviews: Array<{
    user: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
  discountedPrice: number;
  isInStock(): boolean;
  updateStock(quantity: number): Promise<boolean>;
  addReview(userId: string, rating: number, comment: string): Promise<void>;
}

export interface IProductReview {
  _id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
} 
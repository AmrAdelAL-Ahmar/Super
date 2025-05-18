import { IProduct } from '../models/product.interface';
import { IPaginatedResponse } from './common.response';

// واجهة استجابة المنتج | Product Response Interface
export interface IProductResponse extends Omit<IProduct, 'storeId'> {
  store: {
    id: string;
    name: string;
  };
  categoryDetails: {
    id: string;
    name: string;
  }[];
}

// واجهة استجابة تفاصيل المنتج | Product Details Response Interface
export interface IProductDetailsResponse extends IProductResponse {
  reviews: {
    average: number;
    total: number;
    items: {
      id: string;
      user: {
        id: string;
        name: string;
      };
      rating: number;
      comment: string;
      createdAt: Date;
    }[];
  };
  relatedProducts: IProductResponse[];
}

// واجهة استجابة البحث عن منتجات | Product Search Response Interface
export interface IProductSearchResponse extends IPaginatedResponse<IProductResponse> {
  filters: {
    categories: {
      id: string;
      name: string;
      count: number;
    }[];
    priceRange: {
      min: number;
      max: number;
    };
  };
}

// واجهة استجابة الفئة | Category Response Interface
export interface ICategoryResponse {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  parentId?: string;
  isActive: boolean;
  subcategories?: ICategoryResponse[];
  productCount: number;
}

// واجهة استجابة مراجعة المنتج | Product Review Response Interface
export interface IProductReviewResponse {
  id: string;
  productId: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

// واجهة استجابة قائمة المنتجات | Product List Response Interface
export interface IProductListResponse {
  products: IProductResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    categories: {
      id: string;
      name: string;
      count: number;
    }[];
    priceRange: {
      min: number;
      max: number;
    };
  };
}

// واجهة استجابة إحصائيات المنتجات | Product Statistics Response Interface
export interface IProductStatisticsResponse {
  total: number;
  byCategory: {
    categoryId: string;
    categoryName: string;
    count: number;
  }[];
  stockStatus: {
    inStock: number;
    lowStock: number;
    outOfStock: number;
  };
  topSelling: {
    productId: string;
    name: string;
    totalSold: number;
    revenue: number;
  }[];
  timeline: {
    date: Date;
    newProducts: number;
    totalProducts: number;
  }[];
} 
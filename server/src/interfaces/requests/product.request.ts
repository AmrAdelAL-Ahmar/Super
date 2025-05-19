// واجهة طلب إضافة فئة | Add Category Request Interface
export interface ICategoryRequest {
  name: string;
  description: string;
  imageUrl?: string;
  parentId?: string;
  isActive?: boolean;
}

// واجهة طلب إضافة منتج | Add Product Request Interface
export interface IProductRequest {
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
  isAvailable?: boolean;
  isDiscounted?: boolean;
  discountPercentage?: number;
  attributes?: {
    [key: string]: string;
  };
}

// واجهة طلب تحديث مخزون المنتج | Update Product Stock Request Interface
export interface IUpdateProductStockRequest {
  stockQuantity: number;
}

// واجهة طلب إضافة مراجعة منتج | Add Product Review Request Interface
export interface IProductReviewRequest {
  rating: number;
  comment: string;
}

// واجهة طلب البحث عن منتجات | Product Search Request Interface
export interface IProductSearchRequest {
  query?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onSale?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popularity';
  page?: number;
  limit?: number;
}

// واجهة طلب تصفية المنتجات | Filter Products Request Interface
export interface IFilterProductsRequest {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onSale?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} 
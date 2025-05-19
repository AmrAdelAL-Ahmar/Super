/**
 * Nutritional information for a product
 */
export interface ProductNutrition {
  /** Calories per serving (kcal) */
  calories: number;
  /** Protein content per serving (g) */
  protein: number;
  /** Carbohydrate content per serving (g) */
  carbs: number;
  /** Fat content per serving (g) */
  fat: number;
  /** Dietary fiber per serving (g) */
  fiber: number;
}

/**
 * Product price information
 */
export interface ProductPrice {
  /** Base price in local currency */
  value: number;
  /** Discount percentage (0-100) */
  discount: number;
  /** Optional value after discount is applied */
  discountedValue?: number;
}

/**
 * Product inventory information
 */
export interface ProductInventory {
  /** Number of units in stock */
  stock: number;
  /** Measurement unit (e.g., kg, piece, liter) */
  unit: string;
  /** Whether the product is in stock (stock > 0) */
  isAvailable: boolean;
}

/**
 * Product review information
 */
export interface ProductReview {
  /** Average rating (1-5) */
  rating: number;
  /** Number of reviews */
  count: number;
}

/**
 * Product model representing a grocery store item
 */
export interface Product {
  /** Unique identifier */
  id: string;
  /** English name */
  name: string;
  /** Arabic name */
  nameAr: string;
  /** Base price */
  price: number;
  /** Product image URL */
  image: string;
  /** Discount percentage (0-100) */
  discount: number;
  /** Measurement unit (e.g., kg, piece, liter) */
  unit: string;
  /** Product category identifier */
  category: string;
  /** English description */
  description: string;
  /** Arabic description */
  descriptionAr: string;
  /** Number of units in stock */
  stock: number;
  /** Average rating (1-5) */
  rating: number;
  /** Number of reviews */
  reviewCount: number;
  /** Nutritional information */
  nutrition: ProductNutrition;
  /** English tags for filtering and search */
  tags: string[];
  /** Arabic tags for filtering and search */
  tagsAr: string[];
}

/**
 * Product category for filtering
 */
export interface ProductCategory {
  /** Category identifier */
  value: string;
  /** English display name */
  label: string;
  /** Arabic display name */
  labelAr: string;
}

/**
 * Sort option for product listing
 */
export interface SortOption {
  /** Sort option identifier */
  value: string;
  /** English display name */
  label: string;
  /** Arabic display name */
  labelAr: string;
}

/**
 * Product filter criteria
 */
export interface ProductFilter {
  /** Search term for name search */
  searchTerm?: string;
  /** Category to filter by */
  category?: string;
  /** Minimum price range */
  minPrice?: number;
  /** Maximum price range */
  maxPrice?: number;
  /** Sort option identifier */
  sortBy?: string;
  /** Page number for pagination */
  page?: number;
  /** Items per page for pagination */
  limit?: number;
}

/**
 * Calculate the discounted price of a product
 * @param price Original price
 * @param discount Discount percentage (0-100)
 * @returns Discounted price
 */
export const calculateDiscountedPrice = (price: number, discount: number): number => {
  if (discount <= 0) return price;
  return price * (1 - discount / 100);
};

/**
 * Check if a product is in stock
 * @param product Product to check
 * @returns Boolean indicating if product is available
 */
export const isProductInStock = (product: Product): boolean => {
  return product.stock > 0;
}; 
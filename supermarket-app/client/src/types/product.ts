export interface ProductNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  image: string;
  discount: number;
  unit: string;
  category: string;
  description: string;
  descriptionAr: string;
  stock: number;
  rating: number;
  reviewCount: number;
  nutrition: ProductNutrition;
  tags: string[];
  tagsAr: string[];
}

export interface ProductCategory {
  value: string;
  label: string;
  labelAr: string;
}

export interface SortOption {
  value: string;
  label: string;
  labelAr: string;
} 
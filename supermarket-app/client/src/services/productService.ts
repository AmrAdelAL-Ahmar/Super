import { Product, ProductCategory } from '@/types/product';

// Mock products data
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Fresh Apples',
    nameAr: 'تفاح طازج',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6',
    discount: 0,
    unit: 'kg',
    category: 'fruits',
    description: 'Fresh and juicy apples harvested from organic farms. Rich in nutrients and perfect for daily consumption.',
    descriptionAr: 'تفاح طازج وعصير مقطوف من مزارع عضوية. غني بالعناصر الغذائية ومثالي للاستهلاك اليومي.',
    stock: 50,
    rating: 4.5,
    reviewCount: 128,
    nutrition: {
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
      fiber: 2.4
    },
    tags: ['organic', 'fresh', 'fruits'],
    tagsAr: ['عضوي', 'طازج', 'فواكه'],
  },
  {
    id: '2',
    name: 'Organic Milk',
    nameAr: 'حليب عضوي',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b',
    discount: 10,
    unit: 'liter',
    category: 'dairy',
    description: 'Organic whole milk from grass-fed cows. Free from antibiotics and hormones.',
    descriptionAr: 'حليب عضوي كامل الدسم من أبقار تتغذى على العشب. خالي من المضادات الحيوية والهرمونات.',
    stock: 30,
    rating: 4.7,
    reviewCount: 96,
    nutrition: {
      calories: 150,
      protein: 8,
      carbs: 12,
      fat: 8,
      fiber: 0
    },
    tags: ['organic', 'dairy', 'refrigerated'],
    tagsAr: ['عضوي', 'ألبان', 'مبرد'],
  },
  {
    id: '3',
    name: 'Whole Wheat Bread',
    nameAr: 'خبز القمح الكامل',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
    discount: 0,
    unit: 'loaf',
    category: 'bakery',
    description: 'Freshly baked whole wheat bread made with premium ingredients and traditional methods.',
    descriptionAr: 'خبز القمح الكامل المخبوز طازجًا مصنوع من مكونات عالية الجودة وبطرق تقليدية.',
    stock: 25,
    rating: 4.3,
    reviewCount: 75,
    nutrition: {
      calories: 100,
      protein: 4,
      carbs: 18,
      fat: 1.5,
      fiber: 3
    },
    tags: ['whole grain', 'bakery', 'fresh'],
    tagsAr: ['حبوب كاملة', 'مخبوزات', 'طازج'],
  },
  {
    id: '4',
    name: 'Fresh Chicken',
    nameAr: 'دجاج طازج',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791',
    discount: 15,
    unit: 'kg',
    category: 'meat',
    description: 'Premium quality chicken raised without antibiotics. Perfect for grilling, roasting, or frying.',
    descriptionAr: 'دجاج ذو جودة عالية تم تربيته بدون مضادات حيوية. مثالي للشوي أو التحميص أو القلي.',
    stock: 20,
    rating: 4.6,
    reviewCount: 92,
    nutrition: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0
    },
    tags: ['protein', 'meat', 'refrigerated'],
    tagsAr: ['بروتين', 'لحوم', 'مبرد'],
  },
  {
    id: '5',
    name: 'Organic Tomatoes',
    nameAr: 'طماطم عضوية',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924',
    discount: 0,
    unit: 'kg',
    category: 'vegetables',
    description: 'Vine-ripened organic tomatoes. Juicy, flavorful, and perfect for salads or cooking.',
    descriptionAr: 'طماطم عضوية ناضجة على الكرمة. عصيرية، ذات نكهة رائعة، ومثالية للسلطات أو الطبخ.',
    stock: 40,
    rating: 4.4,
    reviewCount: 68,
    nutrition: {
      calories: 18,
      protein: 0.9,
      carbs: 3.9,
      fat: 0.2,
      fiber: 1.2
    },
    tags: ['organic', 'vegetables', 'fresh'],
    tagsAr: ['عضوي', 'خضروات', 'طازج'],
  }
];

/**
 * Get all products
 */
export const getAllProducts = async (): Promise<Product[]> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_PRODUCTS), 300);
  });
};

/**
 * Get product by ID
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = MOCK_PRODUCTS.find(p => p.id === id) || null;
      resolve(product);
    }, 300);
  });
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = category === 'all' 
        ? MOCK_PRODUCTS 
        : MOCK_PRODUCTS.filter(p => p.category === category);
      resolve(products);
    }, 300);
  });
};

/**
 * Search products
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => {
      const searchLower = query.toLowerCase();
      const products = MOCK_PRODUCTS.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.nameAr.includes(query) ||
        product.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)) ||
        product.tagsAr.some((tag: string) => tag.includes(query))
      );
      resolve(products);
    }, 300);
  });
};

/**
 * Get related products
 */
export const getRelatedProducts = async (productId: string, limit = 4): Promise<Product[]> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentProduct = MOCK_PRODUCTS.find(p => p.id === productId);
      if (!currentProduct) {
        resolve([]);
        return;
      }
      
      const relatedProducts = MOCK_PRODUCTS
        .filter(p => p.category === currentProduct.category && p.id !== productId)
        .slice(0, limit);
      
      resolve(relatedProducts);
    }, 300);
  });
};

/**
 * Calculate discounted price
 */
export const calculateDiscountedPrice = (price: number, discount: number): number => {
  if (discount <= 0) return price;
  return price - (price * discount / 100);
};

/**
 * Get all product categories
 */
export const getAllCategories = async (): Promise<ProductCategory[]> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    const categories: ProductCategory[] = [
      { value: 'all', label: 'All Categories', labelAr: 'جميع الفئات' },
      { value: 'fruits', label: 'Fruits', labelAr: 'فواكه' },
      { value: 'vegetables', label: 'Vegetables', labelAr: 'خضروات' },
      { value: 'dairy', label: 'Dairy', labelAr: 'منتجات الألبان' },
      { value: 'meat', label: 'Meat', labelAr: 'لحوم' },
      { value: 'seafood', label: 'Seafood', labelAr: 'مأكولات بحرية' },
      { value: 'bakery', label: 'Bakery', labelAr: 'مخبوزات' },
    ];
    
    setTimeout(() => resolve(categories), 300);
  });
}; 
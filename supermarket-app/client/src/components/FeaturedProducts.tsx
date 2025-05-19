import React, { useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

// Sample data - this would come from an API in a real application
const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Bananas',
    nameAr: 'موز عضوي',
    price: 2.99,
    image: '/images/products/bananas.jpg',
    discount: 0,
    unit: 'kg',
    category: 'fruits',
    description: 'Fresh organic bananas from local farms',
    descriptionAr: 'موز عضوي طازج من المزارع المحلية',
    stock: 50,
    rating: 4.5,
    reviewCount: 12,
    nutrition: {
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
      fiber: 2.6
    },
    tags: ['organic', 'fresh', 'fruit'],
    tagsAr: ['عضوي', 'طازج', 'فاكهة']
  },
  {
    id: '2',
    name: 'Fresh Tomatoes',
    nameAr: 'طماطم طازجة',
    price: 1.99,
    image: '/images/products/tomatoes.jpg',
    discount: 10,
    unit: 'kg',
    category: 'vegetables',
    description: 'Locally grown tomatoes, perfect for salads',
    descriptionAr: 'طماطم مزروعة محليًا، مثالية للسلطات',
    stock: 40,
    rating: 4.2,
    reviewCount: 8,
    nutrition: {
      calories: 18,
      protein: 0.9,
      carbs: 3.9,
      fat: 0.2,
      fiber: 1.2
    },
    tags: ['fresh', 'vegetable', 'local'],
    tagsAr: ['طازج', 'خضار', 'محلي']
  },
  {
    id: '3',
    name: 'Milk',
    nameAr: 'حليب',
    price: 3.49,
    image: '/images/products/milk.jpg',
    discount: 0,
    unit: 'l',
    category: 'dairy',
    description: 'Fresh whole milk from grass-fed cows',
    descriptionAr: 'حليب كامل الدسم طازج من أبقار تتغذى على العشب',
    stock: 30,
    rating: 4.8,
    reviewCount: 15,
    nutrition: {
      calories: 64,
      protein: 3.2,
      carbs: 4.8,
      fat: 3.6,
      fiber: 0
    },
    tags: ['dairy', 'fresh'],
    tagsAr: ['ألبان', 'طازج']
  },
  {
    id: '4',
    name: 'Whole Wheat Bread',
    nameAr: 'خبز القمح الكامل',
    price: 2.49,
    image: '/images/products/bread.jpg',
    discount: 0,
    unit: 'piece',
    category: 'bakery',
    description: 'Freshly baked whole wheat bread',
    descriptionAr: 'خبز القمح الكامل المخبوز طازجًا',
    stock: 25,
    rating: 4.3,
    reviewCount: 10,
    nutrition: {
      calories: 81,
      protein: 4,
      carbs: 15,
      fat: 1.1,
      fiber: 2.2
    },
    tags: ['bakery', 'whole grain'],
    tagsAr: ['مخبوزات', 'حبوب كاملة']
  },
  {
    id: '5',
    name: 'Chicken Breast',
    nameAr: 'صدور دجاج',
    price: 5.99,
    image: '/images/products/chicken.jpg',
    discount: 15,
    unit: 'kg',
    category: 'meat',
    description: 'Boneless, skinless chicken breast',
    descriptionAr: 'صدور دجاج بدون عظم وبدون جلد',
    stock: 20,
    rating: 4.6,
    reviewCount: 9,
    nutrition: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0
    },
    tags: ['meat', 'protein'],
    tagsAr: ['لحوم', 'بروتين']
  },
  {
    id: '6',
    name: 'Orange Juice',
    nameAr: 'عصير برتقال',
    price: 3.99,
    image: '/images/products/orange-juice.jpg',
    discount: 0,
    unit: 'l',
    category: 'beverages',
    description: 'Freshly squeezed orange juice',
    descriptionAr: 'عصير برتقال طازج',
    stock: 35,
    rating: 4.7,
    reviewCount: 14,
    nutrition: {
      calories: 45,
      protein: 0.7,
      carbs: 10.4,
      fat: 0.2,
      fiber: 0.2
    },
    tags: ['juice', 'beverage', 'no added sugar'],
    tagsAr: ['عصير', 'مشروب', 'بدون سكر مضاف']
  },
  {
    id: '7',
    name: 'Apples',
    nameAr: 'تفاح',
    price: 2.49,
    image: '/images/products/apples.jpg',
    discount: 0,
    unit: 'kg',
    category: 'fruits',
    description: 'Fresh, crisp apples from local orchards',
    descriptionAr: 'تفاح طازج ومقرمش من البساتين المحلية',
    stock: 45,
    rating: 4.4,
    reviewCount: 11,
    nutrition: {
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
      fiber: 2.4
    },
    tags: ['fruit', 'fresh', 'local'],
    tagsAr: ['فاكهة', 'طازج', 'محلي']
  },
  {
    id: '8',
    name: 'Fresh Eggs',
    nameAr: 'بيض طازج',
    price: 4.99,
    image: '/images/products/eggs.jpg',
    discount: 0,
    unit: 'pack',
    category: 'dairy',
    description: 'Farm-fresh free-range eggs, pack of 12',
    descriptionAr: 'بيض طازج من المزرعة، عبوة من 12 بيضة',
    stock: 28,
    rating: 4.9,
    reviewCount: 17,
    nutrition: {
      calories: 72,
      protein: 6.3,
      carbs: 0.4,
      fat: 5,
      fiber: 0
    },
    tags: ['eggs', 'protein', 'free-range'],
    tagsAr: ['بيض', 'بروتين', 'طليق']
  },
];

/**
 * Animation variants for the featured products container
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Animation variants for the individual product cards
 */
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

/**
 * Animation variants for the section title
 */
const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

/**
 * Animation variants for the view all button
 */
const buttonVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.05,
    backgroundColor: "#374151", // Darker hover state
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.98
  }
};

/**
 * FeaturedProducts component displays a selection of featured products
 * on the homepage using a grid layout
 */
const FeaturedProducts: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();

  /**
   * Handler for View All button - Navigates to products page
   */
  const handleViewAll = useCallback(() => {
    router.push('/products');
  }, [router]);

  // Error handling for empty products array
  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t('home.featured.title')}
          </h2>
          <p className="text-gray-600">
            {t('home.featured.noProducts', 'No featured products available at the moment.')}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t('home.featured.title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('home.featuredProducts.subtitle', 'Check out our best-selling products, handpicked for you')}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {featuredProducts.map((product) => (
            <motion.div key={product.id} variants={cardVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center mt-12"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            onClick={handleViewAll}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
            whileHover="hover"
            whileTap="tap"
            aria-label={t('home.featured.viewAll') || 'View all products'}
          >
            {t('home.featured.viewAll')}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts; 
import React, { useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Image from 'next/image';

/**
 * Category interface representing a product category
 */
interface Category {
  /** Unique identifier */
  id: string;
  /** English name */
  name: string;
  /** Arabic name */
  nameAr: string;
  /** Category image URL */
  image: string;
  /** URL slug for routing */
  slug: string;
  /** Optional color for category highlighting */
  color?: string;
}

// Categories data - in a real app, this would come from an API
const categories: Category[] = [
  {
    id: '1',
    name: 'Fruits',
    nameAr: 'فواكه',
    image: '/images/categories/fruits.jpg',
    slug: 'fruits',
    color: '#e7f4e4'
  },
  {
    id: '2',
    name: 'Vegetables',
    nameAr: 'خضروات',
    image: '/images/categories/vegetables.jpg',
    slug: 'vegetables',
    color: '#e4f4e7'
  },
  {
    id: '3',
    name: 'Dairy',
    nameAr: 'منتجات الألبان',
    image: '/images/categories/dairy.jpg',
    slug: 'dairy',
    color: '#f4f4e4'
  },
  {
    id: '4',
    name: 'Bakery',
    nameAr: 'مخبوزات',
    image: '/images/categories/bakery.jpg',
    slug: 'bakery',
    color: '#f4e7e4'
  },
  {
    id: '5',
    name: 'Meat',
    nameAr: 'لحوم',
    image: '/images/categories/meat.jpg',
    slug: 'meat',
    color: '#f4e4e4'
  },
  {
    id: '6',
    name: 'Beverages',
    nameAr: 'مشروبات',
    image: '/images/categories/beverages.jpg',
    slug: 'beverages',
    color: '#e4e7f4'
  },
];

/**
 * Animation variants for the main container
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    },
  },
};

/**
 * Animation variants for individual category items
 */
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    } 
  },
  hover: {
    y: -10,
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: 0.3,
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
 * Animation variants for the button
 */
const buttonVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.05,
    backgroundColor: "#374151",
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.98
  }
};

/**
 * CategorySection component displays product categories in a grid layout
 * with images and names, allowing navigation to category-specific pages
 */
const CategorySection: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isArabic = router.locale === 'ar';

  /**
   * Handles navigation to the selected category page
   * @param slug - URL slug for the selected category
   */
  const handleCategoryClick = useCallback((slug: string): void => {
    router.push(`/categories/${slug}`);
  }, [router]);

  /**
   * Handles navigation to the all categories page
   */
  const handleViewAllClick = useCallback((): void => {
    router.push('/categories');
  }, [router]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t('home.categories.title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('home.categories.subtitle')}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer"
              onClick={() => handleCategoryClick(category.slug)}
              variants={itemVariants}
              whileHover="hover"
              aria-label={isArabic ? category.nameAr : category.name}
            >
              <div className="relative h-40">
                <Image
                  src={category.image}
                  alt={isArabic ? category.nameAr : category.name}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  loading="lazy"
                />
              </div>
              <div 
                className="p-4 text-center"
                style={{ backgroundColor: category.color || 'transparent' }}
              >
                <h3 className="font-semibold text-gray-800">
                  {isArabic ? category.nameAr : category.name}
                </h3>
              </div>
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
            onClick={handleViewAllClick}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
            whileHover="hover"
            whileTap="tap"
            aria-label={t('home.categories.viewAll') || 'View all categories'}
          >
            {t('home.categories.viewAll')}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection; 
import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

// Category type definition
interface Category {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  slug: string;
}

const categories: Category[] = [
  {
    id: '1',
    name: 'Fruits',
    nameAr: 'فواكه',
    image: '/images/categories/fruits.jpg',
    slug: 'fruits',
  },
  {
    id: '2',
    name: 'Vegetables',
    nameAr: 'خضروات',
    image: '/images/categories/vegetables.jpg',
    slug: 'vegetables',
  },
  {
    id: '3',
    name: 'Dairy',
    nameAr: 'منتجات الألبان',
    image: '/images/categories/dairy.jpg',
    slug: 'dairy',
  },
  {
    id: '4',
    name: 'Bakery',
    nameAr: 'مخبوزات',
    image: '/images/categories/bakery.jpg',
    slug: 'bakery',
  },
  {
    id: '5',
    name: 'Meat',
    nameAr: 'لحوم',
    image: '/images/categories/meat.jpg',
    slug: 'meat',
  },
  {
    id: '6',
    name: 'Beverages',
    nameAr: 'مشروبات',
    image: '/images/categories/beverages.jpg',
    slug: 'beverages',
  },
];

const CategorySection: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { language } = router.locale === 'ar' ? { language: 'ar' } : { language: 'en' };

  const handleCategoryClick = (slug: string) => {
    router.push(`/categories/${slug}`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t('home.categories.title', 'Shop by Category')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('home.categories.subtitle', 'Browse our wide selection of products by category and find exactly what you need')}
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleCategoryClick(category.slug)}
              variants={item}
            >
              <div className="relative h-40">
                <img
                  src={category.image}
                  alt={language === 'ar' ? category.nameAr : category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-semibold text-gray-800">
                  {language === 'ar' ? category.nameAr : category.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/categories')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            {t('home.categories.viewAll', 'View All Categories')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection; 
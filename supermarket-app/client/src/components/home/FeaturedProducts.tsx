import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import ProductCard from '../ProductCard';

// Product type definition
interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  image: string;
  discount: number;
  unit: string;
  category: string;
}

// Sample data - this would come from an API in the real application
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
  },
];

const FeaturedProducts: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t('home.featuredProducts.title', 'Featured Products')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('home.featuredProducts.subtitle', 'Check out our best-selling products, handpicked for you')}
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/products')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            {t('home.featuredProducts.viewAll', 'View All Products')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts; 
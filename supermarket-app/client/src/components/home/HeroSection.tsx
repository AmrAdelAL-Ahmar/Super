import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const handleShopNow = () => {
    router.push('/products');
  };

  return (
    <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
        {/* Text Content */}
        <motion.div 
          className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {t('home.hero.title', 'Fresh Groceries Delivered to Your Door')}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-primary-100">
            {t('home.hero.subtitle', 'Shop conveniently from our wide range of quality products and get them delivered right to your doorstep.')}
          </p>
          <button
            onClick={handleShopNow}
            className="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            {t('home.hero.shopNow', 'Shop Now')}
          </button>
        </motion.div>

        {/* Image */}
        <motion.div 
          className="md:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <img
              src="/images/hero-grocery.png"
            
              alt={t('home.hero.imageAlt', 'Grocery basket with fresh products')||""}
              className="rounded-lg shadow-xl w-full"
            />
            <div className="absolute -bottom-6 -right-6 bg-secondary-500 text-white py-3 px-6 rounded-lg shadow-lg">
              <p className="text-sm font-semibold">
                {t('home.hero.discount', 'Get 10% off your first order')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Wave SVG */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200" className="w-full">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,128L48,112C96,96,192,64,288,64C384,64,480,96,576,122.7C672,149,768,171,864,165.3C960,160,1056,128,1152,106.7C1248,85,1344,75,1392,69.3L1440,64L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection; 
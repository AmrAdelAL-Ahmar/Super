import React, { useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Image from 'next/image';

/**
 * Animation variants for text elements
 */
const textVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

/**
 * Animation variants for image
 */
const imageVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay: 0.3,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.03,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

/**
 * Animation variants for discount badge
 */
const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -5 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.4,
      delay: 0.8,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.1,
    rotate: 3,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

/**
 * Animation variants for the button
 */
const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.98
  }
};

/**
 * HeroSection component displays the main banner on the homepage
 * featuring a headline, subtext, call-to-action button, and hero image
 */
const HeroSection: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isArabic = router.locale === 'ar';

  /**
   * Navigates to the products page when Shop Now button is clicked
   */
  const handleShopNow = useCallback((): void => {
    router.push('/products');
  }, [router]);

  return (
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center z-10 relative">
        {/* Text Content */}
        <motion.div 
          className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {t('home.hero.title')}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-primary-100 max-w-lg opacity-90">
            {t('home.hero.subtitle')}
          </p>
          <motion.button
            onClick={handleShopNow}
            className="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            aria-label={t('home.hero.shopNow') || 'Shop Now'}
          >
            {t('home.hero.shopNow')}
          </motion.button>
        </motion.div>

        {/* Image */}
        <motion.div 
          className="md:w-1/2 relative"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
          whileHover="hover"
        >
          <div className="relative">
            {/* Use next/image for better performance */}
            <div className="relative h-[400px] w-full">
              <Image
                src="/images/hero-grocery.png"
                alt={t('home.hero.imageAlt') || "Grocery basket with fresh products"}
                className="rounded-lg shadow-2xl object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <motion.div 
              className="absolute -bottom-6 -right-6 bg-secondary-500 text-white py-3 px-6 rounded-lg shadow-lg transform"
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <p className="text-sm font-semibold">
                {t('home.hero.discount')}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Wave SVG */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 200" 
          className="w-full" 
          aria-hidden="true"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,128L48,112C96,96,192,64,288,64C384,64,480,96,576,122.7C672,149,768,171,864,165.3C960,160,1056,128,1152,106.7C1248,85,1344,75,1392,69.3L1440,64L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection; 
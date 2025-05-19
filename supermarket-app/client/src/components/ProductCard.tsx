import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { addItem } from '@/features/cart/cartSlice';
import { ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Product, calculateDiscountedPrice } from '@/types/product';

/**
 * Props interface for the ProductCard component
 */
interface ProductCardProps {
  /** Product data object */
  product: Product;
  /** Optional className for custom styling */
  className?: string;
  /** Optional compact mode for smaller displays */
  compact?: boolean;
}

/**
 * Animation variants for card hover and tap effects
 */
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
    }
  },
  hover: {
    y: -8,
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98
  }
};

/**
 * Animation variants for the add to cart button
 */
const buttonVariants = {
  hover: {
    scale: 1.03,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.97
  }
};

/**
 * Animation variants for discount badge
 */
const discountVariants = {
  initial: { scale: 0, rotate: -10 },
  animate: { 
    scale: 1, 
    rotate: 0,
    transition: {
      duration: 0.3,
      ease: "backOut"
    }
  }
};

/**
 * ProductCard component displays a single product with image, name, price, and add to cart button
 * Used in product listings, featured products, and related products sections
 */
const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  className = '',
  compact = false
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();
  const isArabic = router.locale === 'ar';

  /**
   * Handles adding the product to cart
   * Dispatches the addItem action with the product data
   * @param e - Click event 
   */
  const handleAddToCart = useCallback((e: React.MouseEvent): void => {
    e.stopPropagation();
    e.preventDefault();
    
    dispatch(addItem({
      id: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: product.image,
      quantity: 1,
      stock: product.stock || 100, // Fallback to 100 if stock not provided
      unit: product.unit,
      discount: product.discount
    }));
  }, [dispatch, product]);

  /**
   * Navigates to the product detail page
   */
  const handleViewProduct = useCallback((): void => {
    router.push(`/products/${product.id}`);
  }, [router, product.id]);

  // Calculate discounted price if applicable
  const discountedPrice = product.discount > 0 
    ? calculateDiscountedPrice(product.price, product.discount)
    : null;

  // Get the translated add to cart text
  const addToCartText = t('products.addToCart');

  // Render full or compact stars based on product rating
  const renderRating = () => {
    if (!product.rating) return null;
    
    return (
      <div className="flex items-center mt-1 mb-2">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className="text-yellow-400 mr-0.5">
            {i < Math.floor(product.rating) ? (
              <StarIconSolid className="h-4 w-4" />
            ) : (
              <StarIcon className="h-4 w-4" />
            )}
          </span>
        ))}
        <span className="text-xs text-gray-500 ml-1">
          ({product.reviewCount || 0})
        </span>
      </div>
    );
  };

  return (
    <motion.div
      className={`bg-white rounded-lg overflow-hidden shadow-md ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      onClick={handleViewProduct}
      role="button"
      tabIndex={0}
      aria-label={`View details of ${isArabic ? product.nameAr : product.name}`}
    >
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100">
        <Image
          src={product.image}
          alt={isArabic ? product.nameAr : product.name}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          loading="lazy"
        />
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <motion.div 
            className="absolute top-2 right-2 bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md"
            variants={discountVariants}
            initial="initial"
            animate="animate"
          >
            -{product.discount}% {t('products.discount')}
          </motion.div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 h-12">
          {isArabic ? product.nameAr : product.name}
        </h3>
        
        {!compact && renderRating()}

        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <span className="text-gray-500 text-sm">
              {product.unit}
            </span>
          </div>
          <div>
            {discountedPrice ? (
              <div className="flex flex-col items-end">
                <span className="text-gray-400 line-through text-sm">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-primary-600 font-semibold">
                  ${discountedPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-primary-600 font-semibold">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        {!compact && product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map(tag => (
              <span 
                key={tag} 
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Add to Cart Button */}
        <motion.button
          onClick={handleAddToCart}
          className="w-full bg-primary-500 text-white py-2 rounded-md flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          aria-label={addToCartText || "Add to Cart"}
        >
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          {addToCartText}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard; 
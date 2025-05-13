import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { addItem } from '@/features/cart/cartSlice';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

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

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();
  const locale = router.locale || 'en';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addItem({
      id: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.discount > 0 
        ? product.price - (product.price * product.discount / 100) 
        : product.price,
      image: product.image,
      quantity: 1,
      stock: 100, // This would come from the API in a real application
      unit: product.unit,
    }));
  };

  const handleViewProduct = () => {
    router.push(`/products/${product.id}`);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
      }
    },
    hover: {
      y: -5,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      transition: {
        duration: 0.2,
      }
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden shadow-md"
      variants={cardVariants}
      initial="hidden"
      animate="show"
      whileHover="hover"
      onClick={handleViewProduct}
    >
      {/* Product Image */}
      <div className="relative h-48">
        <img
          src={product.image}
          alt={locale === 'ar' ? product.nameAr : product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1">
          {locale === 'ar' ? product.nameAr : product.name}
        </h3>
        
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <span className="text-gray-500 text-sm">
              {product.unit}
            </span>
          </div>
          <div>
            {product.discount > 0 ? (
              <div className="flex flex-col items-end">
                <span className="text-gray-400 line-through text-sm">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-primary-600 font-semibold">
                  ${(product.price - (product.price * product.discount / 100)).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-primary-600 font-semibold">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-primary-500 text-white py-2 rounded-md flex items-center justify-center hover:bg-primary-600 transition-colors"
        >
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          {t('products.addToCart', 'Add to Cart')}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard; 
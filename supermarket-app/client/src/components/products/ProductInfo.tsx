import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Rating, 
  Chip, 
  Button,
  TextField,
  IconButton
} from '@mui/material';
import { 
  ShoppingCartIcon,
  MinusIcon,
  PlusIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Product, calculateDiscountedPrice, isProductInStock } from '@/types/product';

interface ProductInfoProps {
  product: Product;
  onAddToCart: (quantity: number) => void;
  className?: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  onAddToCart,
  className = '',
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale || 'en';
  
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Calculate discounted price
  const discountedPrice = product.discount > 0 
    ? calculateDiscountedPrice(product.price, product.discount)
    : null;
  
  // Check if product is in stock
  const inStock = isProductInStock(product);
  
  // Handle quantity change
  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    onAddToCart(quantity);
    setAddedToCart(true);
    
    // Reset added to cart state after 2 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {/* Product Name */}
      <Typography variant="h4" component="h1" className="font-bold mb-2">
        {locale === 'ar' ? product.nameAr : product.name}
      </Typography>
      
      {/* Rating */}
      <Box className="flex items-center mb-4">
        <Rating value={product.rating} precision={0.5} readOnly />
        <Typography variant="body2" className="ml-2 text-gray-600">
          ({product.reviewCount} {t('products.reviews')})
        </Typography>
      </Box>
      
      {/* Price */}
      <Box className="flex items-center mb-4">
        {discountedPrice ? (
          <>
            <Typography variant="h5" className="font-bold mr-2">
              ${discountedPrice.toFixed(2)}
            </Typography>
            <Typography variant="body1" className="line-through text-gray-500">
              ${product.price.toFixed(2)}
            </Typography>
          </>
        ) : (
          <Typography variant="h5" className="font-bold">
            ${product.price.toFixed(2)}
          </Typography>
        )}
        <Typography variant="body2" className="ml-2 text-gray-600">
          / {product.unit}
        </Typography>
      </Box>
      
      {/* Tags */}
      <Box className="flex flex-wrap gap-2 mb-6">
        {(locale === 'ar' ? product.tagsAr : product.tags).map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            size="small"
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>
      
      {/* Description */}
      <Typography variant="body1" className="mb-6">
        {locale === 'ar' ? product.descriptionAr : product.description}
      </Typography>
      
      {/* Stock Status */}
      <Box className="mb-6">
        <Typography variant="body2" className="text-gray-600 mb-1">
          {t('products.availability')}:
        </Typography>
        {inStock ? (
          <Box className="flex items-center">
            <CheckIcon className="h-5 w-5 text-green-500 mr-1" />
            <Typography variant="body1" className="text-green-600 font-medium">
              {t('products.inStock')} ({product.stock} {t('products.available')})
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1" className="text-red-600 font-medium">
            {t('products.outOfStock')}
          </Typography>
        )}
      </Box>
      
      {/* Quantity Selector */}
      <Box className="flex items-center mb-6">
        <Typography variant="body1" className="mr-4">
          {t('products.quantity')}:
        </Typography>
        <Box className="flex items-center">
          <IconButton
            size="small"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            <MinusIcon className="h-4 w-4" />
          </IconButton>
          
          <TextField
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value)) {
                handleQuantityChange(value);
              }
            }}
            type="number"
            InputProps={{
              inputProps: { 
                min: 1, 
                max: product.stock,
                style: { textAlign: 'center' }
              }
            }}
            variant="outlined"
            size="small"
            className="w-16 mx-2"
          />
          
          <IconButton
            size="small"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= product.stock}
          >
            <PlusIcon className="h-4 w-4" />
          </IconButton>
        </Box>
      </Box>
      
      {/* Add to Cart Button */}
      <Button
        variant="contained"
        color={addedToCart ? "success" : "primary"}
        size="large"
        startIcon={addedToCart ? <CheckIcon className="h-5 w-5" /> : <ShoppingCartIcon className="h-5 w-5" />}
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700"
      >
        {addedToCart ? t('products.addedToCart') : t('products.addToCart')}
      </Button>
    </motion.div>
  );
};

export default ProductInfo; 
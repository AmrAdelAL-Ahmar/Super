import React, { useState } from 'react';
import Image from 'next/image';
import { Box, Paper, IconButton, Badge } from '@mui/material';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

interface ProductGalleryProps {
  mainImage: string;
  thumbnails?: string[];
  alt: string;
  discount?: number;
  onFavoriteToggle?: () => void;
  isFavorite?: boolean;
  className?: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  mainImage,
  thumbnails = [],
  alt,
  discount = 0,
  onFavoriteToggle,
  isFavorite = false,
  className = '',
}) => {
  const [currentImage, setCurrentImage] = useState(mainImage);
  
  // Combine main image with thumbnails for all images
  const allImages = [mainImage, ...thumbnails.filter(img => img !== mainImage)];
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {/* Main Image */}
      <Paper 
        elevation={0} 
        className="relative overflow-hidden rounded-lg mb-4 aspect-square"
      >
        {discount > 0 && (
          <Badge
            color="error"
            badgeContent={`-${discount}%`}
            className="absolute top-4 left-4 z-10"
          />
        )}
        
        {onFavoriteToggle && (
          <IconButton
            className="absolute top-4 right-4 z-10 bg-white bg-opacity-80 hover:bg-opacity-100"
            onClick={onFavoriteToggle}
            size="small"
          >
            {isFavorite ? (
              <HeartIconSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600" />
            )}
          </IconButton>
        )}
        
        <Box className="w-full h-full relative">
          <Image
            src={currentImage}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </Box>
      </Paper>
      
      {/* Thumbnails */}
      {allImages.length > 1 && (
        <Box className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <Paper
              key={index}
              elevation={0}
              className={`relative overflow-hidden rounded-md cursor-pointer transition-all h-16 w-16 flex-shrink-0 ${
                currentImage === image ? 'ring-2 ring-primary-500' : 'ring-1 ring-gray-200'
              }`}
              onClick={() => setCurrentImage(image)}
            >
              <Image
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                fill
                sizes="(max-width: 768px) 25vw, 10vw"
                className="object-cover"
              />
            </Paper>
          ))}
        </Box>
      )}
    </motion.div>
  );
};

export default ProductGallery; 
// API URL configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Image URLs and CDN configuration
export const IMAGE_BASE_URL = 'https://images.unsplash.com';

// Default pagination limits
export const DEFAULT_PAGE_SIZE = 10;

// Default currency
export const DEFAULT_CURRENCY = 'USD';
export const DEFAULT_CURRENCY_SYMBOL = '$';

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'supermarket_auth_token',
  USER: 'supermarket_user',
  CART: 'supermarket_cart',
  LANGUAGE: 'supermarket_language',
};

// Routes that don't require authentication
export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/products',
  '/products/[id]',
  '/categories',
  '/categories/[slug]',
  '/about',
  '/contact',
]; 
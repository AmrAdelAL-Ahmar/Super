import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setLanguage } from '@/features/ui/uiSlice';
import { logout } from '@/features/auth/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  Bars3Icon as MenuIcon, 
  XMarkIcon as XIcon, 
  GlobeAltIcon as GlobeIcon 
} from '@heroicons/react/24/outline';

/**
 * NavLink props interface
 */
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * NavLink component for consistent styling
 */
const NavLink: React.FC<NavLinkProps> = ({ href, children, className = '' }) => (
  <Link 
    href={href} 
    className={`hover:text-primary-200 transition-colors duration-200 ${className}`}
  >
    {children}
  </Link>
);

/**
 * Navbar component for site-wide navigation
 */
const Navbar: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { language } = useSelector((state: RootState) => state.ui);
  const { totalItems } = useSelector((state: RootState) => state.cart);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleLanguageChange = useCallback(() => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    dispatch(setLanguage(newLanguage));
    
    // Change the route to the same page but with the new locale
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLanguage });
  }, [language, dispatch, router]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    router.push('/');
  }, [dispatch, router]);

  // Mobile menu animation variants
  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        duration: 0.3,
        ease: "easeInOut" 
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { 
        duration: 0.2,
        ease: "easeInOut" 
      }
    }
  };

  return (
    <nav className="bg-primary-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold tracking-tight">{t('app.name')}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/products">
              {t('navigation.products')}
            </NavLink>
            <NavLink href="/categories">
              {t('navigation.categories')}
            </NavLink>
            
            {/* Conditional links based on user role */}
            {isAuthenticated && user?.role === 'owner' && (
              <NavLink href="/dashboard">
                {t('navigation.dashboard')}
              </NavLink>
            )}
            
            {isAuthenticated && user?.role === 'delivery' && (
              <NavLink href="/delivery">
                {t('delivery.dashboard')}
              </NavLink>
            )}
          </div>

          {/* Right Side Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Language Switcher */}
            <button
              onClick={handleLanguageChange}
              className="flex items-center hover:text-primary-200 transition-colors duration-200"
              aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
            >
              <GlobeIcon className="h-5 w-5 mr-1" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>
            
            {/* Cart Icon */}
            <NavLink href="/cart" className="relative">
              <ShoppingCartIcon className="h-6 w-6" />
              {totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </NavLink>
            
            {/* Auth Links */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                <NavLink href="/profile" className="flex items-center">
                  <UserIcon className="h-5 w-5 mr-1" />
                  <span>{t('navigation.profile')}</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="hover:text-primary-200 transition-colors duration-200"
                >
                  {t('navigation.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLink href="/login">
                  {t('navigation.login')}
                </NavLink>
                <NavLink href="/register" className="bg-white text-primary-600 px-3 py-1.5 rounded-md hover:bg-primary-50 transition-colors duration-200">
                  {t('navigation.register')}
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <NavLink href="/cart" className="relative mr-4">
              <ShoppingCartIcon className="h-6 w-6" />
              {totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </NavLink>
            <button 
              onClick={toggleMenu} 
              className="mobile-menu-button focus:outline-none"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? 
                <XIcon className="h-6 w-6" /> :
                <MenuIcon className="h-6 w-6" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden pt-2 pb-4 space-y-2"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <NavLink href="/products" className="block py-2">
                {t('navigation.products')}
              </NavLink>
              <NavLink href="/categories" className="block py-2">
                {t('navigation.categories')}
              </NavLink>
              
              {/* Conditional links based on user role */}
              {isAuthenticated && user?.role === 'owner' && (
                <NavLink href="/dashboard" className="block py-2">
                  {t('navigation.dashboard')}
                </NavLink>
              )}
              
              {isAuthenticated && user?.role === 'delivery' && (
                <NavLink href="/delivery" className="block py-2">
                  {t('delivery.dashboard')}
                </NavLink>
              )}
              
              {/* Language Switcher */}
              <button
                onClick={handleLanguageChange}
                className="flex items-center py-2 hover:text-primary-200 transition-colors w-full text-left"
              >
                <GlobeIcon className="h-5 w-5 mr-1" />
                <span>{language === 'en' ? 'العربية' : 'English'}</span>
              </button>
              
              {/* Auth Links */}
              {isAuthenticated ? (
                <>
                  <NavLink href="/profile" className="block py-2">
                    {t('navigation.profile')}
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="block py-2 hover:text-primary-200 transition-colors w-full text-left"
                  >
                    {t('navigation.logout')}
                  </button>
                </>
              ) : (
                <>
                  <NavLink href="/login" className="block py-2">
                    {t('navigation.login')}
                  </NavLink>
                  <NavLink href="/register" className="block py-2">
                    {t('navigation.register')}
                  </NavLink>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar; 
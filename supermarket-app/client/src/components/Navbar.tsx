import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setLanguage } from '@/features/ui/uiSlice';
import { logout } from '@/features/auth/authSlice';
import { ShoppingCartIcon, UserIcon, Bars3Icon as MenuIcon, XMarkIcon as XIcon, GlobeAltIcon as GlobeIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { language } = useSelector((state: RootState) => state.ui);
  const { totalItems } = useSelector((state: RootState) => state.cart);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLanguageChange = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    dispatch(setLanguage(newLanguage));
    
    // Change the route to the same page but with the new locale
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLanguage });
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <nav className="bg-primary-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">{t('app.name')}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/products" className="hover:text-primary-200 transition-colors">
              {t('navigation.products')}
            </Link>
            <Link href="/categories" className="hover:text-primary-200 transition-colors">
              {t('navigation.categories')}
            </Link>
            
            {/* Conditional links based on user role */}
            {isAuthenticated && user?.role === 'owner' && (
              <Link href="/dashboard" className="hover:text-primary-200 transition-colors">
                {t('navigation.dashboard')}
              </Link>
            )}
            
            {isAuthenticated && user?.role === 'delivery' && (
              <Link href="/delivery" className="hover:text-primary-200 transition-colors">
                {t('delivery.dashboard')}
              </Link>
            )}
          </div>

          {/* Right Side Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <button
              onClick={handleLanguageChange}
              className="flex items-center hover:text-primary-200 transition-colors"
            >
              <GlobeIcon className="h-5 w-5 mr-1" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>
            
            {/* Cart Icon */}
            <Link href="/cart" className="relative hover:text-primary-200 transition-colors">
              <ShoppingCartIcon className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* Auth Links */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="hover:text-primary-200 transition-colors flex items-center">
                  <UserIcon className="h-5 w-5 mr-1" />
                  <span>{t('navigation.profile')}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-primary-200 transition-colors"
                >
                  {t('navigation.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="hover:text-primary-200 transition-colors">
                  {t('navigation.login')}
                </Link>
                <Link href="/register" className="bg-white text-primary-600 px-3 py-1 rounded-md hover:bg-primary-50 transition-colors">
                  {t('navigation.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link href="/cart" className="relative mr-4 hover:text-primary-200 transition-colors">
              <ShoppingCartIcon className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button onClick={toggleMenu} className="mobile-menu-button">
              {isMenuOpen ? 
                <XIcon className="h-6 w-6" /> :
                <MenuIcon className="h-6 w-6" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-2 pb-4 space-y-2">
            <Link href="/products" className="block py-2 hover:text-primary-200 transition-colors">
              {t('navigation.products')}
            </Link>
            <Link href="/categories" className="block py-2 hover:text-primary-200 transition-colors">
              {t('navigation.categories')}
            </Link>
            
            {/* Conditional links based on user role */}
            {isAuthenticated && user?.role === 'owner' && (
              <Link href="/dashboard" className="block py-2 hover:text-primary-200 transition-colors">
                {t('navigation.dashboard')}
              </Link>
            )}
            
            {isAuthenticated && user?.role === 'delivery' && (
              <Link href="/delivery" className="block py-2 hover:text-primary-200 transition-colors">
                {t('delivery.dashboard')}
              </Link>
            )}
            
            {/* Language Switcher */}
            <button
              onClick={handleLanguageChange}
              className="flex items-center py-2 hover:text-primary-200 transition-colors"
            >
              <GlobeIcon className="h-5 w-5 mr-1" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>
            
            {/* Auth Links */}
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="block py-2 hover:text-primary-200 transition-colors">
                  {t('navigation.profile')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="block py-2 hover:text-primary-200 transition-colors"
                >
                  {t('navigation.logout')}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 hover:text-primary-200 transition-colors">
                  {t('navigation.login')}
                </Link>
                <Link href="/register" className="block py-2 hover:text-primary-200 transition-colors">
                  {t('navigation.register')}
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 
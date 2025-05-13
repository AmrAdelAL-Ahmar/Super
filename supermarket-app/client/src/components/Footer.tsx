import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');
  const { direction } = useSelector((state: RootState) => state.ui);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-800 text-white" dir={direction}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('app.name')}</h3>
            <p className="mb-4">{t('app.slogan')}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-primary-300 transition-colors">
                  {t('navigation.home')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary-300 transition-colors">
                  {t('navigation.products')}
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-primary-300 transition-colors">
                  {t('navigation.categories')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="hover:text-primary-300 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary-300 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-primary-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-primary-300 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">📍</span>
                <span>123 Main Street, City, Country</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📞</span>
                <span>+123 456 7890</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✉️</span>
                <span>info@supermarket-app.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-8 pt-6 text-center">
          <p>
            &copy; {currentYear} {t('app.name')}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
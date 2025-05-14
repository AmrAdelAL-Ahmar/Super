import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '@/store';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon 
} from '@heroicons/react/24/outline';

/**
 * FooterLink interface for consistent footer link structure
 */
interface FooterLink {
  /** Key for translation and unique identification */
  key: string;
  /** URL path for the link */
  href: string;
  /** Default English text if translation is not available */
  defaultText: string;
}

/**
 * ContactItem interface for contact information items
 */
interface ContactItem {
  /** Icon component for the contact item */
  icon: React.ReactNode;
  /** Content text for the contact item */
  content: string;
}

/**
 * SocialLink interface for social media links
 */
interface SocialLink {
  /** Platform name */
  platform: string;
  /** URL to the social media page */
  url: string;
  /** Icon component for the platform */
  icon: React.ReactNode;
}

/**
 * Footer component displays the site footer with links, contact info and copyright
 */
const Footer: React.FC = () => {
  const { t } = useTranslation('common');
  const { direction } = useSelector((state: RootState) => state.ui);
  const currentYear = new Date().getFullYear();

  // Quick links data
  const quickLinks: FooterLink[] = [
    { key: 'navigation.home', href: '/', defaultText: 'Home' },
    { key: 'navigation.products', href: '/products', defaultText: 'Products' },
    { key: 'navigation.categories', href: '/categories', defaultText: 'Categories' },
    { key: 'navigation.offers', href: '/offers', defaultText: 'Special Offers' }
  ];

  // Customer service links
  const customerLinks: FooterLink[] = [
    { key: 'footer.contact', href: '/contact', defaultText: 'Contact Us' },
    { key: 'footer.faq', href: '/faq', defaultText: 'FAQ' },
    { key: 'footer.privacy', href: '/privacy-policy', defaultText: 'Privacy Policy' },
    { key: 'footer.terms', href: '/terms-of-service', defaultText: 'Terms of Service' },
    { key: 'footer.shipping', href: '/shipping-policy', defaultText: 'Shipping Policy' }
  ];

  // Contact information items
  const contactItems: ContactItem[] = [
    { 
      icon: <MapPinIcon className="h-5 w-5 flex-shrink-0" />, 
      content: '123 Main Street, City, Country' 
    },
    { 
      icon: <PhoneIcon className="h-5 w-5 flex-shrink-0" />, 
      content: '+123 456 7890' 
    },
    { 
      icon: <EnvelopeIcon className="h-5 w-5 flex-shrink-0" />, 
      content: 'info@supermarket-app.com' 
    }
  ];

  // Social media links
  const socialLinks: SocialLink[] = [
    {
      platform: 'facebook',
      url: 'https://facebook.com',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
    },
    {
      platform: 'twitter',
      url: 'https://twitter.com',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg>
    },
    {
      platform: 'instagram',
      url: 'https://instagram.com',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path></svg>
    },
    {
      platform: 'youtube',
      url: 'https://youtube.com',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg>
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <footer className="bg-primary-800 text-white pt-16 pb-8" dir={direction}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Company Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-6 border-b border-primary-700 pb-2">{t('app.name')}</h3>
            <p className="mb-6 text-primary-100">{t('app.slogan')}</p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4 mt-4">
              {socialLinks.map((social) => (
                <motion.a 
                  key={social.platform}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-primary-700 hover:bg-primary-600 p-2 rounded-full transition-colors"
                  aria-label={social.platform}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-6 border-b border-primary-700 pb-2">{t('footer.quickLinks', 'Quick Links')}</h3>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.key}>
                  <Link 
                    href={link.href} 
                    className="hover:text-primary-300 transition-colors inline-block py-1 hover:translate-x-1 transform duration-200"
                  >
                    {t(link.key, link.defaultText)}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-6 border-b border-primary-700 pb-2">{t('footer.customerService', 'Customer Service')}</h3>
            <ul className="space-y-3">
              {customerLinks.map(link => (
                <li key={link.key}>
                  <Link 
                    href={link.href} 
                    className="hover:text-primary-300 transition-colors inline-block py-1 hover:translate-x-1 transform duration-200"
                  >
                    {t(link.key, link.defaultText)}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-6 border-b border-primary-700 pb-2">{t('footer.contactInfo', 'Contact Info')}</h3>
            <ul className="space-y-4">
              {contactItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-3 text-primary-300">{item.icon}</span>
                  <span className="text-primary-100">{item.content}</span>
                </li>
              ))}
            </ul>
            
            {/* Newsletter Signup (Simple Version) */}
            <div className="mt-6 pt-4 border-t border-primary-700">
              <h4 className="font-medium mb-2">{t('footer.newsletter', 'Subscribe to Newsletter')}</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder={t('footer.emailPlaceholder', 'Your email') || 'Your email'} 
                  className="bg-primary-700 text-white px-3 py-2 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-400 w-full"
                  aria-label={t('footer.emailPlaceholder', 'Your email') || 'Your email'}
                />
                <button className="bg-secondary-500 hover:bg-secondary-600 px-4 py-2 rounded-r-md transition-colors">
                  {t('footer.subscribe', 'Subscribe')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="border-t border-primary-700 mt-12 pt-8 text-center">
          <p className="text-primary-200">
            &copy; {currentYear} {t('app.name')}. {t('footer.copyright', 'All Rights Reserved.')}
          </p>
          
          {/* Payment Methods */}
          <div className="flex justify-center space-x-4 mt-4">
            {['visa', 'mastercard', 'paypal', 'apple-pay'].map(method => (
              <div key={method} className="text-primary-300 text-xs uppercase">
                {method}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
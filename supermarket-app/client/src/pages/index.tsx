import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layouts/MainLayout';

// Import components
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';

/**
 * Home page component
 */
const Home: React.FC = () => {
  return (
    <MainLayout>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
    </MainLayout>
  );
};

/**
 * Get static props for i18n
 */
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

export default Home; 
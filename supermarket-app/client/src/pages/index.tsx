import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layouts/MainLayout';
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import FeaturedProducts from '@/components/FeaturedProducts';

const Home: React.FC = () => {
  return (
    <MainLayout>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
    </MainLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

export default Home; 
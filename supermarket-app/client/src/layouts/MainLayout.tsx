import React, { ReactNode } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title,
  description,
}) => {
  const { t } = useTranslation('common');
  const { direction } = useSelector((state: RootState) => state.ui);

  return (
    <div className={`min-h-screen flex flex-col ${direction === 'rtl' ? 'font-arabic' : 'font-sans'}`} dir={direction}>
      <Head>
        <title>{title ? `${title} | ${t('app.name')}` : t('app.name')}</title>
        <meta name="description" content={description || t('app.slogan') || ""} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout; 
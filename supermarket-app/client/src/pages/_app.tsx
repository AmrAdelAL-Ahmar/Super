import React from 'react';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { appWithTranslation } from 'next-i18next';
import { ToastContainer } from 'react-toastify';
import { store } from '@/store';
import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Provider>
  );
}

export default appWithTranslation(MyApp); 
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import { store, RootState } from '@/store';
import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

// Create a wrapper component to use hooks with Redux
function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme, language } = useSelector((state: RootState) => state.ui);

  // Create theme based on current settings
  const muiTheme = createTheme({
    direction: language === 'ar' ? 'rtl' : 'ltr',
    palette: {
      mode: theme,
      primary: {
        main: '#1E8449', // Green color for the primary
        light: '#27AE60',
        dark: '#145A32',
        contrastText: '#fff',
      },
      secondary: {
        main: '#E67E22', // Orange color for the secondary
        light: '#F39C12',
        dark: '#D35400',
        contrastText: '#fff',
      },
    },
    typography: {
      fontFamily: language === 'ar' ? 
        '"Tajawal", "Roboto", "Helvetica", "Arial", sans-serif' : 
        '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
          },
        },
      },
    },
  });

  // Set document direction based on language
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
      <ToastContainer
        position={language === 'ar' ? 'top-left' : 'top-right'}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={language === 'ar'}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ThemeProvider>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeWrapper>
        <Component {...pageProps} />
      </ThemeWrapper>
    </Provider>
  );
}

export default appWithTranslation(MyApp); 
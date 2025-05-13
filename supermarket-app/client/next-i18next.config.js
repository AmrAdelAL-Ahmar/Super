module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    localeDetection: true,
  },
  localePath: './src/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}; 
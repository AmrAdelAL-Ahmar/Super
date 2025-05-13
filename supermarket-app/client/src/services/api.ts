import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store';

// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the state
      const token = (getState() as RootState).auth.token;
      
      // If we have a token, add it to the headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['User', 'Product', 'Order', 'Employee'],
  endpoints: () => ({}),
});

// Export hooks for usage in functional components
export const { } = apiSlice; 
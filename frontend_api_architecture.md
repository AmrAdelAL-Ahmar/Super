# مخطط Frontend للتطبيق توصيل السوبر ماركت باستخدام Redux Toolkit و RTK Query
# Frontend Architecture for Supermarket Delivery Application using Redux Toolkit and RTK Query

## هيكل المشروع | Project Structure

```
client/
├── public/                       # Static assets
│   ├── locales/                  # Translation files
│   ├── images/                   # Static images
│   └── icons/                    # Application icons
├── src/
│   ├── app/                      # Application setup
│   │   ├── store.ts              # Redux store configuration
│   │   ├── hooks.ts              # Custom React hooks
│   │   └── rootReducer.ts        # Root reducer
│   ├── components/               # Reusable UI components
│   │   ├── common/               # Common components
│   │   │   ├── Button/           # Button component
│   │   │   ├── Input/            # Input component
│   │   │   ├── Modal/            # Modal component
│   │   │   ├── Card/             # Card component
│   │   │   ├── Loader/           # Loading indicator
│   │   │   ├── Alert/            # Alert component
│   │   │   └── ...               # Other common components
│   │   ├── layout/               # Layout components
│   │   │   ├── Header/           # Header component
│   │   │   ├── Footer/           # Footer component
│   │   │   ├── Sidebar/          # Sidebar component
│   │   │   ├── Navbar/           # Navigation bar
│   │   │   └── ...               # Other layout components
│   │   ├── forms/                # Form components
│   │   │   ├── AuthForms/        # Authentication forms
│   │   │   ├── ProductForms/     # Product forms
│   │   │   ├── OrderForms/       # Order forms
│   │   │   └── ...               # Other form components
│   │   ├── pages/                # Page-specific components
│   │   │   ├── Home/             # Home page components
│   │   │   ├── Products/         # Product page components
│   │   │   ├── Cart/             # Cart page components
│   │   │   ├── Checkout/         # Checkout page components
│   │   │   ├── Dashboard/        # Dashboard components
│   │   │   └── ...               # Other page components
│   │   └── features/             # Feature-specific components
│   │       ├── auth/             # Authentication components
│   │       ├── products/         # Product components
│   │       ├── cart/             # Cart components
│   │       ├── orders/           # Order components
│   │       └── ...               # Other feature components
│   ├── features/                 # Redux Toolkit feature slices
│   │   ├── auth/                 # Authentication slice
│   │   │   ├── authSlice.ts      # Auth state management
│   │   │   └── authSelectors.ts  # Auth selectors
│   │   ├── products/             # Products slice
│   │   │   ├── productsSlice.ts  # Products state management
│   │   │   └── productsSelectors.ts # Products selectors
│   │   ├── cart/                 # Cart slice
│   │   │   ├── cartSlice.ts      # Cart state management
│   │   │   └── cartSelectors.ts  # Cart selectors
│   │   ├── orders/               # Orders slice
│   │   │   ├── ordersSlice.ts    # Orders state management
│   │   │   └── ordersSelectors.ts # Orders selectors
│   │   └── ...                   # Other feature slices
│   ├── services/                 # RTK Query API services
│   │   ├── authApi.ts            # Authentication API
│   │   ├── productsApi.ts        # Products API
│   │   ├── cartApi.ts            # Cart API
│   │   ├── ordersApi.ts          # Orders API
│   │   ├── usersApi.ts           # Users API
│   │   ├── addressesApi.ts       # Addresses API
│   │   ├── employeesApi.ts       # Employees API
│   │   ├── notificationsApi.ts   # Notifications API
│   │   └── baseApi.ts            # Base API configuration
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts            # Authentication hook
│   │   ├── useCart.ts            # Cart hook
│   │   ├── useProducts.ts        # Products hook
│   │   ├── useOrders.ts          # Orders hook
│   │   └── ...                   # Other custom hooks
│   ├── utils/                    # Utility functions
│   │   ├── formatters.ts         # Data formatting utilities
│   │   ├── validators.ts         # Validation utilities
│   │   ├── storage.ts            # Local storage utilities
│   │   ├── errorHandlers.ts      # Error handling utilities
│   │   └── ...                   # Other utility functions
│   ├── types/                    # TypeScript type definitions
│   │   ├── auth.types.ts         # Authentication types
│   │   ├── product.types.ts      # Product types
│   │   ├── cart.types.ts         # Cart types
│   │   ├── order.types.ts        # Order types
│   │   ├── user.types.ts         # User types
│   │   └── ...                   # Other type definitions
│   ├── styles/                   # Global styles
│   │   ├── global.css            # Global CSS
│   │   ├── variables.css         # CSS variables
│   │   ├── theme.ts              # Theme configuration
│   │   └── ...                   # Other style files
│   ├── config/                   # Application configuration
│   │   ├── i18n.ts               # Internationalization config
│   │   ├── routes.ts             # Route configuration
│   │   ├── constants.ts          # Application constants
│   │   └── ...                   # Other configuration files
│   ├── pages/                    # Next.js pages
│   │   ├── index.tsx             # Home page
│   │   ├── _app.tsx              # Application wrapper
│   │   ├── _document.tsx         # Document wrapper
│   │   ├── products/             # Product pages
│   │   ├── cart/                 # Cart pages
│   │   ├── checkout/             # Checkout pages
│   │   ├── auth/                 # Authentication pages
│   │   ├── dashboard/            # Dashboard pages
│   │   └── ...                   # Other pages
│   ├── middleware/               # Redux middleware
│   │   ├── api.ts                # API middleware
│   │   ├── logger.ts             # Logging middleware
│   │   └── ...                   # Other middleware
│   ├── contexts/                 # React contexts
│   │   ├── ThemeContext.tsx      # Theme context
│   │   ├── NotificationContext.tsx # Notification context
│   │   └── ...                   # Other contexts
│   ├── i18n/                     # Internationalization
│   │   ├── config.ts             # i18n configuration
│   │   ├── translations/         # Translation files
│   │   └── ...                   # Other i18n files
│   └── index.tsx                 # Application entry point
├── .eslintrc                     # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Package manifest
```

## التقنيات المستخدمة | Technologies Used

- **إطار العمل | Framework**: Next.js (React)
- **لغة البرمجة | Programming Language**: TypeScript
- **إدارة الحالة | State Management**: Redux Toolkit
- **واجهة API | API Interface**: RTK Query
- **التصميم | Styling**: 
  - Tailwind CSS
  - Material UI (for complex components)
  - Framer Motion (for animations)
- **تعدد اللغات | Internationalization**: i18next
- **التحقق من البيانات | Form Validation**: Formik + Yup
- **اختبار | Testing**: Jest + React Testing Library
- **خرائط | Maps**: Google Maps API React wrapper

## تنفيذ Redux Toolkit | Redux Toolkit Implementation

### 1. إعداد المتجر | Store Setup

```typescript
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '../services/baseApi';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import uiReducer from '../features/ui/uiSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    cart: cartReducer,
    ui: uiReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 2. Hooks المخصصة | Custom Hooks

```typescript
// src/app/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// استخدم هذه الـ hooks في التطبيق بدلاً من `useDispatch` و `useSelector` العادية
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### 3. مثال على Slice لإدارة المصادقة | Authentication Slice Example

```typescript
// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from '../../types/user.types';

interface AuthState {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthState['user']; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setAuthError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUserInfo: (
      state,
      action: PayloadAction<Partial<AuthState['user']>>
    ) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  setCredentials,
  logout,
  setAuthError,
  setLoading,
  updateUserInfo,
} = authSlice.actions;

export default authSlice.reducer;
```

### 4. مثال على Slice لسلة التسوق | Cart Slice Example

```typescript
// src/features/cart/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICartItem } from '../../types/cart.types';

interface CartState {
  items: ICartItem[];
  subtotal: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  isLoading: false,
  error: null,
};

const recalculateSubtotal = (items: ICartItem[]) => {
  return items.reduce((total, item) => total + item.totalPrice, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<ICartItem[]>) => {
      state.items = action.payload;
      state.subtotal = recalculateSubtotal(action.payload);
    },
    addCartItem: (state, action: PayloadAction<ICartItem>) => {
      const existingIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId
      );

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += action.payload.quantity;
        state.items[existingIndex].totalPrice += action.payload.totalPrice;
      } else {
        state.items.push(action.payload);
      }

      state.subtotal = recalculateSubtotal(state.items);
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);

      if (item) {
        const pricePerUnit = item.price;
        item.quantity = quantity;
        item.totalPrice = pricePerUnit * quantity;
        state.subtotal = recalculateSubtotal(state.items);
      }
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
      state.subtotal = recalculateSubtotal(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
    },
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCartItems,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  setCartLoading,
  setCartError,
} = cartSlice.actions;

export default cartSlice.reducer;
```

## تنفيذ RTK Query | RTK Query Implementation

### 1. إعداد Base API | Base API Setup

```typescript
// src/services/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../app/store';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      // احصل على التوكن من حالة المصادقة | Get the token from auth state
      const token = (getState() as RootState).auth.token;
      
      // إذا كان لدينا توكن، أضف إلى الهيدر | If we have a token, add it to the header
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // تعريف الأوسمة للتحكم في التخزين المؤقت والإلغاء | Define tags for cache invalidation
  tagTypes: [
    'User', 
    'Product', 
    'Cart', 
    'Order', 
    'Address', 
    'Category',
    'Employee',
    'Notification'
  ],
  endpoints: () => ({}),
});
```

### 2. مثال على خدمة RTK Query للمصادقة | Authentication API Service Example

```typescript
// src/services/authApi.ts
import { baseApi } from './baseApi';
import { setCredentials, logout } from '../features/auth/authSlice';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  token: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      // تخزين الاعتمادات بعد النجاح | Store credentials after success
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error) {
          // Handle error if needed
        }
      },
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      // تخزين الاعتمادات بعد النجاح | Store credentials after success
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error) {
          // Handle error if needed
        }
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      // تنفيذ تسجيل الخروج بغض النظر عن نجاح API | Perform logout regardless of API success
      async onQueryStarted(_, { dispatch }) {
        try {
          dispatch(logout());
        } catch (error) {
          // Handle error if needed
        }
      },
    }),
    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/auth/refresh-token',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error) {
          dispatch(logout());
        }
      },
    }),
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<
      { message: string },
      { token: string; password: string }
    >({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
```

## Conclusion

This frontend API architecture provides a comprehensive structure for integrating with the backend API while maintaining a clean and maintainable codebase. The architecture includes:

1. Redux Toolkit with RTK Query for efficient state management and API integration
2. TypeScript interfaces for type safety
3. Axios for HTTP requests with interceptors
4. Socket.io integration for real-time updates
5. Google Maps integration for location services
6. Modular service structure for better code organization
7. Proper error handling and loading states
8. Authentication and authorization flow
9. Cart management
10. Product management
11. Order management
12. User management
13. Delivery tracking
14. Address management

The architecture follows best practices and provides a solid foundation for building a scalable and maintainable frontend application. 
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

### 3. مثال على خدمة RTK Query للمنتجات | Product API Service Example

```typescript
// src/services/productsApi.ts
import { baseApi } from './baseApi';
import { IProduct, ICategory, IProductReview } from '../types/product.types';

// قسم مشترك للعرض والترتيب | Common section for pagination and sorting
interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface ProductsResponse {
  products: IProduct[];
  totalCount: number;
  pageCount: number;
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // الحصول على جميع المنتجات مع خيارات الترشيح | Get all products with filtering options
    getProducts: builder.query<ProductsResponse, QueryParams>({
      query: (params) => ({
        url: '/products',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({
                type: 'Product' as const,
                id: _id,
              })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    
    // الحصول على منتج واحد حسب المعرف | Get a single product by ID
    getProductById: builder.query<IProduct, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    
    // البحث عن منتجات | Search products
    searchProducts: builder.query<ProductsResponse, string>({
      query: (searchTerm) => ({
        url: '/products/search',
        method: 'GET',
        params: { search: searchTerm },
      }),
      providesTags: [{ type: 'Product', id: 'SEARCH' }],
    }),
    
    // الحصول على المنتجات حسب الفئة | Get products by category
    getProductsByCategory: builder.query<ProductsResponse, string>({
      query: (categoryId) => `/products/category/${categoryId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({
                type: 'Product' as const,
                id: _id,
              })),
              { type: 'Product', id: `CATEGORY-${result.products[0]?.categories[0]}` },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    
    // إضافة منتج جديد (للمالكين) | Add new product (for owners)
    addProduct: builder.mutation<IProduct, Partial<IProduct>>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    
    // تحديث منتج (للمالكين) | Update product (for owners)
    updateProduct: builder.mutation<
      IProduct,
      { id: string; product: Partial<IProduct> }
    >({
      query: ({ id, product }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),
    
    // حذف منتج (للمالكين) | Delete product (for owners)
    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),
    
    // الحصول على جميع الفئات | Get all categories
    getCategories: builder.query<ICategory[], void>({
      query: () => '/categories',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: 'Category' as const,
                id: _id,
              })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),
    
    // إضافة مراجعة للمنتج | Add product review
    addProductReview: builder.mutation<
      IProductReview,
      { productId: string; review: { rating: number; comment: string } }
    >({
      query: ({ productId, review }) => ({
        url: `/products/${productId}/reviews`,
        method: 'POST',
        body: review,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useSearchProductsQuery,
  useGetProductsByCategoryQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useAddProductReviewMutation,
} = productsApi;
```

## واجهات المستخدم | User Interface Components

### 1. مكونات التخطيط | Layout Components

#### مثال لمكون الهيدر | Header Component Example

```typescript
// src/components/layout/Header/Header.tsx
import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../app/hooks';
import { 
  useLogoutMutation 
} from '../../../services/authApi';
import { 
  selectIsAuthenticated, 
  selectUser 
} from '../../../features/auth/authSelectors';
import { 
  selectCartItemsCount 
} from '../../../features/cart/cartSelectors';
import ShoppingCartIcon from '../../icons/ShoppingCartIcon';
import LanguageSwitcher from '../../common/LanguageSwitcher';
import UserMenu from './UserMenu';
import Logo from '../../common/Logo';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const cartItemsCount = useAppSelector(selectCartItemsCount);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Logo />
        
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-800 hover:text-primary-600 transition">
            {t('nav.home')}
          </Link>
          <Link href="/products" className="text-gray-800 hover:text-primary-600 transition">
            {t('nav.products')}
          </Link>
          <Link href="/categories" className="text-gray-800 hover:text-primary-600 transition">
            {t('nav.categories')}
          </Link>
          <Link href="/about" className="text-gray-800 hover:text-primary-600 transition">
            {t('nav.about')}
          </Link>
          <Link href="/contact" className="text-gray-800 hover:text-primary-600 transition">
            {t('nav.contact')}
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          
          <Link href="/cart" className="text-gray-800 hover:text-primary-600 transition relative">
            <ShoppingCartIcon className="w-6 h-6" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <div className="flex space-x-2">
              <Link 
                href="/auth/login" 
                className="btn btn-outline-primary text-sm"
              >
                {t('auth.login')}
              </Link>
              <Link 
                href="/auth/register" 
                className="btn btn-primary text-sm"
              >
                {t('auth.register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
```

### 2. مكونات المصادقة | Authentication Components

#### مثال لنموذج تسجيل الدخول | Login Form Example

```typescript
// src/components/forms/AuthForms/LoginForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useLoginMutation } from '../../../services/authApi';
import TextField from '../../common/TextField';
import Button from '../../common/Button';
import Alert from '../../common/Alert';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const [login, { isLoading, error }] = useLoginMutation();

  const schema = yup.object({
    email: yup
      .string()
      .email(t('validation.email'))
      .required(t('validation.required')),
    password: yup.string().required(t('validation.required')),
  }).required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data).unwrap();
      // تم تسجيل الدخول بنجاح
    } catch (err) {
      // تم التعامل مع الخطأ في مكان آخر
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert 
          type="error" 
          message={'data' in error ? error.data?.message : t('errors.unknown')} 
        />
      )}
      
      <TextField
        label={t('auth.email')}
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      
      <TextField
        label={t('auth.password')}
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            {t('auth.rememberMe')}
          </label>
        </div>
        
        <div className="text-sm">
          <a href="/auth/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
            {t('auth.forgotPassword')}
          </a>
        </div>
      </div>
      
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        loading={isLoading}
      >
        {t('auth.login')}
      </Button>
    </form>
  );
};

export default LoginForm;
```

## استراتيجية الاتصال في الوقت الحقيقي | Real-time Communication Strategy

### 1. إعداد Socket.io | Socket.io Setup

```typescript
// src/services/socketService.ts
import { io, Socket } from 'socket.io-client';
import { store } from '../app/store';
import { 
  addNotification 
} from '../features/notifications/notificationsSlice';
import { 
  updateOrderStatus 
} from '../features/orders/ordersSlice';
import { 
  updateDeliveryLocation 
} from '../features/delivery/deliverySlice';

let socket: Socket | null = null;

export const initializeSocket = (token: string) => {
  if (socket) return;

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
    auth: {
      token,
    },
  });

  // إعداد المستمعين | Setup listeners
  setupSocketListeners(socket);

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

const setupSocketListeners = (socket: Socket) => {
  socket.on('connect', () => {
    console.log('Connected to websocket');
  });

  socket.on('notification', (notification) => {
    store.dispatch(addNotification(notification));
  });

  socket.on('order_status_update', (data) => {
    store.dispatch(updateOrderStatus(data));
  });

  socket.on('delivery_location_update', (data) => {
    store.dispatch(updateDeliveryLocation(data));
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from websocket');
  });
};

export const emitOrderStatusUpdate = (orderId: string, status: string) => {
  if (socket) {
    socket.emit('update_order_status', { orderId, status });
  }
};

export const emitDeliveryLocationUpdate = (
  orderId: string,
  location: { lat: number; lng: number }
) => {
  if (socket) {
    socket.emit('update_delivery_location', { orderId, location });
  }
};

export const joinOrderRoom = (orderId: string) => {
  if (socket) {
    socket.emit('join_order_room', { orderId });
  }
};

export const leaveOrderRoom = (orderId: string) => {
  if (socket) {
    socket.emit('leave_order_room', { orderId });
  }
};
```

## متطلبات النظام والمواصفات | System Requirements

### 1. متطلبات الجهاز | Device Requirements

- **المتصفح | Browser**: 
  - Chrome 70+
  - Firefox 63+
  - Safari 12+
  - Edge 79+
- **نظام التشغيل | Operating System**: 
  - Windows 10+
  - macOS 10.13+
  - iOS 12+
  - Android 8+
- **الشاشة | Screen**:
  - أقل حجم للجوال: 320px
  - أقل حجم للكمبيوتر: 768px

### 2. أداء الجانب الأمامي | Frontend Performance

- **وقت التحميل الأولي | Initial Load Time**: < 3 seconds
- **First Contentful Paint (FCP)**: < 1.8 seconds
- **Time to Interactive (TTI)**: < 5 seconds
- **حجم الكود المضغوط | Compressed Bundle Size**: < 300KB

## استراتيجية الاختبار | Testing Strategy

### 1. اختبارات الوحدة | Unit Tests

```typescript
// src/features/cart/cartSlice.test.ts
import cartReducer, {
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
  clearCart,
} from './cartSlice';

describe('cart reducer', () => {
  const initialState = {
    items: [],
    subtotal: 0,
    isLoading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addCartItem', () => {
    const actual = cartReducer(
      initialState,
      addCartItem({
        productId: '1',
        quantity: 2,
        price: 10,
        totalPrice: 20,
        addedAt: new Date(),
      })
    );
    expect(actual.items.length).toEqual(1);
    expect(actual.items[0].productId).toEqual('1');
    expect(actual.subtotal).toEqual(20);
  });

  it('should handle removeCartItem', () => {
    const state = {
      ...initialState,
      items: [
        {
          productId: '1',
          quantity: 2,
          price: 10,
          totalPrice: 20,
          addedAt: new Date(),
        },
      ],
      subtotal: 20,
    };
    const actual = cartReducer(state, removeCartItem('1'));
    expect(actual.items.length).toEqual(0);
    expect(actual.subtotal).toEqual(0);
  });

  it('should handle updateCartItemQuantity', () => {
    const state = {
      ...initialState,
      items: [
        {
          productId: '1',
          quantity: 2,
          price: 10,
          totalPrice: 20,
          addedAt: new Date(),
        },
      ],
      subtotal: 20,
    };
    const actual = cartReducer(
      state,
      updateCartItemQuantity({ productId: '1', quantity: 3 })
    );
    expect(actual.items[0].quantity).toEqual(3);
    expect(actual.items[0].totalPrice).toEqual(30);
    expect(actual.subtotal).toEqual(30);
  });

  it('should handle clearCart', () => {
    const state = {
      ...initialState,
      items: [
        {
          productId: '1',
          quantity: 2,
          price: 10,
          totalPrice: 20,
          addedAt: new Date(),
        },
      ],
      subtotal: 20,
    };
    const actual = cartReducer(state, clearCart());
    expect(actual.items.length).toEqual(0);
    expect(actual.subtotal).toEqual(0);
  });
});
```

## خطة التنفيذ المرحلية | Phased Implementation Plan

### المرحلة 1: الإعداد الأساسي | Phase 1: Basic Setup
- إعداد مشروع Next.js
- تكوين Redux Toolkit و RTK Query
- إعداد الأنماط الأساسية (Tailwind + Material UI)
- إعداد i18n للدعم متعدد اللغات

### المرحلة 2: الواجهات وخدمات API | Phase 2: Interfaces & API Services
- تعريف واجهات TypeScript
- تنفيذ خدمات RTK Query الأساسية
- إعداد المصادقة والتوثيق

### المرحلة 3: المكونات الأساسية | Phase 3: Core Components
- بناء مكونات التخطيط
- تطوير نماذج المصادقة
- إنشاء مكونات عرض المنتجات والتصفح

### المرحلة 4: وظائف التسوق | Phase 4: Shopping Features
- تنفيذ سلة التسوق
- بناء عملية الطلب
- نظام إدارة العناوين

### المرحلة 5: لوحات التحكم | Phase 5: Dashboards
- تطوير لوحة تحكم صاحب السوبر ماركت
- بناء واجهة موظف التوصيل
- إنشاء صفحات حساب المستخدم

### المرحلة 6: الوظائف المتقدمة | Phase 6: Advanced Features
- تنفيذ نظام الإشعارات
- دمج خدمات الخرائط للتتبع في الوقت الحقيقي
- تطوير وظائف البحث والتصفية المتقدمة

### المرحلة 7: الاختبار والتحسين | Phase 7: Testing & Optimization
- كتابة اختبارات الوحدة والتكامل
- تحسين الأداء
- ضمان توافق متعدد المتصفحات والأجهزة



# Frontend Architecture and API Integration Plan

## Project Structure

```
src/
├── api/                      # API Integration Layer
│   ├── base/                 # Base API Configuration
│   │   ├── apiClient.ts      # Axios instance and interceptors
│   │   ├── endpoints.ts      # API endpoints configuration
│   │   └── types.ts          # API types and interfaces
│   ├── services/             # API Services
│   │   ├── auth.service.ts   # Authentication API
│   │   ├── user.service.ts   # User management API
│   │   ├── product.service.ts # Product management API
│   │   ├── order.service.ts  # Order management API
│   │   ├── cart.service.ts   # Cart management API
│   │   └── delivery.service.ts # Delivery management API
│   └── index.ts              # API exports
├── store/                    # Redux Store Configuration
│   ├── index.ts              # Store configuration
│   ├── middleware/           # Custom middleware
│   │   ├── socket.middleware.ts # Socket.io middleware
│   │   └── logger.middleware.ts # Redux logger
│   └── rootReducer.ts        # Root reducer
├── features/                 # Feature-based Redux Slices
│   ├── auth/                 # Authentication Feature
│   │   ├── authSlice.ts      # Auth state management
│   │   ├── authApi.ts        # Auth RTK Query
│   │   └── types.ts          # Auth types
│   ├── user/                 # User Feature
│   │   ├── userSlice.ts      # User state management
│   │   ├── userApi.ts        # User RTK Query
│   │   └── types.ts          # User types
│   ├── product/              # Product Feature
│   │   ├── productSlice.ts   # Product state management
│   │   ├── productApi.ts     # Product RTK Query
│   │   └── types.ts          # Product types
│   ├── cart/                 # Cart Feature
│   │   ├── cartSlice.ts      # Cart state management
│   │   ├── cartApi.ts        # Cart RTK Query
│   │   └── types.ts          # Cart types
│   ├── order/                # Order Feature
│   │   ├── orderSlice.ts     # Order state management
│   │   ├── orderApi.ts       # Order RTK Query
│   │   └── types.ts          # Order types
│   └── delivery/             # Delivery Feature
│       ├── deliverySlice.ts  # Delivery state management
│       ├── deliveryApi.ts    # Delivery RTK Query
│       └── types.ts          # Delivery types
└── types/                    # Global TypeScript Types
    ├── api.types.ts          # API response types
    ├── store.types.ts        # Redux store types
    └── common.types.ts       # Common types
```

## API Integration Layer

## Base API Configuration

```typescript
// src/api/base/apiClient.ts
import axios from 'axios';
import { store } from '@/store';
import { logout } from '@/features/auth/authSlice';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### API Endpoints Configuration

```typescript
// src/api/base/endpoints.ts
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
  },
  
  // User endpoints
  USER: {
    PROFILE: '/users/me',
    UPDATE_PROFILE: '/users/me',
    CHANGE_PASSWORD: '/users/me/password',
  },
  
  // Product endpoints
  PRODUCT: {
    LIST: '/products',
    DETAILS: (id: string) => `/products/${id}`,
    SEARCH: '/products/search',
    CATEGORY: (id: string) => `/products/category/${id}`,
  },
  
  // Cart endpoints
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: (id: string) => `/cart/items/${id}`,
    REMOVE_ITEM: (id: string) => `/cart/items/${id}`,
    CLEAR: '/cart',
  },
  
  // Order endpoints
  ORDER: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAILS: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}`,
  },
  
  // Delivery endpoints
  DELIVERY: {
    ORDERS: '/delivery/orders',
    ORDER_DETAILS: (id: string) => `/delivery/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/delivery/orders/${id}/status`,
    UPDATE_LOCATION: (id: string) => `/delivery/orders/${id}/location`,
  },
};
```

## Redux Store Configuration

### Store Setup with RTK Query

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '@/features/auth/authApi';
import { userApi } from '@/features/user/userApi';
import { productApi } from '@/features/product/productApi';
import { cartApi } from '@/features/cart/cartApi';
import { orderApi } from '@/features/order/orderApi';
import { deliveryApi } from '@/features/delivery/deliveryApi';
import authReducer from '@/features/auth/authSlice';
import cartReducer from '@/features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [deliveryApi.reducerPath]: deliveryApi.reducer,
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      productApi.middleware,
      cartApi.middleware,
      orderApi.middleware,
      deliveryApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## Feature-based Redux Slices

### Authentication Feature

```typescript
// src/features/auth/authApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/api/base/apiClient';
import { API_ENDPOINTS } from '@/api/base/endpoints';
import { ILoginRequest, IRegisterRequest, IAuthResponse } from './types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<IAuthResponse, ILoginRequest>({
      query: (credentials) => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<IAuthResponse, IRegisterRequest>({
      query: (userData) => ({
        url: API_ENDPOINTS.AUTH.REGISTER,
        method: 'POST',
        body: userData,
      }),
    }),
    refreshToken: builder.mutation<IAuthResponse, string>({
      query: (refreshToken) => ({
        url: API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        method: 'POST',
        body: { refreshToken },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.LOGOUT,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
```

### Product Feature

```typescript
// src/features/product/productApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/api/base/apiClient';
import { API_ENDPOINTS } from '@/api/base/endpoints';
import { IProduct, IProductSearchParams } from './types';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery,
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query<IProduct[], IProductSearchParams>({
      query: (params) => ({
        url: API_ENDPOINTS.PRODUCT.LIST,
        method: 'GET',
        params,
      }),
      providesTags: ['Product'],
    }),
    getProductById: builder.query<IProduct, string>({
      query: (id) => ({
        url: API_ENDPOINTS.PRODUCT.DETAILS(id),
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    searchProducts: builder.query<IProduct[], string>({
      query: (query) => ({
        url: API_ENDPOINTS.PRODUCT.SEARCH,
        method: 'GET',
        params: { query },
      }),
    }),
    getProductsByCategory: builder.query<IProduct[], string>({
      query: (categoryId) => ({
        url: API_ENDPOINTS.PRODUCT.CATEGORY(categoryId),
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useSearchProductsQuery,
  useGetProductsByCategoryQuery,
} = productApi;
```

### Cart Feature

```typescript
// src/features/cart/cartApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/api/base/apiClient';
import { API_ENDPOINTS } from '@/api/base/endpoints';
import { ICart, ICartItem } from './types';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery,
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCart: builder.query<ICart, void>({
      query: () => ({
        url: API_ENDPOINTS.CART.GET,
        method: 'GET',
      }),
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<ICart, ICartItem>({
      query: (item) => ({
        url: API_ENDPOINTS.CART.ADD_ITEM,
        method: 'POST',
        body: item,
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<ICart, { id: string; quantity: number }>({
      query: ({ id, quantity }) => ({
        url: API_ENDPOINTS.CART.UPDATE_ITEM(id),
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation<ICart, string>({
      query: (id) => ({
        url: API_ENDPOINTS.CART.REMOVE_ITEM(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation<void, void>({
      query: () => ({
        url: API_ENDPOINTS.CART.CLEAR,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
```

## Real-time Communication

### Socket.io Integration

```typescript
// src/api/services/socket.service.ts
import { io, Socket } from 'socket.io-client';
import { store } from '@/store';
import { updateOrderStatus } from '@/features/order/orderSlice';
import { updateDeliveryLocation } from '@/features/delivery/deliverySlice';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    const token = store.getState().auth.token;
    
    this.socket = io(process.env.REACT_APP_SOCKET_URL!, {
      auth: { token },
    });

    this.setupListeners();
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('order:status:updated', (data) => {
      store.dispatch(updateOrderStatus(data));
    });

    this.socket.on('delivery:location:updated', (data) => {
      store.dispatch(updateDeliveryLocation(data));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
```

## Type Definitions

### API Types

```typescript
// src/types/api.types.ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

### Store Types

```typescript
// src/types/store.types.ts
import { store } from '@/store';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface ThunkApiConfig {
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
}
```

## Usage Examples

### Authentication Flow

```typescript
// Example component using auth hooks
import { useLoginMutation } from '@/features/auth/authApi';

const LoginComponent = () => {
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (credentials: ILoginRequest) => {
    try {
      const response = await login(credentials).unwrap();
      // Handle successful login
    } catch (error) {
      // Handle error
    }
  };

  return (
    // Component JSX
  );
};
```

### Product Management

```typescript
// Example component using product hooks
import { useGetProductsQuery, useGetProductByIdQuery } from '@/features/product/productApi';

const ProductList = () => {
  const { data: products, isLoading } = useGetProductsQuery({
    page: 1,
    limit: 10,
  });

  return (
    // Component JSX
  );
};
```

### Cart Management

```typescript
// Example component using cart hooks
import { useGetCartQuery, useAddToCartMutation } from '@/features/cart/cartApi';

const CartComponent = () => {
  const { data: cart } = useGetCartQuery();
  const [addToCart] = useAddToCartMutation();

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart({ productId, quantity: 1 }).unwrap();
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    // Component JSX
  );
};
```

## Best Practices

1. **API Layer Organization**
   - Keep API calls centralized in the services directory
   - Use RTK Query for data fetching and caching
   - Implement proper error handling and loading states

2. **State Management**
   - Use Redux Toolkit for global state management
   - Implement feature-based slices for better organization
   - Use RTK Query for server state management

3. **Type Safety**
   - Define proper TypeScript interfaces for all API responses
   - Use strict type checking for all API calls
   - Implement proper error types

4. **Real-time Updates**
   - Use Socket.io for real-time features
   - Implement proper reconnection logic
   - Handle offline/online states

5. **Performance**
   - Implement proper caching strategies
   - Use RTK Query's built-in caching
   - Optimize re-renders with proper selectors

6. **Security**
   - Implement proper token management
   - Handle token refresh logic
   - Secure WebSocket connections

## Conclusion

This frontend architecture provides a robust foundation for building the supermarket delivery application. By using Redux Toolkit and RTK Query, we ensure efficient state management and data fetching. The feature-based organization makes the codebase maintainable and scalable.

The integration with the backend API is seamless, and the real-time features are properly handled through Socket.io. The type system ensures type safety throughout the application, making it more reliable and easier to maintain. 
### هيكل المشروع | Project Structure

```
src/
├── api/                           # RTK Query API slices
│   ├── auth.api.ts               # Authentication API
│   ├── user.api.ts               # User management API
│   ├── product.api.ts            # Product management API
│   ├── order.api.ts              # Order management API
│   ├── cart.api.ts               # Cart management API
│   ├── address.api.ts            # Address management API
│   ├── payment.api.ts            # Payment API
│   └── notification.api.ts       # Notification API
├── store/                        # Redux store configuration
│   ├── index.ts                  # Store configuration
│   ├── rootReducer.ts            # Root reducer
│   └── middleware.ts             # Custom middleware
├── features/                     # Feature-based modules
│   ├── auth/                     # Authentication feature
│   │   ├── authSlice.ts         # Auth state management
│   │   ├── components/          # Auth components
│   │   └── hooks/               # Auth hooks
│   ├── products/                 # Products feature
│   │   ├── productSlice.ts      # Product state management
│   │   ├── components/          # Product components
│   │   └── hooks/               # Product hooks
│   ├── cart/                     # Cart feature
│   │   ├── cartSlice.ts         # Cart state management
│   │   ├── components/          # Cart components
│   │   └── hooks/               # Cart hooks
│   └── orders/                   # Orders feature
│       ├── orderSlice.ts        # Order state management
│       ├── components/          # Order components
│       └── hooks/               # Order hooks
├── interfaces/                   # TypeScript interfaces
│   ├── auth.interface.ts        # Auth interfaces
│   ├── user.interface.ts        # User interfaces
│   ├── product.interface.ts     # Product interfaces
│   ├── order.interface.ts       # Order interfaces
│   ├── cart.interface.ts        # Cart interfaces
│   ├── address.interface.ts     # Address interfaces
│   ├── payment.interface.ts     # Payment interfaces
│   └── notification.interface.ts # Notification interfaces
└── utils/                       # Utility functions
    ├── api.ts                   # API configuration
    ├── storage.ts               # Local storage utilities
    └── validation.ts            # Form validation utilities
```

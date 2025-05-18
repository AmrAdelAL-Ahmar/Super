# مخطط Frontend وتصميم API لتطبيق توصيل السوبر ماركت
# Frontend Architecture and API Design for Supermarket Delivery Application

## هيكل المشروع | Project Structure

```
src/
├── app/
│   ├── store.ts                    # Redux store configuration
│   └── hooks.ts                    # Custom hooks
├── features/                       # Feature-based modules
│   ├── auth/                       # Authentication feature
│   │   ├── authApi.ts             # RTK Query API for auth
│   │   ├── authSlice.ts           # Auth state management
│   │   └── components/            # Auth-related components
│   ├── products/                   # Products feature
│   │   ├── productsApi.ts         # RTK Query API for products
│   │   ├── productsSlice.ts       # Products state management
│   │   └── components/            # Product-related components
│   ├── cart/                       # Cart feature
│   │   ├── cartApi.ts             # RTK Query API for cart
│   │   ├── cartSlice.ts           # Cart state management
│   │   └── components/            # Cart-related components
│   ├── orders/                     # Orders feature
│   │   ├── ordersApi.ts           # RTK Query API for orders
│   │   ├── ordersSlice.ts         # Orders state management
│   │   └── components/            # Order-related components
│   └── delivery/                   # Delivery feature
│       ├── deliveryApi.ts         # RTK Query API for delivery
│       ├── deliverySlice.ts       # Delivery state management
│       └── components/            # Delivery-related components
├── services/                       # API services
│   ├── api.ts                      # Base API configuration
│   ├── socket.ts                   # Socket.io service
│   └── maps.ts                     # Maps service
├── interfaces/                     # TypeScript interfaces
│   ├── auth.interface.ts          # Auth interfaces
│   ├── product.interface.ts       # Product interfaces
│   ├── order.interface.ts         # Order interfaces
│   └── user.interface.ts          # User interfaces
├── utils/                          # Utility functions
│   ├── auth.utils.ts              # Auth utilities
│   ├── validation.utils.ts        # Validation utilities
│   └── formatters.utils.ts        # Data formatting utilities
└── components/                     # Shared components
    ├── common/                     # Common UI components
    ├── layout/                     # Layout components
    └── forms/                      # Form components
```

## واجهات API | API Interfaces

### 1. واجهة المصادقة | Authentication Interface

```typescript
// src/interfaces/auth.interface.ts
export interface IAuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface IAuthResponse {
  user: IUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}
```

### 2. واجهة المنتجات | Products Interface

```typescript
// src/interfaces/product.interface.ts
export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  mainImage: string;
  categories: string[];
  stockQuantity: number;
  isAvailable: boolean;
  isDiscounted: boolean;
  discountPercentage?: number;
  averageRating: number;
  totalReviews: number;
}

export interface IProductSearchParams {
  query?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onSale?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popularity';
  page?: number;
  limit?: number;
}
```

### 3. واجهة السلة | Cart Interface

```typescript
// src/interfaces/cart.interface.ts
export interface ICartItem {
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface ICart {
  items: ICartItem[];
  subtotal: number;
  estimatedTax?: number;
  estimatedShipping?: number;
  total: number;
}
```

### 4. واجهة الطلبات | Orders Interface

```typescript
// src/interfaces/order.interface.ts
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY_FOR_DELIVERY = 'ready_for_delivery',
  ASSIGNED_TO_DELIVERY = 'assigned_to_delivery',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELED = 'canceled'
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  items: ICartItem[];
  status: OrderStatus;
  total: number;
  deliveryAddress: IAddress;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## RTK Query APIs

### 1. Auth API

```typescript
// src/features/auth/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ILoginRequest, IRegisterRequest, IAuthResponse } from '../../interfaces/auth.interface';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/auth',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<IAuthResponse, ILoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<IAuthResponse, IRegisterRequest>({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
    }),
    refreshToken: builder.mutation<IAuthResponse, string>({
      query: (refreshToken) => ({
        url: '/refresh-token',
        method: 'POST',
        body: { refreshToken },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
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

### 2. Products API

```typescript
// src/features/products/productsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IProduct, IProductSearchParams } from '../../interfaces/product.interface';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/products',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query<{ data: IProduct[]; total: number }, IProductSearchParams>({
      query: (params) => ({
        url: '/',
        method: 'GET',
        params,
      }),
      providesTags: ['Product'],
    }),
    getProductById: builder.query<IProduct, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation<IProduct, Partial<IProduct>>({
      query: (product) => ({
        url: '/',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<IProduct, { id: string; product: Partial<IProduct> }>({
      query: ({ id, product }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
```

### 3. Cart API

```typescript
// src/features/cart/cartApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ICart, ICartItem } from '../../interfaces/cart.interface';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/cart',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCart: builder.query<ICart, void>({
      query: () => '/',
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<ICart, { productId: string; quantity: number }>({
      query: (item) => ({
        url: '/items',
        method: 'POST',
        body: item,
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<ICart, { productId: string; quantity: number }>({
      query: ({ productId, quantity }) => ({
        url: `/items/${productId}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation<ICart, string>({
      query: (productId) => ({
        url: `/items/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation<void, void>({
      query: () => ({
        url: '/',
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

### 4. Orders API

```typescript
// src/features/orders/ordersApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IOrder } from '../../interfaces/order.interface';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/orders',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    getOrders: builder.query<IOrder[], void>({
      query: () => '/',
      providesTags: ['Order'],
    }),
    getOrderById: builder.query<IOrder, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    createOrder: builder.mutation<IOrder, { deliveryAddressId: string; paymentMethod: string }>({
      query: (orderData) => ({
        url: '/',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order', 'Cart'],
    }),
    cancelOrder: builder.mutation<IOrder, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation<IOrder, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
  useUpdateOrderStatusMutation,
} = ordersApi;
```

## Redux Store Configuration

```typescript
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '../features/auth/authApi';
import { productsApi } from '../features/products/productsApi';
import { cartApi } from '../features/cart/cartApi';
import { ordersApi } from '../features/orders/ordersApi';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productsApi.middleware,
      cartApi.middleware,
      ordersApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## Custom Hooks

```typescript
// src/app/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## Socket.io Integration

```typescript
// src/services/socket.ts
import { io, Socket } from 'socket.io-client';
import { store } from '../app/store';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    const token = store.getState().auth.token;
    if (!token) return;

    this.socket = io(process.env.REACT_APP_SOCKET_URL || '', {
      auth: { token },
    });

    this.setupListeners();
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('order:status:updated', (data) => {
      // Handle order status updates
    });

    this.socket.on('delivery:location:updated', (data) => {
      // Handle delivery location updates
    });

    this.socket.on('notification:created', (data) => {
      // Handle new notifications
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

## Maps Service Integration

```typescript
// src/services/maps.ts
import { GoogleMap, Loader } from '@googlemaps/js-api-loader';

class MapsService {
  private map: GoogleMap | null = null;
  private loader: Loader;

  constructor() {
    this.loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
    });
  }

  async initializeMap(element: HTMLElement, options: google.maps.MapOptions) {
    const google = await this.loader.load();
    this.map = new google.maps.Map(element, options);
    return this.map;
  }

  async geocodeAddress(address: string) {
    const google = await this.loader.load();
    const geocoder = new google.maps.Geocoder();
    
    return new Promise<google.maps.GeocoderResult>((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results) {
          resolve(results[0]);
        } else {
          reject(new Error('Geocoding failed'));
        }
      });
    });
  }

  calculateDistance(origin: google.maps.LatLng, destination: google.maps.LatLng) {
    const service = new google.maps.DistanceMatrixService();
    
    return new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === 'OK' && response) {
            resolve(response);
          } else {
            reject(new Error('Distance calculation failed'));
          }
        }
      );
    });
  }
}

export const mapsService = new MapsService();
```

## خاتمة | Conclusion

يوفر هذا المخطط هيكلاً متكاملاً لتطوير واجهة المستخدم لتطبيق توصيل السوبر ماركت باستخدام Redux Toolkit و RTK Query. يتم تنظيم الكود بشكل منطقي حسب الميزات، مع فصل واضح للمسؤوليات بين المكونات والخدمات.

المميزات الرئيسية:
1. إدارة حالة مركزية باستخدام Redux Toolkit
2. إدارة طلبات API فعالة باستخدام RTK Query
3. تكامل Socket.io للاتصال في الوقت الحقيقي
4. تكامل خرائط Google للخدمات الجغرافية
5. هيكل مشروع قابل للتوسع والصيانة
6. دعم كامل للغة العربية والإنجليزية

This architecture provides a comprehensive structure for developing the frontend of the Supermarket Delivery Application using Redux Toolkit and RTK Query. The code is organized logically by features, with clear separation of concerns between components and services.

Key features:
1. Centralized state management using Redux Toolkit
2. Efficient API request management using RTK Query
3. Socket.io integration for real-time communication
4. Google Maps integration for geolocation services
5. Scalable and maintainable project structure
6. Full support for Arabic and English languages 
## هيكل المشروع | Project Structure

```
src/
├── api/                          # RTK Query API endpoints
│   ├── auth.api.ts              # Authentication API
│   ├── user.api.ts              # User management API
│   ├── product.api.ts           # Product management API
│   ├── order.api.ts             # Order management API
│   ├── cart.api.ts              # Cart management API
│   ├── address.api.ts           # Address management API
│   ├── payment.api.ts           # Payment API
│   └── notification.api.ts      # Notification API
├── store/                       # Redux store configuration
│   ├── index.ts                 # Store configuration
│   ├── slices/                  # Redux slices
│   │   ├── auth.slice.ts        # Authentication slice
│   │   ├── cart.slice.ts        # Cart slice
│   │   ├── ui.slice.ts          # UI state slice
│   │   └── notification.slice.ts # Notification slice
│   └── middleware/              # Custom middleware
│       ├── socket.middleware.ts  # Socket.io middleware
│       └── auth.middleware.ts    # Authentication middleware
├── services/                    # Service layer
│   ├── socket.service.ts        # Socket.io service
│   ├── maps.service.ts          # Google Maps service
│   └── storage.service.ts       # Local storage service
├── hooks/                       # Custom hooks
│   ├── useAuth.ts              # Authentication hook
│   ├── useCart.ts              # Cart hook
│   ├── useSocket.ts            # Socket.io hook
│   └── useMaps.ts              # Maps hook
├── types/                       # TypeScript types
│   ├── api.types.ts            # API types
│   ├── models.types.ts         # Model types
│   └── store.types.ts          # Store types
└── utils/                       # Utility functions
    ├── api.utils.ts            # API utilities
    ├── validation.utils.ts     # Validation utilities
    └── formatters.utils.ts     # Data formatters
```

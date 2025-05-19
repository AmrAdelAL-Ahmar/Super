# Front-end Architecture Plan for Supermarket Delivery Application

## Table of Contents
- [Introduction](#introduction)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Routing & Navigation](#routing--navigation)
- [Authentication & Authorization](#authentication--authorization)
- [Internationalization](#internationalization)
- [UI/UX Design System](#uiux-design-system)
- [Maps & Location Services](#maps--location-services)
- [Performance Optimization](#performance-optimization)
- [Testing Strategy](#testing-strategy)
- [Deployment Strategy](#deployment-strategy)
- [Development Workflow](#development-workflow)
- [Security Best Practices](#security-best-practices)
- [Implementation Phases](#implementation-phases)

## Introduction

This document outlines the architecture and implementation plan for the front-end of the Supermarket Delivery Application. The front-end will be designed to provide a seamless user experience while adhering to modern best practices for code quality, reusability, security, and performance.

## Technology Stack

### Core Technologies
- **Framework**: Next.js 14+ with TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS with a custom design system
- **Form Handling**: React Hook Form + Zod validation
- **API Client**: Axios with interceptors
- **Real-time Communication**: Socket.io client
- **Testing**: Jest, React Testing Library, and Playwright

### UI Libraries
- **Component Library**: Shadcn UI (lightweight components built on Radix UI)
- **Data Visualization**: Chart.js / D3.js
- **Maps Integration**: Google Maps API with @react-google-maps/api
- **Icons**: Lucide React
- **تعدد اللغات | Internationalization**: i18next

- **Animations**: Framer Motion

### Development Tools
- **Linting**: ESLint with TypeScript support
- **Code Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged
- **Documentation**: Storybook for component documentation

## Project Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── (auth)/          # Auth related routes
│   │   │   ├── login/       # Login page
│   │   │   └── register/    # Register page
│   │   ├── (customer)/      # Customer routes
│   │   │   ├── products/    # Product listings
│   │   │   ├── cart/        # Shopping cart
│   │   │   └── checkout/    # Checkout flow
│   │   ├── (owner)/         # Store owner routes
│   │   │   ├── dashboard/   # Owner dashboard
│   │   │   └── ...          # Other owner pages
│   │   ├── (delivery)/      # Delivery employee routes 
│   │   ├── api/             # API routes
│   │   └── layout.tsx       # Root layout
│   ├── assets/              # Images, fonts, etc.
│   ├── components/          # Reusable components
│   │   ├── common/          # Generic UI components
│   │   ├── forms/           # Form components
│   │   ├── layout/          # Layout components
│   │   └── [feature]/       # Feature-specific components
│   ├── features/            # Feature modules
│   │   ├── auth/            # Authentication feature
│   │   │   ├── api/         # API services
│   │   │   ├── components/  # Feature components
│   │   │   ├── hooks/       # Custom hooks
│   │   │   ├── store/       # State management
│   │   │   ├── types/       # TypeScript interfaces
│   │   │   └── utils/       # Feature utilities
│   │   ├── products/        # Product management feature
│   │   ├── cart/            # Shopping cart feature
│   │   ├── checkout/        # Checkout process feature
│   │   ├── orders/          # Order management feature
│   │   ├── maps/            # Maps and location services
│   │   └── ...              # Other features
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Library abstractions
│   │   ├── api.ts           # API client setup
│   │   ├── socket.ts        # Socket.io client
│   │   ├── maps.ts          # Google Maps client
│   │   └── storage.ts       # Local storage utilities
│   ├── store/               # Global state management
│   │   ├── slices/          # Redux slices
│   │   └── api/             # RTK Query API slices
│   ├── styles/              # Global styles
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   │   ├── formatters.ts    # Data formatters
│   │   ├── validators.ts    # Input validators
│   │   └── helpers.ts       # Helper functions
│   ├── middleware.ts        # Next.js middleware for auth
│   └── i18n/                # Internationalization
├── .eslintrc.js             # ESLint configuration
├── .prettierrc              # Prettier configuration
├── tsconfig.json            # TypeScript configuration
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

## Component Architecture

### Component Hierarchy
The application will follow a hierarchical component structure:

1. **App Shell**
   - Header (with navigation and user menu)
   - Main Content Area
   - Footer

2. **Layout Components**
   - Page layouts (standard, full-width, dashboard)
   - Containers and grids
   - Navigation components (menus, breadcrumbs)

3. **Feature Components**
   - Feature-specific components organized by domain

4. **Common Components**
   - Buttons, inputs, cards, modals, etc.
   - Data display components (tables, lists)
   - Feedback components (alerts, toasts)

### Component Design Principles

1. **Composition over Inheritance**
   - Build complex components by composing smaller ones
   - Use render props and component injection where appropriate

2. **Container vs Presentational Pattern**
   - Separate business logic from presentation
   - Create "dumb" UI components that receive data via props

3. **Component API Design**
   - Consistent prop naming conventions
   - Sensible defaults and prop validation
   - Forward refs for custom components

4. **Reusability**
   - Extract common patterns into reusable hooks and components
   - Use React Context for theme and configuration

## State Management

### Redux Store Structure

```
store/
├── index.ts                # Store setup and configuration
├── middleware.ts           # Custom middleware
├── slices/                 # Redux slices
│   ├── authSlice.ts        # Authentication state
│   ├── cartSlice.ts        # Shopping cart state
│   ├── uiSlice.ts          # UI state (modals, toasts, etc.)
│   ├── mapSlice.ts         # Map state (markers, location, etc.)
│   └── ...                 # Other global state slices
└── api/                    # RTK Query API definitions
    ├── baseApi.ts          # Base API configuration
    ├── authApi.ts          # Auth endpoints
    ├── productsApi.ts      # Product endpoints
    ├── ordersApi.ts        # Order endpoints
    └── ...                 # Other API slices
```

### State Management Principles

1. **Global vs Local State**
   - Use Redux for global application state
   - Use local component state for UI-specific state
   - Use React Context for theme and feature-level shared state

2. **RTK Query for Data Fetching**
   - Manage server state with RTK Query
   - Use automatic caching and invalidation
   - Define reusable endpoints with transformations

3. **Immutability**
   - Ensure all state updates are immutable
   - Use Redux Toolkit's `createSlice` for immutable updates

4. **Selectors**
   - Use memoized selectors with `createSelector`
   - Keep components decoupled from state shape

## API Integration

### API Client Configuration

```typescript
// src/lib/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuthToken, refreshToken, logout } from '@/features/auth/store';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshToken();
        return api(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### RTK Query Services

```typescript
// src/store/api/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Products', 'Orders', 'User', 'Cart', 'Categories', 'Addresses'],
  endpoints: () => ({}),
});
```

### WebSocket Integration

```typescript
// src/lib/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (token: string): Socket => {
  if (socket) socket.disconnect();
  
  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  // Setup event listeners
  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', (reason) => {
    console.log(`Socket disconnected: ${reason}`);
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
```

## Routing & Navigation

### Next.js App Router

Next.js 14+ App Router will be used for routing with the following structure:

```
app/
├── (auth)/                  # Auth group
│   ├── login/               # /login
│   │   └── page.tsx
│   └── register/            # /register
│       └── page.tsx
├── (customer)/              # Customer group
│   ├── products/            # /products
│   │   ├── [id]/            # /products/[id]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   └── cart/                # /cart
│       └── page.tsx
├── (owner)/                 # Owner group (protected)
│   ├── dashboard/           # /dashboard
│   │   └── page.tsx
│   └── layout.tsx           # Owner layout with auth check
├── (delivery)/              # Delivery group (protected)
│   ├── orders/              # /delivery/orders
│   │   └── page.tsx
│   └── layout.tsx           # Delivery layout with auth check
└── layout.tsx               # Root layout
```

### Navigation Components

- Create consistent navigation components for main menu and breadcrumbs
- Implement mobile-friendly responsive navigation patterns
- Use Next.js Link component for client-side navigation

## Authentication & Authorization

### Authentication Flow

1. **Login/Register**:
   - Implement secure login/register forms with validation
   - Store JWT tokens securely (HTTP-only cookies where possible)
   - Handle token refresh automatically

2. **Protected Routes**:
   - Create middleware for authenticated and role-based access
   - Redirect unauthenticated users to login

3. **User Context**:
   - Provide user information throughout the app via context
   - Handle authentication state in Redux

### Authorization

- Implement role-based UI rendering
- Secure routes with Next.js middleware for role checks
- Hide/show UI elements based on permissions

## Internationalization

- Use i18next for translations \ react-i18next
- Support Arabic and English languages
- Right-to-left (RTL) layout support
- Format numbers, dates, and currencies based on locale

## UI/UX Design System

### Design Tokens

```typescript
// src/styles/theme.ts
export const theme = {
  colors: {
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    // ... other color scales
    
    gray: {
      50: '#f9fafb',
      // ... other shades
      900: '#111827',
    },
    
    // Status colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  
  spacing: {
    // ... spacing scale
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  
  shadows: {
    // ... shadow definitions
  },
};
```

### Component Library

- Build a consistent component library based on design tokens
- Document components in Storybook
- Implement accessibility features for all components
- Include common UI patterns (cards, lists, tables, forms, modals)
- Create skeletons for loading states

## Maps & Location Services

### Google Maps Integration

```typescript
// src/lib/maps.ts
import { LoadScript } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  console.error('Google Maps API key is not defined in environment variables');
}

export const libraries = ['places', 'geometry', 'drawing'];

export const MapProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY || ''}
      libraries={libraries as any}
      loadingElement={<div className="h-full w-full bg-gray-100 animate-pulse" />}
    >
      {children}
    </LoadScript>
  );
};

// Geocoding helper
export const geocodeAddress = async (address: string): Promise<google.maps.LatLngLiteral | null> => {
  if (!window.google) return null;
  
  const geocoder = new google.maps.Geocoder();
  
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        resolve({ lat: location.lat(), lng: location.lng() });
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
};

// Calculate distance between two points
export const calculateDistance = (
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral
): Promise<number> => {
  if (!window.google) return Promise.resolve(0);
  
  const service = new google.maps.DistanceMatrixService();
  
  return new Promise((resolve, reject) => {
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === 'OK' && response) {
          const distance = response.rows[0].elements[0].distance.value; // in meters
          resolve(distance);
        } else {
          reject(new Error(`Distance calculation failed: ${status}`));
        }
      }
    );
  });
};
```

### Map Components

```typescript
// src/components/maps/DeliveryMap.tsx
import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedOrder, updateDeliveryLocation } from '@/store/slices/mapSlice';
import { RootState } from '@/store';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
};

interface DeliveryMapProps {
  deliveryOrders: Array<{
    id: string;
    orderNumber: string;
    customerLocation: { lat: number; lng: number };
    status: string;
  }>;
  currentLocation: { lat: number; lng: number };
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({ 
  deliveryOrders, 
  currentLocation 
}) => {
  const dispatch = useDispatch();
  const { selectedOrder } = useSelector((state: RootState) => state.map);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  
  const onMapClick = useCallback(() => {
    dispatch(setSelectedOrder(null));
  }, [dispatch]);
  
  const onMarkerClick = useCallback((orderId: string) => {
    dispatch(setSelectedOrder(orderId));
  }, [dispatch]);
  
  // Calculate directions when an order is selected
  useEffect(() => {
    if (selectedOrder && window.google) {
      const selectedOrderData = deliveryOrders.find(order => order.id === selectedOrder);
      
      if (selectedOrderData) {
        const directionsService = new google.maps.DirectionsService();
        
        directionsService.route(
          {
            origin: currentLocation,
            destination: selectedOrderData.customerLocation,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              setDirections(result);
            } else {
              console.error(`Directions request failed: ${status}`);
            }
          }
        );
      }
    } else {
      setDirections(null);
    }
  }, [selectedOrder, deliveryOrders, currentLocation]);
  
  // Update current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          dispatch(updateDeliveryLocation(newLocation));
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );
      
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [dispatch]);
  
  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={currentLocation}
      zoom={13}
      options={options}
      onClick={onMapClick}
    >
      {/* Current location marker */}
      <Marker
        position={currentLocation}
        icon={{
          url: '/images/delivery-icon.svg',
          scaledSize: new google.maps.Size(40, 40),
        }}
      />
      
      {/* Order markers */}
      {deliveryOrders.map((order) => (
        <Marker
          key={order.id}
          position={order.customerLocation}
          onClick={() => onMarkerClick(order.id)}
          icon={{
            url: order.status === 'out_for_delivery' 
              ? '/images/active-order-icon.svg' 
              : '/images/order-icon.svg',
            scaledSize: new google.maps.Size(30, 30),
          }}
        />
      ))}
      
      {/* Selected order info window */}
      {selectedOrder && (
        <InfoWindow
          position={deliveryOrders.find(o => o.id === selectedOrder)?.customerLocation}
          onCloseClick={() => dispatch(setSelectedOrder(null))}
        >
          <div className="p-2">
            <h3 className="font-bold">Order #{deliveryOrders.find(o => o.id === selectedOrder)?.orderNumber}</h3>
            <p>Status: {deliveryOrders.find(o => o.id === selectedOrder)?.status}</p>
            <button className="mt-2 bg-primary-500 text-white px-3 py-1 rounded-md">
              Navigate
            </button>
          </div>
        </InfoWindow>
      )}
      
      {/* Directions */}
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            polylineOptions: {
              strokeColor: '#22c55e',
              strokeWeight: 5,
            },
          }}
        />
      )}
    </GoogleMap>
  );
};
```

### Location Tracking

- Implement real-time delivery tracking with Socket.io
- Store delivery agent locations in the database
- Update customer UI in real-time with driver's position
- Calculate estimated arrival times based on traffic and distance

## Performance Optimization

### Strategies

1. **Next.js Optimizations**:
   - Server components for improved initial load
   - Automatic image optimization
   - Incremental Static Regeneration (ISR) for product pages
   - Route prefetching

2. **Lazy Loading**:
   - Use dynamic imports for client components
   - Implement lazy loading for images with Next.js Image
   - Use intersection observer for better UX

3. **Memoization**:
   - Use React.memo, useMemo, and useCallback for expensive operations
   - Optimize rerenders with selective memoization

4. **Bundle Optimization**:
   - Next.js built-in code splitting
   - Tree shaking
   - Compression

5. **Image Optimization**:
   - Use Next.js Image component with WebP/AVIF formats
   - Responsive images
   - Image compression

6. **Caching Strategy**:
   - Implement service workers for offline support
   - Cache API responses with proper invalidation
   - Persist Redux store with selective persistence

## Testing Strategy

### Test Types

1. **Unit Tests**:
   - Test components in isolation
   - Test Redux reducers, actions, and selectors
   - Test utility functions

2. **Integration Tests**:
   - Test component interactions
   - Test form submissions and validations
   - Test API integration

3. **E2E Tests**:
   - Test user flows
   - Test critical paths (checkout, registration)
   - Test maps and location features

### Test Tools

- **Jest**: Unit testing
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **MSW**: API mocking

## Deployment Strategy

### CI/CD Pipeline

- **Automated Testing**: Run tests on every PR
- **Build and Preview**: Generate preview deployments for PRs with Vercel
- **Production Deployment**: Deploy to production on merge to main

### Environments

- **Development**: Local development environment
- **Staging**: Testing environment with staging API
- **Production**: Production environment

### Deployment Options

- **Vercel**: Primary deployment platform for Next.js
- **Containerization**: Docker for more complex setups
- **Self-hosted**: Option for production environments with specific requirements

## Development Workflow

### Branching Strategy

- **Main Branch**: Production-ready code
- **Develop Branch**: Integration branch
- **Feature Branches**: For new features
- **Release Branches**: For release preparation
- **Hotfix Branches**: For urgent fixes

### Code Review Process

- Pull request templates
- Code review checklist
- Automated PR checks (linting, tests)

## Security Best Practices

### Client-Side Security

1. **Input Validation**:
   - Validate all user inputs with Zod
   - Sanitize data for XSS prevention

2. **Authentication**:
   - Secure token storage in HTTP-only cookies
   - Token expiration and refresh
   - CSRF protection

3. **Sensitive Data**:
   - Don't store sensitive data in localStorage
   - Mask sensitive information in UI

4. **Third-Party Dependencies**:
   - Regular security audits
   - Keep dependencies updated

5. **Content Security**:
   - Implement CSP headers
   - Use HTTPS only

## Implementation Phases

### Phase 1: Foundation (2-3 weeks)
- Next.js project setup and tooling configuration
- Core component library development
- Next.js route structure
- Authentication system with middleware
- API integration layer
- Google Maps integration setup

### Phase 2: Customer Experience (3-4 weeks)
- Product browsing and search
- Shopping cart
- Checkout process
- User profile management
- Order tracking with map integration

### Phase 3: Owner Dashboard (2-3 weeks)
- Store management
- Product management
- Order management with map visualization
- Employee management
- Analytics and reporting

### Phase 4: Delivery System (2 weeks)
- Delivery employee mobile interface
- Real-time order tracking with Google Maps
- Location services and navigation
- Route optimization
- Delivery status updates

### Phase 5: Optimizations (2 weeks)
- Performance improvements
- SEO optimizations
- Accessibility enhancements
- Analytics integration
- Final testing and quality assurance

### Phase 6: Launch Preparation (1 week)
- Production deployment
- Monitoring setup
- Documentation
- User acceptance testing 
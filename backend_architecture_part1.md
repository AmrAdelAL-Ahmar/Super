# مخطط Backend وتصميم API لتطبيق توصيل السوبر ماركت
# Backend Architecture and API Design for Supermarket Delivery Application

## مخطط البنية الخلفية | Backend Architecture

### هيكل المشروع | Project Structure

```
server/
├── src/
│   ├── app.ts                     # Entry point for the application
│   ├── server.ts                  # Server configuration
│   ├── config/                    # Configuration files
│   │   ├── database.ts            # Database connection setup
│   │   ├── environment.ts         # Environment variables
│   │   ├── mail.ts                # Email configuration
│   │   └── socket.ts              # Socket.io configuration
│   ├── controllers/               # Request handlers
│   │   ├── auth.controller.ts     # Authentication controllers
│   │   ├── user.controller.ts     # User management controllers
│   │   ├── product.controller.ts  # Product management controllers
│   │   ├── order.controller.ts    # Order management controllers
│   │   ├── employee.controller.ts # Employee management controllers
│   │   ├── cart.controller.ts     # Shopping cart controllers
│   │   ├── address.controller.ts  # Address management controllers
│   │   ├── payment.controller.ts  # Payment controllers
│   │   └── notification.controller.ts # Notification controllers
│   ├── middleware/                # Custom middleware
│   │   ├── auth.middleware.ts     # Authentication middleware
│   │   ├── validation.middleware.ts # Request validation middleware
│   │   ├── error.middleware.ts    # Error handling middleware
│   │   ├── role.middleware.ts     # Role-based access control
│   │   └── logging.middleware.ts  # Request logging middleware
│   ├── models/                    # Database models
│   │   ├── user.model.ts          # User model
│   │   ├── product.model.ts       # Product model
│   │   ├── category.model.ts      # Category model
│   │   ├── order.model.ts         # Order model
│   │   ├── cart.model.ts          # Cart model
│   │   ├── address.model.ts       # Address model
│   │   ├── payment.model.ts       # Payment model
│   │   ├── notification.model.ts  # Notification model
│   │   └── employee.model.ts      # Employee model
│   ├── routes/                    # API routes
│   │   ├── index.ts               # Root router
│   │   ├── auth.routes.ts         # Authentication routes
│   │   ├── user.routes.ts         # User management routes
│   │   ├── product.routes.ts      # Product management routes
│   │   ├── order.routes.ts        # Order management routes
│   │   ├── employee.routes.ts     # Employee management routes
│   │   ├── cart.routes.ts         # Shopping cart routes
│   │   ├── address.routes.ts      # Address management routes
│   │   ├── payment.routes.ts      # Payment routes
│   │   └── notification.routes.ts # Notification routes
│   ├── services/                  # Business logic
│   │   ├── auth.service.ts        # Authentication services
│   │   ├── user.service.ts        # User management services
│   │   ├── product.service.ts     # Product management services
│   │   ├── order.service.ts       # Order management services
│   │   ├── employee.service.ts    # Employee management services
│   │   ├── cart.service.ts        # Shopping cart services
│   │   ├── address.service.ts     # Address management services
│   │   ├── payment.service.ts     # Payment services
│   │   ├── notification.service.ts # Notification services
│   │   ├── email.service.ts       # Email services
│   │   ├── socket.service.ts      # Real-time communication services
│   │   └── maps.service.ts        # Google Maps services
│   ├── utils/                     # Utility functions
│   │   ├── jwt.util.ts            # JWT helpers
│   │   ├── validation.util.ts     # Validation helpers
│   │   ├── password.util.ts       # Password hashing utilities
│   │   ├── response.util.ts       # Response formatting utilities
│   │   ├── geocoding.util.ts      # Location utilities
│   │   └── logger.util.ts         # Logging utilities
│   ├── interfaces/                # TypeScript interfaces
│   │   ├── models/                # Data model interfaces
│   │   │   ├── user.interface.ts  # User model interface
│   │   │   ├── product.interface.ts # Product model interface
│   │   │   ├── order.interface.ts # Order model interface
│   │   │   └── ...                # Other model interfaces
│   │   ├── requests/              # Request interfaces
│   │   │   ├── auth.request.ts    # Authentication request interfaces
│   │   │   ├── product.request.ts # Product request interfaces
│   │   │   └── ...                # Other request interfaces
│   │   ├── responses/             # Response interfaces
│   │   │   ├── auth.response.ts   # Authentication response interfaces
│   │   │   ├── product.response.ts # Product response interfaces
│   │   │   └── ...                # Other response interfaces
│   │   └── services/              # Service interfaces
│   │       ├── auth.service.interface.ts # Auth service interface
│   │       └── ...                # Other service interfaces
│   └── types/                     # Custom TypeScript types
│       ├── express.d.ts           # Express augmentation
│       └── environment.d.ts       # Environment variables types
├── tests/                         # Unit and integration tests
│   ├── unit/                      # Unit tests
│   └── integration/               # Integration tests
├── .env                           # Environment variables
├── .env.example                   # Example environment variables
├── package.json                   # Package manifest
├── tsconfig.json                  # TypeScript configuration
├── jest.config.js                 # Test configuration
└── README.md                      # Project documentation
```

### التقنيات المستخدمة | Technologies Used

- **لغة البرمجة | Programming Language**: TypeScript
- **إطار العمل | Framework**: Node.js + Express.js
- **قاعدة البيانات | Database**: MongoDB + Mongoose ODM
- **المصادقة | Authentication**: JWT (JSON Web Tokens)
- **التوثيق | Documentation**: Swagger/OpenAPI
- **اتصال في الوقت الحقيقي | Real-time Communication**: Socket.io
- **خدمات البريد الإلكتروني | Email Services**: Nodemailer
- **خدمات الخرائط | Maps Services**: Google Maps API
- **التحقق من الطلبات | Request Validation**: Joi/Zod
- **اختبار | Testing**: Jest, Supertest

## واجهات البرمجة | Interfaces

### 1. واجهات المستخدم | User Interfaces

```typescript
// نوع المستخدم | User Types
export enum UserRole {
  OWNER = 'owner',
  CUSTOMER = 'customer',
  DELIVERY = 'delivery'
}

// واجهة المستخدم الأساسية | Base User Interface
export interface IUser {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// واجهة صاحب السوبر ماركت | Owner Interface
export interface IOwner extends IUser {
  storeId: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeLogo?: string;
}

// واجهة العميل | Customer Interface
export interface ICustomer extends IUser {
  addresses: IAddress[];
  defaultAddressId?: string;
  orders: string[]; // Reference to order IDs
  cart: string; // Reference to cart ID
}

// واجهة موظف التوصيل | Delivery Employee Interface
export interface IDeliveryEmployee extends IUser {
  employeeId: string;
  storeId: string;
  isAvailable: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  deliveredOrders: number;
  rating: number;
}

// واجهة العنوان | Address Interface
export interface IAddress {
  _id: string;
  userId: string;
  title: string; // e.g., "Home", "Work"
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}
```

### 2. واجهات المنتجات | Product Interfaces

```typescript
// واجهة الفئة | Category Interface
export interface ICategory {
  _id: string;
  name: string;
  description: string;
  imageUrl?: string;
  parentId?: string; // For subcategories
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// واجهة المنتج | Product Interface
export interface IProduct {
  _id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  costPrice: number;
  categories: string[]; // Array of category IDs
  images: string[];
  mainImage: string;
  sku: string;
  barcode?: string;
  weight?: number;
  weightUnit?: string;
  stockQuantity: number;
  isAvailable: boolean;
  isDiscounted: boolean;
  discountPercentage?: number;
  attributes: {
    [key: string]: string; // e.g., { color: 'red', size: 'large' }
  };
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

// واجهة مراجعة المنتجات | Product Review Interface
export interface IProductReview {
  _id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
```

### 3. واجهات الطلبات والدفع | Order & Payment Interfaces

```typescript
// حالة الطلب | Order Status
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

// طريقة الدفع | Payment Method
export enum PaymentMethod {
  CASH_ON_DELIVERY = 'cash_on_delivery',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  DIGITAL_WALLET = 'digital_wallet'
}

// حالة الدفع | Payment Status
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

// واجهة عنصر الطلب | Order Item Interface
export interface IOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
  image?: string;
}

// واجهة الطلب | Order Interface
export interface IOrder {
  _id: string;
  orderNumber: string;
  customerId: string;
  storeId: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentId: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryAddressId: string;
  deliveryEmployeeId?: string;
  deliveryNotes?: string;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// واجهة الدفع | Payment Interface
export interface IPayment {
  _id: string;
  orderId: string;
  customerId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  transactionDetails?: any;
  refundId?: string;
  refundAmount?: number;
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. واجهات سلة التسوق | Cart Interfaces

```typescript
// واجهة عنصر السلة | Cart Item Interface
export interface ICartItem {
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
  addedAt: Date;
}

// واجهة السلة | Cart Interface
export interface ICart {
  _id: string;
  customerId: string;
  items: ICartItem[];
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### 5. واجهات الإشعارات | Notification Interfaces

```typescript
// نوع الإشعار | Notification Type
export enum NotificationType {
  ORDER_STATUS_UPDATE = 'order_status_update',
  DELIVERY_UPDATE = 'delivery_update',
  PAYMENT_UPDATE = 'payment_update',
  ACCOUNT_UPDATE = 'account_update',
  PROMOTION = 'promotion'
}

// واجهة الإشعار | Notification Interface
export interface INotification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata: {
    [key: string]: any; // Additional data related to the notification
  };
  createdAt: Date;
}
```

## تصميم API | API Design

### 1. المصادقة وإدارة المستخدمين | Authentication & User Management

#### المصادقة | Authentication

```
POST /api/auth/register                # تسجيل عميل جديد | Register a new customer
POST /api/auth/login                   # تسجيل الدخول | Login for all user types
POST /api/auth/refresh-token           # تحديث توكن الوصول | Refresh access token
POST /api/auth/forgot-password         # طلب إعادة تعيين كلمة المرور | Request password reset
POST /api/auth/reset-password          # إعادة تعيين كلمة المرور | Reset password
POST /api/auth/logout                  # تسجيل الخروج | Logout
```

#### المستخدمين | Users

```
GET    /api/users/me                   # الحصول على معلومات المستخدم الحالي | Get current user info
PUT    /api/users/me                   # تحديث المعلومات الشخصية | Update profile information
PUT    /api/users/me/password          # تغيير كلمة المرور | Change password
DELETE /api/users/me                   # حذف الحساب | Delete account
```

#### العناوين | Addresses

```
GET    /api/addresses                  # الحصول على جميع عناوين المستخدم | Get all user addresses
POST   /api/addresses                  # إضافة عنوان جديد | Add a new address
GET    /api/addresses/:id              # الحصول على تفاصيل العنوان | Get address details
PUT    /api/addresses/:id              # تحديث العنوان | Update address
DELETE /api/addresses/:id              # حذف العنوان | Delete address
PUT    /api/addresses/:id/default      # تعيين العنوان كافتراضي | Set address as default
```

### 2. إدارة المنتجات | Product Management

#### الفئات | Categories

```
GET    /api/categories                 # الحصول على جميع الفئات | Get all categories
POST   /api/categories                 # إنشاء فئة جديدة (مالك) | Create a new category (owner)
GET    /api/categories/:id             # الحصول على تفاصيل الفئة | Get category details
PUT    /api/categories/:id             # تحديث الفئة (مالك) | Update category (owner)
DELETE /api/categories/:id             # حذف الفئة (مالك) | Delete category (owner)
```

#### المنتجات | Products

```
GET    /api/products                   # الحصول على جميع المنتجات | Get all products
POST   /api/products                   # إنشاء منتج جديد (مالك) | Create a new product (owner)
GET    /api/products/:id               # الحصول على تفاصيل المنتج | Get product details
PUT    /api/products/:id               # تحديث المنتج (مالك) | Update product (owner)
DELETE /api/products/:id               # حذف المنتج (مالك) | Delete product (owner)
GET    /api/products/search            # البحث في المنتجات | Search products
GET    /api/products/category/:id      # الحصول على منتجات حسب الفئة | Get products by category
```

#### مراجعات المنتجات | Product Reviews

```
GET    /api/products/:id/reviews       # الحصول على مراجعات المنتج | Get product reviews
POST   /api/products/:id/reviews       # إضافة مراجعة جديدة (عميل) | Add a review (customer)
PUT    /api/products/:id/reviews/:reviewId # تحديث المراجعة (عميل) | Update review (customer)
DELETE /api/products/:id/reviews/:reviewId # حذف المراجعة (عميل/مالك) | Delete review (customer/owner)
```

### 3. إدارة السلة | Cart Management

```
GET    /api/cart                       # الحصول على محتويات السلة | Get cart contents
POST   /api/cart/items                 # إضافة منتج للسلة | Add product to cart
PUT    /api/cart/items/:productId      # تحديث كمية المنتج | Update product quantity
DELETE /api/cart/items/:productId      # حذف منتج من السلة | Remove product from cart
DELETE /api/cart                       # تفريغ السلة | Clear cart
```

### 4. إدارة الطلبات | Order Management

#### الطلبات للعملاء | Orders for Customers

```
POST   /api/orders                     # إنشاء طلب جديد | Create a new order
GET    /api/orders                     # الحصول على طلبات المستخدم | Get user orders
GET    /api/orders/:id                 # الحصول على تفاصيل الطلب | Get order details
DELETE /api/orders/:id                 # إلغاء الطلب | Cancel order
```

#### الطلبات للمالكين | Orders for Owners

```
GET    /api/owner/orders               # الحصول على جميع الطلبات | Get all orders
GET    /api/owner/orders/:id           # الحصول على تفاصيل الطلب | Get order details
PUT    /api/owner/orders/:id/status    # تحديث حالة الطلب | Update order status
PUT    /api/owner/orders/:id/employee  # تعيين موظف للتوصيل | Assign delivery employee
```

#### الطلبات لموظفي التوصيل | Orders for Delivery Employees

```
GET    /api/delivery/orders            # الحصول على طلبات التوصيل | Get delivery orders
GET    /api/delivery/orders/:id        # الحصول على تفاصيل الطلب | Get order details
PUT    /api/delivery/orders/:id/status # تحديث حالة الطلب | Update order status
PUT    /api/delivery/orders/:id/location # تحديث موقع التوصيل | Update delivery location
```

### 5. إدارة الموظفين | Employee Management

```
GET    /api/employees                  # الحصول على جميع الموظفين (مالك) | Get all employees (owner)
POST   /api/employees                  # إضافة موظف جديد (مالك) | Add a new employee (owner)
GET    /api/employees/:id              # الحصول على تفاصيل الموظف (مالك) | Get employee details (owner)
PUT    /api/employees/:id              # تحديث معلومات الموظف (مالك) | Update employee (owner)
DELETE /api/employees/:id              # حذف الموظف (مالك) | Delete employee (owner)
PUT    /api/employees/:id/status       # تحديث حالة الموظف (مالك) | Update employee status (owner)
GET    /api/employees/:id/performance  # الحصول على أداء الموظف (مالك) | Get employee performance (owner)
```

### 6. نظام الدفع | Payment System

```
POST   /api/payments/process           # معالجة الدفع | Process payment
GET    /api/payments/order/:orderId    # الحصول على تفاصيل الدفع للطلب | Get payment details for order
POST   /api/payments/:id/refund        # طلب استرداد (مالك) | Request refund (owner)
```

### 7. نظام الإشعارات | Notification System

```
GET    /api/notifications              # الحصول على إشعارات المستخدم | Get user notifications
PUT    /api/notifications/:id/read     # تعيين الإشعار كمقروء | Mark notification as read
DELETE /api/notifications/:id          # حذف الإشعار | Delete notification
DELETE /api/notifications              # حذف جميع الإشعارات | Delete all notifications
PUT    /api/notifications/read-all     # تعيين جميع الإشعارات كمقروءة | Mark all notifications as read
```

### 8. الإحصائيات والتحليلات | Statistics & Analytics

```
GET    /api/owner/stats/overview       # نظرة عامة على الأداء (مالك) | Performance overview (owner)
GET    /api/owner/stats/sales          # إحصائيات المبيعات (مالك) | Sales statistics (owner)
GET    /api/owner/stats/products       # إحصائيات المنتجات (مالك) | Product statistics (owner)
GET    /api/owner/stats/customers      # إحصائيات العملاء (مالك) | Customer statistics (owner)
GET    /api/owner/stats/employees      # إحصائيات الموظفين (مالك) | Employee statistics (owner)
```

## مخطط قاعدة البيانات | Database Schema

### العلاقات بين الكيانات | Entity Relationships

```
User --(1:N)--> Address
User --(1:1)--> Cart
User --(1:N)--> Order
User --(1:N)--> Notification

Store --(1:N)--> Product
Store --(1:N)--> Employee
Store --(1:N)--> Order

Product --(N:N)--> Category
Product --(1:N)--> ProductReview

Order --(1:N)--> OrderItem
Order --(1:1)--> Payment
Order --(1:1)--> DeliveryEmployee

Cart --(1:N)--> CartItem
```

## تطبيق الأمان | Security Implementation

### استراتيجية المصادقة | Authentication Strategy

```typescript
// استراتيجية JWT | JWT Strategy
export interface IJwtPayload {
  userId: string;
  role: UserRole;
  storeId?: string;
  iat: number;
  exp: number;
}

// استراتيجية تجديد التوكن | Token Refresh Strategy
export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
```

### التحكم في الوصول | Access Control

```typescript
// التحقق من الدور | Role Verification Middleware
export enum Permission {
  // أذونات المنتجات | Product Permissions
  VIEW_PRODUCTS = 'view:products',
  CREATE_PRODUCT = 'create:product',
  UPDATE_PRODUCT = 'update:product',
  DELETE_PRODUCT = 'delete:product',
  MANAGE_PRODUCT_INVENTORY = 'manage:product:inventory',
  
  // أذونات الفئات | Category Permissions
  VIEW_CATEGORIES = 'view:categories',
  CREATE_CATEGORY = 'create:category',
  UPDATE_CATEGORY = 'update:category',
  DELETE_CATEGORY = 'delete:category',
  
  // أذونات الطلبات | Order Permissions
  VIEW_ORDERS = 'view:orders',
  CREATE_ORDER = 'create:order',
  UPDATE_ORDER = 'update:order',
  CANCEL_ORDER = 'cancel:order',
  MANAGE_ORDERS = 'manage:orders',
  VIEW_ALL_ORDERS = 'view:all:orders',
  
  // أذونات الموظفين | Employee Permissions
  VIEW_EMPLOYEES = 'view:employees',
  CREATE_EMPLOYEE = 'create:employee',
  UPDATE_EMPLOYEE = 'update:employee',
  DELETE_EMPLOYEE = 'delete:employee',
  MANAGE_EMPLOYEES = 'manage:employees',
  
  // أذونات المتجر | Store Permissions
  VIEW_STORE = 'view:store',
  UPDATE_STORE = 'update:store',
  MANAGE_STORE = 'manage:store',
  
  // أذونات السلة | Cart Permissions
  VIEW_CART = 'view:cart',
  UPDATE_CART = 'update:cart',
  CLEAR_CART = 'clear:cart',
  
  // أذونات العناوين | Address Permissions
  VIEW_ADDRESSES = 'view:addresses',
  CREATE_ADDRESS = 'create:address',
  UPDATE_ADDRESS = 'update:address',
  DELETE_ADDRESS = 'delete:address',
  
  // أذونات المدفوعات | Payment Permissions
  PROCESS_PAYMENT = 'process:payment',
  VIEW_PAYMENT_DETAILS = 'view:payment:details',
  REFUND_PAYMENT = 'refund:payment',
  MANAGE_PAYMENTS = 'manage:payments',
  
  // أذونات التحليلات | Analytics Permissions
  VIEW_ANALYTICS = 'view:analytics',
  VIEW_SALES_REPORTS = 'view:sales:reports',
  VIEW_CUSTOMER_ANALYTICS = 'view:customer:analytics',
  VIEW_PRODUCT_ANALYTICS = 'view:product:analytics',
  EXPORT_REPORTS = 'export:reports',
  
  // أذونات التوصيل | Delivery Permissions
  VIEW_DELIVERY_ORDERS = 'view:delivery:orders',
  UPDATE_DELIVERY_STATUS = 'update:delivery:status',
  UPDATE_LOCATION = 'update:location',
  
  // أذونات الإشعارات | Notification Permissions
  VIEW_NOTIFICATIONS = 'view:notifications',
  MANAGE_NOTIFICATIONS = 'manage:notifications',
  SEND_NOTIFICATIONS = 'send:notifications',
  
  // أذونات المراجعات | Review Permissions
  VIEW_REVIEWS = 'view:reviews',
  CREATE_REVIEW = 'create:review',
  UPDATE_REVIEW = 'update:review',
  DELETE_REVIEW = 'delete:review',
  MODERATE_REVIEWS = 'moderate:reviews'
}

// ربط الأدوار بالأذونات | Role-Permission Mapping
export const rolePermissions: Record<UserRole, Permission[]> = {
  // أذونات صاحب المتجر | Store Owner Permissions
  [UserRole.OWNER]: [
    // أذونات المنتجات | Product Permissions
    Permission.VIEW_PRODUCTS,
    Permission.CREATE_PRODUCT,
    Permission.UPDATE_PRODUCT,
    Permission.DELETE_PRODUCT,
    Permission.MANAGE_PRODUCT_INVENTORY,
    
    // أذونات الفئات | Category Permissions
    Permission.VIEW_CATEGORIES,
    Permission.CREATE_CATEGORY,
    Permission.UPDATE_CATEGORY,
    Permission.DELETE_CATEGORY,
    
    // أذونات الطلبات | Order Permissions
    Permission.VIEW_ORDERS,
    Permission.UPDATE_ORDER,
    Permission.MANAGE_ORDERS,
    Permission.VIEW_ALL_ORDERS,
    
    // أذونات الموظفين | Employee Permissions
    Permission.VIEW_EMPLOYEES,
    Permission.CREATE_EMPLOYEE,
    Permission.UPDATE_EMPLOYEE,
    Permission.DELETE_EMPLOYEE,
    Permission.MANAGE_EMPLOYEES,
    
    // أذونات المتجر | Store Permissions
    Permission.VIEW_STORE,
    Permission.UPDATE_STORE,
    Permission.MANAGE_STORE,
    
    // أذونات المدفوعات | Payment Permissions
    Permission.VIEW_PAYMENT_DETAILS,
    Permission.REFUND_PAYMENT,
    Permission.MANAGE_PAYMENTS,
    
    // أذونات التحليلات | Analytics Permissions
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_SALES_REPORTS,
    Permission.VIEW_CUSTOMER_ANALYTICS,
    Permission.VIEW_PRODUCT_ANALYTICS,
    Permission.EXPORT_REPORTS,
    
    // أذونات الإشعارات | Notification Permissions
    Permission.VIEW_NOTIFICATIONS,
    Permission.MANAGE_NOTIFICATIONS,
    Permission.SEND_NOTIFICATIONS,
    
    // أذونات المراجعات | Review Permissions
    Permission.VIEW_REVIEWS,
    Permission.MODERATE_REVIEWS
  ],
  
  // أذونات العميل | Customer Permissions
  [UserRole.CUSTOMER]: [
    // أذونات المنتجات | Product Permissions
    Permission.VIEW_PRODUCTS,
    
    // أذونات الفئات | Category Permissions
    Permission.VIEW_CATEGORIES,
    
    // أذونات الطلبات | Order Permissions
    Permission.VIEW_ORDERS,
    Permission.CREATE_ORDER,
    Permission.CANCEL_ORDER,
    
    // أذونات السلة | Cart Permissions
    Permission.VIEW_CART,
    Permission.UPDATE_CART,
    Permission.CLEAR_CART,
    
    // أذونات العناوين | Address Permissions
    Permission.VIEW_ADDRESSES,
    Permission.CREATE_ADDRESS,
    Permission.UPDATE_ADDRESS,
    Permission.DELETE_ADDRESS,
    
    // أذونات المدفوعات | Payment Permissions
    Permission.PROCESS_PAYMENT,
    Permission.VIEW_PAYMENT_DETAILS,
    
    // أذونات الإشعارات | Notification Permissions
    Permission.VIEW_NOTIFICATIONS,
    
    // أذونات المراجعات | Review Permissions
    Permission.VIEW_REVIEWS,
    Permission.CREATE_REVIEW,
    Permission.UPDATE_REVIEW,
    Permission.DELETE_REVIEW
  ],
  
  // أذونات موظف التوصيل | Delivery Employee Permissions
  [UserRole.DELIVERY]: [
    // أذونات الطلبات | Order Permissions
    Permission.VIEW_DELIVERY_ORDERS,
    
    // أذونات التوصيل | Delivery Permissions
    Permission.VIEW_DELIVERY_ORDERS,
    Permission.UPDATE_DELIVERY_STATUS,
    Permission.UPDATE_LOCATION,
    
    // أذونات الإشعارات | Notification Permissions
    Permission.VIEW_NOTIFICATIONS,
    
    // أذونات مخصصة للتوصيل | Delivery-specific Permissions
    Permission.VIEW_PRODUCTS // للاطلاع على تفاصيل المنتجات المطلوب توصيلها
  ]
};
```

## تنفيذ الاتصال في الوقت الحقيقي | Real-time Communication Implementation

### أحداث Socket.io | Socket.io Events

```typescript
// أحداث الإشعارات | Notification Events
export enum NotificationEvent {
  ORDER_CREATED = 'order:created',
  ORDER_STATUS_UPDATED = 'order:status:updated',
  ORDER_ASSIGNED = 'order:assigned',
  DELIVERY_LOCATION_UPDATED = 'delivery:location:updated',
  NOTIFICATION_CREATED = 'notification:created',
}

// أحداث الدردشة | Chat Events
export enum ChatEvent {
  MESSAGE_SENT = 'chat:message:sent',
  MESSAGE_DELIVERED = 'chat:message:delivered',
  MESSAGE_READ = 'chat:message:read',
  USER_TYPING = 'chat:user:typing',
}
```

## خدمات دعم | Supporting Services

### خدمة البريد الإلكتروني | Email Service

```typescript
// واجهة خدمة البريد | Email Service Interface
export interface IEmailService {
  sendWelcomeEmail(user: IUser): Promise<void>;
  sendPasswordResetEmail(user: IUser, token: string): Promise<void>;
  sendOrderConfirmation(user: IUser, order: IOrder): Promise<void>;
  sendOrderStatusUpdate(user: IUser, order: IOrder): Promise<void>;
  sendDeliveryNotification(user: IUser, order: IOrder): Promise<void>;
}
```

### خدمة الخرائط | Maps Service

```typescript
// واجهة خدمة الخرائط | Maps Service Interface
export interface IMapsService {
  geocodeAddress(address: IAddress): Promise<{ lat: number; lng: number }>;
  calculateDistance(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ): Promise<number>;
  calculateEstimatedDeliveryTime(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ): Promise<number>;
}
```

## واجهات الطلبات | Request Interfaces

### 1. واجهات طلبات المصادقة | Authentication Request Interfaces

```typescript
// واجهة طلب التسجيل | Register Request Interface
export interface IRegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
}

// واجهة طلب تسجيل صاحب السوبر ماركت | Owner Register Request Interface
export interface IOwnerRegisterRequest extends IRegisterRequest {
  storeName: string;
  storeAddress: string;
  storePhone: string;
}

// واجهة طلب إضافة موظف توصيل | Delivery Employee Register Request Interface
export interface IDeliveryEmployeeRegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

// واجهة طلب تسجيل الدخول | Login Request Interface
export interface ILoginRequest {
  email: string;
  password: string;
}

// واجهة طلب تحديث التوكن | Refresh Token Request Interface
export interface IRefreshTokenRequest {
  refreshToken: string;
}

// واجهة طلب نسيان كلمة المرور | Forgot Password Request Interface
export interface IForgotPasswordRequest {
  email: string;
}

// واجهة طلب إعادة تعيين كلمة المرور | Reset Password Request Interface
export interface IResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}
```

### 2. واجهات طلبات المستخدم | User Request Interfaces

```typescript
// واجهة طلب تحديث الملف الشخصي | Update Profile Request Interface
export interface IUpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

// واجهة طلب تحديث كلمة المرور | Change Password Request Interface
export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// واجهة طلب إضافة عنوان | Add Address Request Interface
export interface IAddressRequest {
  title: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

// واجهة طلب تحديث متجر صاحب السوبر ماركت | Update Store Request Interface
export interface IUpdateStoreRequest {
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
  storeLogo?: string;
}

// واجهة طلب تحديث موقع موظف التوصيل | Update Delivery Location Request Interface
export interface IUpdateDeliveryLocationRequest {
  lat: number;
  lng: number;
}
```

## واجهات الاستجابة | Response Interfaces

### 1. واجهات استجابة المصادقة | Authentication Response Interfaces

```typescript
// واجهة استجابة المصادقة | Auth Response Interface
export interface IAuthResponse {
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  };
  tokens: ITokenPair;
}

// واجهة استجابة تحديث التوكن | Refresh Token Response Interface
export interface IRefreshTokenResponse {
  tokens: ITokenPair;
}

// واجهة استجابة طلب نسيان كلمة المرور | Forgot Password Response Interface
export interface IForgotPasswordResponse {
  message: string;
  emailSent: boolean;
}
```

### 2. واجهات استجابة عامة | Common Response Interfaces

```typescript
// واجهة استجابة عامة | Generic Response Interface
export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// واجهة استجابة الخطأ | Error Response Interface
export interface IErrorResponse {
  success: boolean;
  message: string;
  errors?: {
    [key: string]: string;
  };
  stack?: string; // للبيئة التطويرية فقط | For development environment only
}

// واجهة استجابة الصفحات | Paginated Response Interface
export interface IPaginatedResponse<T> {
  success: boolean;
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

### 3. واجهات طلبات المنتجات | Product Request Interfaces 

```typescript
// واجهة طلب إضافة فئة | Add Category Request Interface
export interface ICategoryRequest {
  name: string;
  description: string;
  imageUrl?: string;
  parentId?: string;
  isActive?: boolean;
}

// واجهة طلب إضافة منتج | Add Product Request Interface
export interface IProductRequest {
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  costPrice: number;
  categories: string[];
  images: string[];
  mainImage: string;
  sku: string;
  barcode?: string;
  weight?: number;
  weightUnit?: string;
  stockQuantity: number;
  isAvailable?: boolean;
  isDiscounted?: boolean;
  discountPercentage?: number;
  attributes?: {
    [key: string]: string;
  };
}

// واجهة طلب تحديث مخزون المنتج | Update Product Stock Request Interface
export interface IUpdateProductStockRequest {
  stockQuantity: number;
}

// واجهة طلب إضافة مراجعة منتج | Add Product Review Request Interface
export interface IProductReviewRequest {
  rating: number;
  comment: string;
}

// واجهة طلب البحث عن منتجات | Product Search Request Interface
export interface IProductSearchRequest {
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

### 4. واجهات طلبات السلة والطلبات | Cart & Order Request Interfaces

```typescript
// واجهة طلب إضافة منتج للسلة | Add Item to Cart Request Interface
export interface IAddToCartRequest {
  productId: string;
  quantity: number;
}

// واجهة طلب تحديث كمية منتج في السلة | Update Cart Item Request Interface
export interface IUpdateCartItemRequest {
  quantity: number;
}

// واجهة طلب إنشاء طلب | Create Order Request Interface
export interface ICreateOrderRequest {
  deliveryAddressId: string;
  paymentMethod: PaymentMethod;
  deliveryNotes?: string;
}

// واجهة طلب تحديث حالة الطلب | Update Order Status Request Interface
export interface IUpdateOrderStatusRequest {
  status: OrderStatus;
  reason?: string; // للإلغاء | For cancellation
}

// واجهة طلب تعيين موظف توصيل للطلب | Assign Delivery Employee Request Interface
export interface IAssignDeliveryEmployeeRequest {
  deliveryEmployeeId: string;
}
```

### 5. واجهات طلبات الدفع | Payment Request Interfaces

```typescript
// واجهة طلب معالجة الدفع | Process Payment Request Interface
export interface IProcessPaymentRequest {
  orderId: string;
  paymentMethod: PaymentMethod;
  paymentDetails?: {
    cardNumber?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvv?: string;
    cardHolderName?: string;
    walletId?: string;
  };
}

// واجهة طلب استرداد الدفع | Refund Request Interface
export interface IRefundRequest {
  orderId: string;
  amount?: number; // إذا كان الاسترداد جزئيًا | If partial refund
  reason: string;
}
```

### 6. واجهات استجابة المنتجات | Product Response Interfaces

```typescript
// واجهة استجابة المنتج | Product Response Interface
export interface IProductResponse extends Omit<IProduct, 'storeId'> {
  store: {
    id: string;
    name: string;
  };
  categoryDetails: {
    id: string;
    name: string;
  }[];
}

// واجهة استجابة تفاصيل المنتج | Product Details Response Interface
export interface IProductDetailsResponse extends IProductResponse {
  reviews: {
    average: number;
    total: number;
    items: {
      id: string;
      user: {
        id: string;
        name: string;
      };
      rating: number;
      comment: string;
      createdAt: Date;
    }[];
  };
  relatedProducts: IProductResponse[];
}

// واجهة استجابة البحث عن منتجات | Product Search Response Interface
export interface IProductSearchResponse extends IPaginatedResponse<IProductResponse> {
  filters: {
    categories: {
      id: string;
      name: string;
      count: number;
    }[];
    priceRange: {
      min: number;
      max: number;
    };
  };
}
```

### 7. واجهات استجابة السلة والطلبات | Cart & Order Response Interfaces

```typescript
// واجهة استجابة السلة | Cart Response Interface
export interface ICartResponse {
  id: string;
  items: {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    totalPrice: number;
  }[];
  subtotal: number;
  estimatedTax?: number;
  estimatedShipping?: number;
  total: number;
}

// واجهة استجابة الطلب | Order Response Interface
export interface IOrderResponse {
  id: string;
  orderNumber: string;
  date: Date;
  status: OrderStatus;
  items: {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    totalPrice: number;
  }[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryAddress: {
    title: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    country: string;
  };
  deliveryEmployee?: {
    id: string;
    name: string;
    phone: string;
    currentLocation?: {
      lat: number;
      lng: number;
    };
  };
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  timeline: {
    status: OrderStatus;
    timestamp: Date;
    note?: string;
  }[];
}
```

## أمثلة التنفيذ | Implementation Examples

### 1. نموذج مستخدم | User Model Example

```typescript
// src/models/user.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser, UserRole } from '../interfaces/models/user.interface';

const userSchema = new Schema<IUser & Document>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

// قبل الحفظ: تشفير كلمة المرور | Before save: hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// طريقة للتحقق من كلمة المرور | Method to verify password
userSchema.methods.isPasswordMatch = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// طريقة للحصول على الاسم الكامل | Method to get full name
userSchema.methods.getFullName = function (): string {
  return `${this.firstName} ${this.lastName}`;
};

const UserModel = mongoose.model<IUser & Document>('User', userSchema);

export default UserModel;
```

### 2. خدمة المصادقة | Authentication Service Example

```typescript
// src/services/auth.service.ts
import jwt from 'jsonwebtoken';
import { IAuthService } from '../interfaces/services/auth.service.interface';
import { IUser, UserRole } from '../interfaces/models/user.interface';
import { ITokenPair, IJwtPayload } from '../interfaces/auth.interface';
import { IRegisterRequest, ILoginRequest } from '../interfaces/requests/auth.request';
import { IAuthResponse } from '../interfaces/responses/auth.response';
import UserModel from '../models/user.model';
import { BadRequestError, UnauthorizedError } from '../utils/api-errors';
import config from '../config/environment';

class AuthService implements IAuthService {
  public async register(userData: IRegisterRequest): Promise<IAuthResponse> {
    // التحقق من وجود المستخدم | Check if user exists
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new BadRequestError('البريد الإلكتروني مسجل مسبقًا | Email is already registered');
    }

    // التحقق من تطابق كلمات المرور | Check if passwords match
    if (userData.password !== userData.confirmPassword) {
      throw new BadRequestError('كلمات المرور غير متطابقة | Passwords do not match');
    }

    // إنشاء مستخدم جديد | Create new user
    const user = new UserModel({
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      role: UserRole.CUSTOMER,
    });

    await user.save();

    // إنشاء التوكنات | Generate tokens
    const tokens = this.generateTokens(user);

    return {
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      tokens,
    };
  }

  public async login(credentials: ILoginRequest): Promise<IAuthResponse> {
    // البحث عن المستخدم | Find user
    const user = await UserModel.findOne({ email: credentials.email });
    if (!user) {
      throw new UnauthorizedError('بيانات الاعتماد غير صالحة | Invalid credentials');
    }

    // التحقق من كلمة المرور | Verify password
    const isMatch = await user.isPasswordMatch(credentials.password);
    if (!isMatch) {
      throw new UnauthorizedError('بيانات الاعتماد غير صالحة | Invalid credentials');
    }

    // التحقق من أن الحساب نشط | Check if account is active
    if (!user.isActive) {
      throw new UnauthorizedError('الحساب غير نشط | Account is not active');
    }

    // إنشاء التوكنات | Generate tokens
    const tokens = this.generateTokens(user);

    return {
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      tokens,
    };
  }

  public async refreshToken(refreshToken: string): Promise<ITokenPair> {
    try {
      // التحقق من التوكن | Verify token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as IJwtPayload;
      
      // البحث عن المستخدم | Find user
      const user = await UserModel.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw new UnauthorizedError('توكن غير صالح | Invalid token');
      }

      // إنشاء توكنات جديدة | Generate new tokens
      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedError('توكن غير صالح | Invalid token');
    }
  }

  private generateTokens(user: IUser): ITokenPair {
    const payload: Omit<IJwtPayload, 'iat' | 'exp'> = {
      userId: user._id,
      role: user.role,
    };

    // إضافة معرف المتجر إذا كان المستخدم مالكًا | Add store ID if user is owner
    if (user.role === UserRole.OWNER && 'storeId' in user) {
      payload.storeId = (user as any).storeId;
    }

    // إنشاء توكن الوصول | Create access token
    const accessToken = jwt.sign(
      payload,
      config.jwt.accessSecret,
      { expiresIn: config.jwt.accessExpiresIn }
    );

    // إنشاء توكن التحديث | Create refresh token
    const refreshToken = jwt.sign(
      payload,
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: Number(config.jwt.accessExpiresIn.replace('s', '')) * 1000,
    };
  }
}

export default new AuthService();
```

### 3. وحدة التحكم في المصادقة | Authentication Controller Example

```typescript
// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { validateRequest } from '../middleware/validation.middleware';
import { registerSchema, loginSchema, refreshTokenSchema } from '../utils/validation/auth.validation';
import { IRegisterRequest, ILoginRequest, IRefreshTokenRequest } from '../interfaces/requests/auth.request';

class AuthController {
  // تسجيل مستخدم جديد | Register a new user
  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // التحقق من صحة البيانات | Validate request data
      const userData = await validateRequest<IRegisterRequest>(req.body, registerSchema);
      
      // تسجيل المستخدم | Register user
      const result = await authService.register(userData);
      
      res.status(201).json({
        success: true,
        message: 'تم التسجيل بنجاح | User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // تسجيل الدخول | Login
  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // التحقق من صحة البيانات | Validate request data
      const credentials = await validateRequest<ILoginRequest>(req.body, loginSchema);
      
      // تسجيل الدخول | Login
      const result = await authService.login(credentials);
      
      res.status(200).json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح | Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // تحديث التوكن | Refresh token
  public async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // التحقق من صحة البيانات | Validate request data
      const tokenData = await validateRequest<IRefreshTokenRequest>(req.body, refreshTokenSchema);
      
      // تحديث التوكن | Refresh token
      const tokens = await authService.refreshToken(tokenData.refreshToken);
      
      res.status(200).json({
        success: true,
        message: 'تم تحديث التوكن بنجاح | Token refreshed successfully',
        data: { tokens },
      });
    } catch (error) {
      next(error);
    }
  }

  // تسجيل الخروج | Logout
  public async logout(req: Request, res: Response): Promise<void> {
    // ملاحظة: يتم التعامل مع تسجيل الخروج على جانب العميل عن طريق حذف التوكنات
    // Note: Logout is handled on the client side by removing tokens
    res.status(200).json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح | Logged out successfully',
    });
  }
}

export default new AuthController();
```

### 4. توجيهات المصادقة | Authentication Routes Example

```typescript
// src/routes/auth.routes.ts
import { Router } from 'express';
import authController from '../controllers/auth.controller';

const router = Router();

// طريق التسجيل | Register route
router.post('/register', authController.register);

// طريق تسجيل الدخول | Login route
router.post('/login', authController.login);

// طريق تحديث التوكن | Refresh token route
router.post('/refresh-token', authController.refreshToken);

// طريق تسجيل الخروج | Logout route
router.post('/logout', authController.logout);

export default router;
```

### 5. مثال لنموذج المنتج | Product Model Example

```typescript
// src/models/product.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from '../interfaces/models/product.interface';

const productSchema = new Schema<IProduct & Document>(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    salePrice: {
      type: Number,
      min: 0,
    },
    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    categories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category',
    }],
    images: [{
      type: String,
    }],
    mainImage: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    barcode: {
      type: String,
    },
    weight: {
      type: Number,
      min: 0,
    },
    weightUnit: {
      type: String,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isDiscounted: {
      type: Boolean,
      default: false,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    attributes: {
      type: Map,
      of: String,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// إنشاء فهرس نصي للبحث | Create text index for search
productSchema.index({ name: 'text', description: 'text' });

// طرق إضافية | Additional methods

// التحقق من توفر المخزون | Check if product is in stock
productSchema.methods.isInStock = function (): boolean {
  return this.stockQuantity > 0 && this.isAvailable;
};

// الحصول على السعر النهائي | Get final price
productSchema.methods.getFinalPrice = function (): number {
  if (this.isDiscounted && this.salePrice) {
    return this.salePrice;
  }
  return this.price;
};

// حساب هامش الربح | Calculate profit margin
productSchema.methods.getProfitMargin = function (): number {
  const finalPrice = this.getFinalPrice();
  return ((finalPrice - this.costPrice) / finalPrice) * 100;
};

const ProductModel = mongoose.model<IProduct & Document>('Product', productSchema);

export default ProductModel;
```

### 6. وسيط المصادقة | Authentication Middleware Example

```typescript
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IJwtPayload } from '../interfaces/auth.interface';
import { UnauthorizedError, ForbiddenError } from '../utils/api-errors';
import config from '../config/environment';
import { UserRole, Permission, rolePermissions } from '../interfaces/models/user.interface';
import UserModel from '../models/user.model';

// وسيط المصادقة | Authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // الحصول على التوكن من رأس الطلب | Get token from request header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('توكن المصادقة غير موجود | Authentication token is missing');
    }

    const token = authHeader.split(' ')[1];

    // التحقق من التوكن | Verify token
    const decoded = jwt.verify(token, config.jwt.accessSecret) as IJwtPayload;

    // البحث عن المستخدم | Find user
    const user = await UserModel.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('مستخدم غير صالح | Invalid user');
    }

    // إضافة معلومات المستخدم إلى الطلب | Add user info to request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      storeId: decoded.storeId,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('توكن غير صالح | Invalid token'));
    } else {
      next(error);
    }
  }
};

// وسيط التفويض | Authorization middleware
export const authorize = (requiredPermissions: Permission | Permission[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('يجب أن تكون مصادقًا | You must be authenticated');
      }

      const userRole = req.user.role;
      const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
      
      // التحقق من صلاحيات المستخدم | Check user permissions
      const userPermissions = rolePermissions[userRole] || [];
      const hasPermission = permissions.every(permission => userPermissions.includes(permission));

      if (!hasPermission) {
        throw new ForbiddenError('ليس لديك صلاحية للوصول إلى هذا المورد | You do not have permission to access this resource');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// وسيط للتحقق من الدور | Role verification middleware
export const hasRole = (roles: UserRole | UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('يجب أن تكون مصادقًا | You must be authenticated');
      }

      const allowedRoles = Array.isArray(roles) ? roles : [roles];
      
      if (!allowedRoles.includes(req.user.role)) {
        throw new ForbiddenError('ليس لديك الدور المطلوب للوصول إلى هذا المورد | You do not have the required role to access this resource');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
```

### 7. خدمة الإشعارات في الوقت الحقيقي | Real-time Notification Service

```typescript
// src/services/socket.service.ts
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import { IJwtPayload } from '../interfaces/auth.interface';
import { NotificationEvent, ChatEvent } from '../interfaces/socket.interface';
import config from '../config/environment';
import { INotification } from '../interfaces/models/notification.interface';
import { IOrder } from '../interfaces/models/order.interface';
import NotificationModel from '../models/notification.model';

class SocketService {
  private io: SocketServer;
  private userSockets: Map<string, string[]> = new Map(); // userId -> socketIds[]

  constructor() {
    this.onConnection = this.onConnection.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
  }

  // تهيئة الخدمة | Initialize the service
  public initialize(server: http.Server): void {
    this.io = new SocketServer(server, {
      cors: {
        origin: config.cors.origin,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    // مصادقة الاتصال | Authenticate connection
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('التوكن مطلوب | Token is required'));
      }

      try {
        const decoded = jwt.verify(token, config.jwt.accessSecret) as IJwtPayload;
        socket.data.userId = decoded.userId;
        socket.data.role = decoded.role;
        socket.data.storeId = decoded.storeId;
        next();
      } catch (error) {
        next(new Error('توكن غير صالح | Invalid token'));
      }
    });

    // الاستماع إلى الاتصالات | Listen for connections
    this.io.on('connection', this.onConnection);
  }

  // عند اتصال مستخدم | On user connection
  private onConnection(socket: any): void {
    const userId = socket.data.userId;
    
    // إضافة المقبس إلى قائمة المستخدم | Add socket to user's list
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, []);
    }
    this.userSockets.get(userId)?.push(socket.id);

    // انضمام إلى غرفة المستخدم | Join user's room
    socket.join(`user_${userId}`);

    // انضمام إلى غرفة المتجر إذا كان مالكًا أو موظفًا | Join store room if owner or employee
    if (socket.data.storeId) {
      socket.join(`store_${socket.data.storeId}`);
    }

    // الاستماع للانقطاع | Listen for disconnect
    socket.on('disconnect', () => this.onDisconnect(socket));
  }

  // عند انقطاع اتصال مستخدم | On user disconnection
  private onDisconnect(socket: any): void {
    const userId = socket.data.userId;
    
    // إزالة المقبس من قائمة المستخدم | Remove socket from user's list
    const userSocketIds = this.userSockets.get(userId) || [];
    const newSocketIds = userSocketIds.filter(id => id !== socket.id);
    
    if (newSocketIds.length === 0) {
      this.userSockets.delete(userId);
    } else {
      this.userSockets.set(userId, newSocketIds);
    }
  }

  // إرسال إشعار | Send notification
  public async sendNotification(userId: string, notification: INotification): Promise<void> {
    // حفظ الإشعار في قاعدة البيانات | Save notification to database
    const newNotification = new NotificationModel(notification);
    await newNotification.save();

    // إرسال الإشعار عبر Socket.io | Send notification via Socket.io
    this.io.to(`user_${userId}`).emit(NotificationEvent.NOTIFICATION_CREATED, newNotification);
  }

  // إرسال تحديث حالة الطلب | Send order status update
  public async sendOrderStatusUpdate(order: IOrder): Promise<void> {
    // إرسال إلى العميل | Send to customer
    this.io.to(`user_${order.customerId}`).emit(NotificationEvent.ORDER_STATUS_UPDATED, {
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      updatedAt: new Date(),
    });

    // إرسال إلى المتجر | Send to store
    this.io.to(`store_${order.storeId}`).emit(NotificationEvent.ORDER_STATUS_UPDATED, {
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      customerId: order.customerId,
      updatedAt: new Date(),
    });

    // إرسال إلى موظف التوصيل إذا تم تعيينه | Send to delivery employee if assigned
    if (order.deliveryEmployeeId) {
      this.io.to(`user_${order.deliveryEmployeeId}`).emit(NotificationEvent.ORDER_STATUS_UPDATED, {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        updatedAt: new Date(),
      });
    }
  }

  // تحديث موقع موظف التوصيل | Update delivery location
  public updateDeliveryLocation(orderId: string, employeeId: string, location: { lat: number; lng: number }): void {
    this.io.to(`order_${orderId}`).emit(NotificationEvent.DELIVERY_LOCATION_UPDATED, {
      orderId,
      employeeId,
      location,
      updatedAt: new Date(),
    });
  }

  // تعيين موظف للطلب | Assign employee to order
  public assignEmployeeToOrder(orderId: string, employeeId: string, orderDetails: any): void {
    // إعلام موظف التوصيل | Notify delivery employee
    this.io.to(`user_${employeeId}`).emit(NotificationEvent.ORDER_ASSIGNED, {
      orderId,
      orderDetails,
      assignedAt: new Date(),
    });
  }
}

export default new SocketService();
```

### 8. التحقق من صحة الطلبات | Request Validation Example

```typescript
// src/utils/validation/auth.validation.ts
import Joi from 'joi';

// مخطط التحقق من التسجيل | Register validation schema
export const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'يجب أن يكون البريد الإلكتروني صالحًا | Email must be valid',
      'any.required': 'البريد الإلكتروني مطلوب | Email is required',
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      'string.min': 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل | Password must be at least 8 characters',
      'string.pattern.base': 'يجب أن تحتوي كلمة المرور على حروف كبيرة وصغيرة وأرقام ورموز | Password must contain uppercase, lowercase, numbers and symbols',
      'any.required': 'كلمة المرور مطلوبة | Password is required',
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'يجب أن تتطابق كلمتا المرور | Passwords must match',
      'any.required': 'تأكيد كلمة المرور مطلوب | Confirm password is required',
    }),
  firstName: Joi.string()
    .required()
    .messages({
      'any.required': 'الاسم الأول مطلوب | First name is required',
    }),
  lastName: Joi.string()
    .required()
    .messages({
      'any.required': 'الاسم الأخير مطلوب | Last name is required',
    }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'يجب أن يكون رقم الهاتف صالحًا | Phone number must be valid',
      'any.required': 'رقم الهاتف مطلوب | Phone number is required',
    }),
});

// مخطط التحقق من تسجيل الدخول | Login validation schema
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'يجب أن يكون البريد الإلكتروني صالحًا | Email must be valid',
      'any.required': 'البريد الإلكتروني مطلوب | Email is required',
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'كلمة المرور مطلوبة | Password is required',
    }),
});

// مخطط التحقق من تحديث التوكن | Refresh token validation schema
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'توكن التحديث مطلوب | Refresh token is required',
    }),
});

// src/utils/validation/product.validation.ts
import Joi from 'joi';

// مخطط التحقق من إضافة منتج | Add product validation schema
export const productSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'اسم المنتج مطلوب | Product name is required',
    }),
  description: Joi.string()
    .required()
    .messages({
      'any.required': 'وصف المنتج مطلوب | Product description is required',
    }),
  price: Joi.number()
    .positive()
    .required()
    .messages({
      'number.positive': 'يجب أن يكون السعر موجبًا | Price must be positive',
      'any.required': 'السعر مطلوب | Price is required',
    }),
  salePrice: Joi.number()
    .positive()
    .less(Joi.ref('price'))
    .optional()
    .messages({
      'number.positive': 'يجب أن يكون سعر البيع موجبًا | Sale price must be positive',
      'number.less': 'يجب أن يكون سعر البيع أقل من السعر الأصلي | Sale price must be less than regular price',
    }),
  costPrice: Joi.number()
    .positive()
    .required()
    .messages({
      'number.positive': 'يجب أن يكون سعر التكلفة موجبًا | Cost price must be positive',
      'any.required': 'سعر التكلفة مطلوب | Cost price is required',
    }),
  categories: Joi.array()
    .items(Joi.string())
    .min(1)
    .required()
    .messages({
      'array.min': 'يجب اختيار فئة واحدة على الأقل | At least one category must be selected',
      'any.required': 'الفئات مطلوبة | Categories are required',
    }),
  images: Joi.array()
    .items(Joi.string())
    .min(1)
    .required()
    .messages({
      'array.min': 'يجب إضافة صورة واحدة على الأقل | At least one image must be added',
      'any.required': 'الصور مطلوبة | Images are required',
    }),
  mainImage: Joi.string()
    .required()
    .messages({
      'any.required': 'الصورة الرئيسية مطلوبة | Main image is required',
    }),
  sku: Joi.string()
    .required()
    .messages({
      'any.required': 'رمز المنتج (SKU) مطلوب | SKU is required',
    }),
  stockQuantity: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.integer': 'يجب أن تكون الكمية رقمًا صحيحًا | Quantity must be an integer',
      'number.min': 'يجب أن تكون الكمية 0 على الأقل | Quantity must be at least 0',
      'any.required': 'الكمية مطلوبة | Quantity is required',
    }),
  isAvailable: Joi.boolean()
    .default(true),
  isDiscounted: Joi.boolean()
    .default(false),
  discountPercentage: Joi.number()
    .min(0)
    .max(100)
    .optional()
    .messages({
      'number.min': 'يجب أن تكون نسبة الخصم 0% على الأقل | Discount percentage must be at least 0%',
      'number.max': 'يجب أن تكون نسبة الخصم 100% كحد أقصى | Discount percentage must be at most 100%',
    }),
  barcode: Joi.string()
    .optional(),
  weight: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.positive': 'يجب أن يكون الوزن موجبًا | Weight must be positive',
    }),
  weightUnit: Joi.string()
    .optional(),
  attributes: Joi.object()
    .pattern(Joi.string(), Joi.string())
    .optional(),
});
```

## خطة التنفيذ المرحلية | Phased Implementation Plan

لضمان تنفيذ المشروع بكفاءة وجودة عالية، نقترح تنفيذه على مراحل متتالية:

### المرحلة 1: الإعداد والبنية الأساسية | Phase 1: Setup & Core Infrastructure

- إعداد مشروع Node.js مع Express و TypeScript
- إعداد قاعدة البيانات MongoDB والاتصال بها
- تنفيذ البنية الأساسية للمشروع (المجلدات، التكوين، الخ)
- إعداد نظام التسجيل والتوثيق
- تنفيذ المصادقة باستخدام JWT
- إنشاء وسطاء المصادقة والتفويض

**المدة المقدرة**: أسبوعان

### المرحلة 2: نظام المستخدمين والإدارة | Phase 2: User & Management System

- تنفيذ نماذج المستخدمين (العميل، المالك، موظف التوصيل)
- إنشاء واجهات برمجة التطبيقات لإدارة المستخدمين
- تنفيذ نظام إدارة العناوين
- إنشاء لوحة تحكم المالك الأساسية
- تنفيذ نظام إدارة الموظفين

**المدة المقدرة**: أسبوعان

### المرحلة 3: إدارة المنتجات والفئات | Phase 3: Product & Category Management

- تنفيذ نماذج المنتجات والفئات
- إنشاء واجهات برمجة التطبيقات لإدارة المنتجات
- تنفيذ نظام البحث والتصفية
- إضافة إدارة المخزون والأسعار
- تنفيذ نظام مراجعات المنتجات

**المدة المقدرة**: أسبوعان

### المرحلة 4: نظام السلة والطلبات | Phase 4: Cart & Order System

- تنفيذ نموذج سلة التسوق
- إنشاء واجهات برمجة التطبيقات لإدارة السلة
- تنفيذ عملية الطلب
- إنشاء نظام تتبع الطلبات
- تنفيذ نظام إدارة الطلبات للمالك

**المدة المقدرة**: 3 أسابيع

### المرحلة 5: نظام التوصيل | Phase 5: Delivery System

- تنفيذ واجهة موظف التوصيل
- دمج خدمات الخرائط
- تنفيذ تحديث موقع التوصيل في الوقت الحقيقي
- إنشاء نظام تعيين الطلبات للموظفين
- تنفيذ تقدير وقت التوصيل

**المدة المقدرة**: أسبوعان

### المرحلة 6: نظام الإشعارات والدردشة | Phase 6: Notification & Chat System

- إعداد Socket.io للاتصال في الوقت الحقيقي
- تنفيذ نظام الإشعارات داخل التطبيق
- دمج إشعارات البريد الإلكتروني
- إضافة نظام الدردشة بين العملاء والموظفين
- تنفيذ تنبيهات الطلبات في الوقت الحقيقي

**المدة المقدرة**: أسبوعان

### المرحلة 7: نظام الدفع والتقارير | Phase 7: Payment & Reporting System

- دمج بوابات الدفع
- تنفيذ نظام المدفوعات والاستردادات
- إنشاء التقارير والإحصائيات للمالك
- تنفيذ لوحات المعلومات التحليلية
- إضافة تصدير التقارير

**المدة المقدرة**: أسبوعان

### المرحلة 8: الاختبار والتحسين والإطلاق | Phase 8: Testing, Optimization & Launch

- إجراء اختبارات شاملة
- تحسين الأداء وقابلية التوسع
- إضافة دعم متعدد اللغات
- توثيق API
- إعداد بيئة الإنتاج والإطلاق

**المدة المقدرة**: أسبوعان

## متطلبات النظام ومواصفات الخادم | System Requirements & Server Specifications

### متطلبات الحد الأدنى | Minimum Requirements

- **النظام التشغيلي**: Linux (Ubuntu 20.04 أو أحدث)
- **وحدة المعالجة المركزية**: 4 vCPUs
- **الذاكرة**: 8GB RAM
- **التخزين**: 50GB SSD
- **النطاق الترددي**: 2TB شهريًا

### المتطلبات الموصى بها | Recommended Requirements

- **النظام التشغيلي**: Linux (Ubuntu 22.04 أو أحدث)
- **وحدة المعالجة المركزية**: 8 vCPUs
- **الذاكرة**: 16GB RAM
- **التخزين**: 100GB SSD
- **النطاق الترددي**: 5TB شهريًا

### البرمجيات | Software

- **وقت التشغيل**: Node.js v18 أو أحدث
- **قاعدة البيانات**: MongoDB v6 أو أحدث
- **خادم الويب**: Nginx كبروكسي عكسي
- **مدير العمليات**: PM2
- **نظام إدارة ذاكرة التخزين المؤقت**: Redis

## الخاتمة | Conclusion

يوفر هذا المخطط التفصيلي بنية قوية ومرنة لتطوير الجزء الخلفي من تطبيق توصيل السوبر ماركت. باستخدام TypeScript، يتم ضمان سلامة الأنواع وتحسين تجربة التطوير. من خلال الهيكل المقترح والنهج المرحلي للتنفيذ، يمكن تطوير المشروع بكفاءة وجودة عالية.

تم تصميم النظام ليكون قابلاً للتوسع والصيانة، مع مراعاة الأمان وأفضل الممارسات في تطوير واجهات برمجة التطبيقات REST. يمكن توسيع النظام مستقبلاً لإضافة ميزات جديدة مثل برامج الولاء، والتحليلات المتقدمة، ودعم المزيد من طرق الدفع، وتكامل وسائل التواصل الاجتماعي.

باستخدام Socket.io، يوفر النظام تجربة في الوقت الحقيقي مع تحديثات فورية لحالة الطلبات، وموقع التوصيل، والإشعارات، مما يعزز تجربة المستخدم ويزيد من رضا العملاء.

This detailed blueprint provides a robust and flexible architecture for developing the backend of the Supermarket Delivery Application. Using TypeScript ensures type safety and improves the development experience. With the proposed structure and phased approach to implementation, the project can be developed efficiently and with high quality.

The system is designed to be scalable and maintainable, with security and REST API best practices in mind. The system can be expanded in the future to add new features such as loyalty programs, advanced analytics, support for more payment methods, and social media integration.

Using Socket.io, the system provides a real-time experience with instant updates for order status, delivery location, and notifications, enhancing the user experience and increasing customer satisfaction. 
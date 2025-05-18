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

// واجهة مراجعة المنتج | Product Review Interface
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
  CREATE_PRODUCT = 'create:product',
  UPDATE_PRODUCT = 'update:product',
  DELETE_PRODUCT = 'delete:product',
  MANAGE_ORDERS = 'manage:orders',
  MANAGE_EMPLOYEES = 'manage:employees',
  VIEW_ANALYTICS = 'view:analytics',
  // ... المزيد من الأذونات | more permissions
}

// ربط الأدوار بالأذونات | Role-Permission Mapping
export const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.OWNER]: [
    Permission.CREATE_PRODUCT,
    Permission.UPDATE_PRODUCT,
    Permission.DELETE_PRODUCT,
    Permission.MANAGE_ORDERS,
    Permission.MANAGE_EMPLOYEES,
    Permission.VIEW_ANALYTICS,
    // ... جميع الأذونات | all permissions
  ],
  [UserRole.CUSTOMER]: [
    // ... أذونات العميل | customer permissions
  ],
  [UserRole.DELIVERY]: [
    // ... أذونات موظف التوصيل | delivery employee permissions
  ],
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

## الخاتمة | Conclusion

هذا المخطط يقدم بنية شاملة للجزء الخلفي من تطبيق توصيل السوبر ماركت، ويتضمن جميع الواجهات ونقاط النهاية API اللازمة لدعم الوظائف المطلوبة. تم تصميم البنية بشكل مفصل مع التركيز على قابلية التوسع والصيانة، باستخدام TypeScript لضمان التطبيق النموذجي.

يمكن تنفيذ هذا المخطط على مراحل، مع البدء بالمكونات الأساسية مثل المصادقة وإدارة المستخدمين والمنتجات، ثم إضافة الميزات المتقدمة مثل الإشعارات في الوقت الحقيقي وتتبع التوصيل.

This architecture provides a comprehensive backend structure for the Supermarket Delivery Application, including all interfaces and API endpoints needed to support the required functionality. The architecture is designed in detail with a focus on scalability and maintainability, using TypeScript to ensure type-safe implementation.

This plan can be implemented in phases, starting with core components like authentication, user management, and products, then adding advanced features like real-time notifications and delivery tracking.

This architecture provides a comprehensive backend structure for the Supermarket Delivery Application, including all interfaces and API endpoints needed to support the required functionality. The architecture is designed in detail with a focus on scalability and maintainability, using TypeScript to ensure type-safe implementation.

This plan can be implemented in phases, starting with core components like authentication, user management, and products, then adding advanced features like real-time notifications and delivery tracking. 
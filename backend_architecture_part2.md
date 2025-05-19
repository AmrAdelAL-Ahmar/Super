
# part 2
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

## الخاتمة | Conclusion

يوفر هذا المخطط التفصيلي بنية قوية ومرنة لتطوير الجزء الخلفي من تطبيق توصيل السوبر ماركت. باستخدام TypeScript، يتم ضمان سلامة الأنواع وتحسين تجربة التطوير. من خلال الهيكل المقترح والنهج المرحلي للتنفيذ، يمكن تطوير المشروع بكفاءة وجودة عالية.

تم تصميم النظام ليكون قابلاً للتوسع والصيانة، مع مراعاة الأمان وأفضل الممارسات في تطوير واجهات برمجة التطبيقات REST. يمكن توسيع النظام مستقبلاً لإضافة ميزات جديدة مثل برامج الولاء، والتحليلات المتقدمة، ودعم المزيد من طرق الدفع، وتكامل وسائل التواصل الاجتماعي.

باستخدام Socket.io، يوفر النظام تجربة في الوقت الحقيقي مع تحديثات فورية لحالة الطلبات، وموقع التوصيل، والإشعارات، مما يعزز تجربة المستخدم ويزيد من رضا العملاء.

This detailed blueprint provides a robust and flexible architecture for developing the backend of the Supermarket Delivery Application. Using TypeScript ensures type safety and improves the development experience. With the proposed structure and phased approach to implementation, the project can be developed efficiently and with high quality.

The system is designed to be scalable and maintainable, with security and REST API best practices in mind. The system can be expanded in the future to add new features such as loyalty programs, advanced analytics, support for more payment methods, and social media integration.

Using Socket.io, the system provides a real-time experience with instant updates for order status, delivery location, and notifications, enhancing the user experience and increasing customer satisfaction. 
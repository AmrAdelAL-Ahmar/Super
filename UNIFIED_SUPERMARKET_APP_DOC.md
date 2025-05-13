# نظرة عامة على مشروع تطبيق السوبر ماركت متعدد المستأجرين

يهدف هذا المشروع إلى بناء تطبيق سوبر ماركت متعدد المستأجرين يدعم تخصيص الواجهات والوظائف لكل سوبر ماركت (مستأجر) مع الحفاظ على بنية تقنية موحدة وقابلة للتوسع. يوفر النظام واجهات مخصصة للعميل وموظف التوصيل وصاحب السوبر ماركت، ويعتمد على تقنيات حديثة مثل Next.js وReact وTypeScript وRedux Toolkit.

---

## البنية التقنية للمشروع

### الواجهة الأمامية (Frontend)

- **Next.js**: إطار عمل React متقدم يدعم التوجيه، SSR، SSG، وتحسين الأداء.
- **React**: لبناء واجهات المستخدم التفاعلية.
- **Redux & Redux Toolkit**: لإدارة الحالة المركزية للتطبيق.
- **CSS Modules/Styled Components**: لتخصيص التصميم حسب المستأجر.

### الواجهة الخلفية (Backend)

- **Node.js/Express**: لبناء RESTful APIs.
- **MongoDB**: قاعدة بيانات NoSQL مرنة تدعم تعدد المستأجرين.
- **JWT/Auth**: للتحقق من الهوية والصلاحيات.

### هيكلة المشروع

- src/
  - components/
  - pages/
  - redux/
  - api/
  - types/
- routes/
- middlewares/
- utils/
- admin-panel/

---

## هيكلة قاعدة البيانات (نماذج رئيسية)

### نموذج المستأجر (Tenant)

```javascript
{
  _id: ObjectId,
  name: String,
  domain: String,
  logo: String,
  theme: { primaryColor: String, secondaryColor: String, fontFamily: String },
  settings: { deliveryFee: Number, minOrderAmount: Number, workingHours: Object },
  active: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### نموذج المستخدم (User)

```javascript
{
  _id: ObjectId,
  tenantId: ObjectId,
  role: String, // (مدير، موظف، عميل، موصل)
  name: String,
  email: String,
  password: String,
  phone: String,
  address: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### نموذج المنتج (Product)

```javascript
{
  _id: ObjectId,
  tenantId: ObjectId,
  name: String,
  category: String,
  price: Number,
  discountPrice: Number,
  stock: Number,
  images: [String],
  description: String,
  active: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## تفاصيل واجهات المستخدم

### 1. واجهة العميل

- الصفحة الرئيسية: عرض الفئات، المنتجات المميزة، شريط بحث، تصفية المنتجات.
- صفحة المنتج: صور وتفاصيل، السعر، زر إضافة للسلة، تقييمات.
- سلة التسوق: قائمة المنتجات، تعديل الكميات، حساب المجموع.
- صفحة الدفع: إدخال العنوان، اختيار الدفع، مراجعة الطلب.
- حساب المستخدم: الملف الشخصي، سجل الطلبات، العناوين، طرق الدفع.
- تتبع الطلبات: حالة الطلب، تتبع موظف التوصيل، تقدير الوقت، التواصل مع الموظف.

#### نموذج TypeScript لواجهة العميل

```typescript
interface Customer {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  preferredLanguage: "ar" | "en";
  darkMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}
interface Address {
  id: string;
  title: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
  location: { type: "Point"; coordinates: [number, number] };
}
interface CartItem {
  productId: string;
  name: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  image: string;
}
interface Cart {
  customerId: string;
  tenantId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}
interface Order {
  id: string;
  tenantId: string;
  customerId: string;
  deliveryPersonId?: string;
  items: OrderItem[];
  status:
    | "pending"
    | "processing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  deliveryAddress: Address;
  paymentMethod: "cash" | "credit_card" | "online";
  paymentStatus: "pending" | "paid" | "failed";
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}
```

---

### 2. واجهة موظف التوصيل

- لوحة القيادة: ملخص الطلبات، إحصائيات، حالة الحساب.
- قائمة الطلبات: عرض الطلبات المسندة، تفاصيل الطلب، قبول/رفض الطلبات.
- تفاصيل الطلب: المنتجات، معلومات العميل، العنوان، خيارات الاتصال.
- خريطة التوصيل: موقع العميل، التوجيه، تقدير الوقت.
- تأكيد التسليم: تحديث الحالة، التقاط صورة، ملاحظات.
- سجل التوصيل: تاريخ التوصيلات، تقييمات، إحصائيات الأداء.

#### نموذج TypeScript لواجهة موظف التوصيل

```typescript
interface DeliveryPerson {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  status: "online" | "offline" | "busy";
  currentLocation: { type: "Point"; coordinates: [number, number] };
  ratings: number;
  totalDeliveries: number;
  preferredLanguage: "ar" | "en";
  darkMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}
interface DeliveryTask {
  id: string;
  orderId: string;
  deliveryPersonId: string;
  status:
    | "assigned"
    | "accepted"
    | "picked_up"
    | "on_the_way"
    | "delivered"
    | "cancelled";
  assignedAt: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  customerLocation: { type: "Point"; coordinates: [number, number] };
  estimatedDistance: number;
  estimatedDuration: number;
  actualDuration?: number;
  notes?: string;
}
interface DeliveryRating {
  id: string;
  deliveryTaskId: string;
  customerId: string;
  deliveryPersonId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}
```

---

## واجهة صاحب السوبر ماركت

- لوحة التحكم: ملخص المبيعات، الطلبات النشطة، تقارير.
- إدارة المنتجات: إضافة/تعديل/حذف، تصنيف، صور.
- إدارة الموظفين: إضافة موظفين، تعيين مناطق.
- إدارة الطلبات: عرض وتأكيد وتعيين وتتبع الطلبات.

---

## آلية عمل النظام متعدد المستأجرين

- تحميل بيانات المستأجر من الخادم.
- تخصيص السمات والألوان والشعارات.
- استخدام مكونات قابلة للتخصيص حسب إعدادات المستأجر.

---

## تنفيذ TypeScript في المشروع

### فوائد استخدام TypeScript

1. سلامة الأنواع واكتشاف الأخطاء مبكرًا.
2. توثيق ذاتي للواجهات.
3. تحسين تجربة التطوير.
4. صيانة أسهل.
5. تكامل أفضل مع الأدوات.

### إعداد TypeScript مع Next.js

1. تثبيت التبعيات:

```bash
npm install --save-dev typescript @types/react @types/node
```

2. تكوين tsconfig.json:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

3. تحويل الملفات إلى TypeScript: تغيير الامتدادات من .js إلى .ts و .jsx إلى .tsx

---

## مثال عملي: مكون سلة التسوق (React + TypeScript)

```tsx
import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { CartItem as CartItemType } from "@/types";
import { updateItemQuantity, removeItem } from "@/redux/slices/cartSlice";

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useDispatch();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const quantity = parseInt(e.target.value);
    dispatch(updateItemQuantity({ productId: item.productId, quantity }));
  };

  const handleRemove = () => {
    dispatch(removeItem(item.productId));
  };

  return (
    <div className='cart-item'>
      <div className='cart-item-image'>
        <Image src={item.image} alt={item.name} width={80} height={80} />
      </div>
      <div className='cart-item-details'>
        <h3>{item.name}</h3>
        <p className='cart-item-price'>
          {item.discountPrice ? (
            <>
              <span className='original-price'>{item.price} ريال</span>
              <span className='discount-price'>{item.discountPrice} ريال</span>
            </>
          ) : (
            <span>{item.price} ريال</span>
          )}
        </p>
      </div>
      <div className='cart-item-actions'>
        <select
          value={item.quantity}
          onChange={handleQuantityChange}
          className='quantity-select'
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <button onClick={handleRemove} className='remove-button'>
          إزالة
        </button>
      </div>
    </div>
  );
};

export default CartItem;
```

---

## الخلاصة

تم توحيد وتوضيح جميع المعلومات الأساسية حول البنية التقنية، نماذج البيانات، واجهات المستخدم، وآلية العمل، مع أمثلة عملية على استخدام TypeScript في التطبيق. هذه الوثيقة مرجعية شاملة لتطوير وصيانة تطبيق السوبر ماركت متعدد المستأجرين.

---
Remove-Item -Recurse -Force .next; npm run build
## MULTI_TENANT_SUPERMARKET_ROADMAP.md قم بانشاء هذا المشروع واستخدم التايب سكربت وقبل انتنشاء انشاء خريقة التواصل و تفاصيل لكل مهمه تقوم بها اريدك ان تشائه كامل هل تستطيغ ذالك دون التوقف وحتلى اذا توقفت يكون لديك خريطة تمشي عليها وتكمل منها ويكون لديك تقنيات و ضوابط تتبعها لكتابت الكود , ابدا بنشاء التايب للمشروع كامل

اريد ان نصمم انا وانت تطبيق للطلب <لسوبر ماركت > يكون فية صفحة لأدخال المنتجات وصفحه لتسعيرها وصفحه للعملاء وصفحة لموضف التوصيل . بحيث يكون صاحب السوبر يدخل منتجاته ويحدد السعر ,ويحدد من الموظفين ,والعميل يدخل البرنامج يقوم با انشاء حساب له ثم يقوم باختيار المنتجات وتحديد عددها ويضهر له السعر ثم يحدد موقعه ييقوم بارسال الطلب , توصل رسالة الى صاحب السوبر بالطلب كامل.يفتح الرسالة يقوم بتأكيدعلى الطلب بان الكميه المطلوبه موجودة لديه ويتحديد موظف التوصيل ويضغط على رز توصيل . فيضاف الطلب الى قائم للطلابات الجاري توصيلها , موظف التوصيل (يكون لديه حساب اسم وكلمة سر انشائها صاحب السوبر ) يفتح التطبيق يسجل دخول , تظهر له الرسائل الطلابات الموجهه اليه لتوصيلها , يحدد الطلب و ظهر المنتجات وموقع العميل و <ويتم اظهار خريطة لمكان العميل وكم المسافة>, عندما يصل الموظف اللى مكان العميل يرسل رساله الى العمل تكون اشاره على ان الموظف امام المكان الذي طلب الطلبية , يستلم العميل الطلب و ظغط تم التسليم , ترسل رسالة الى صاحب السوبر تم استلم الطلب , وهكذا ,,
(next,js react redux redux tolkit RTQ roting ,node.js mongDB,i18next   ,taillwind,material UI , motion ,  typescript ,any libliery  for style  UI/UX very gode )
 يدعم اكثر من الغة ويدعم العربية والانجليزية 
هل لديك اضافات على السيناريو .

ما هى البنيه واللغة والتقنيات التي يجب ان نستخدمها لتصميمه وما هي اقتراحاتك

واريد ان يكون التطبيق(muilt-vrndor ) يمكن ان يكون لاكثر من سوبر ما ركت بحيث كل سوبر يكون لدية تطبيقه الخاص و شعاراته وشكله ولونه , ياتي صاحب السوبر ويطلب مني ثم اسجل بياناته واعطيه تطبيقه الخاص , هل يمكننا صنع ذالك وااستخدم هذا معا اضافاتك ,(next,js react redux redux tolkit RTQ roting ,node.js mongDB )وانشاء في ملفmd جديد

تعدد اللغات و يكون فيه شكل كبير على الستايل ويكون هناك نمطين ابيض واسود

اكتب كل هذا دخل

Rodmap folder

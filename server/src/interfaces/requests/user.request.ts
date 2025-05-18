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

// واجهة طلب تصفية المستخدمين | Filter Users Request Interface
export interface IFilterUsersRequest {
  role?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} 
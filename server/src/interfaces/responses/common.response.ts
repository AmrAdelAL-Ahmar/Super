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

// واجهة استجابة النجاح | Success Response Interface
export interface ISuccessResponse {
  success: boolean;
  message: string;
}

// واجهة استجابة التصفية | Filter Response Interface
export interface IFilterResponse<T> {
  data: T[];
  filters: {
    [key: string]: any;
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
} 